/**
 * Sending engine — the pipeline that ties every module together.
 *
 * Generation stage (per pending lead):
 *   validate -> analyze -> score -> gate -> select offer -> generate ->
 *   quality review -> spam check -> save approved email (status "ready")
 *
 * Send stage (per "ready" lead):
 *   enforce daily/hourly limits -> deliver (Gmail send/draft, or dry-run) ->
 *   log to sent-log -> mark "sent" -> schedule follow-up
 *
 * Nothing here throws on a single bad lead; failures are logged and the run
 * continues. In dry-run mode everything runs except real delivery.
 */
import fs from "node:fs";
import path from "node:path";
import type {
  GeneratedEmail,
  Lead,
  MailAdapter,
  OutreachConfig,
  QualityReview,
} from "./types";
import { getGmailEnv, PATHS } from "./config";
import { log } from "./logger";
import { loadLeads, saveLeads } from "./lead-importer";
import { validateLead } from "./lead-validator";
import { analyzeBusiness } from "./website-analyzer";
import { scoreLead } from "./lead-scorer";
import { selectOffer } from "./offer-selector";
import { generateEmail } from "./email-generator";
import { reviewEmail } from "./quality-reviewer";
import { checkSpam } from "./spam-checker";
import { getMailAdapter, MissingCredsError } from "./gmail-client";
import { PROBLEM_META } from "./knowledge";
import { isDoNotContact, loadDoNotContact } from "./compliance/do-not-contact";
import { checkReputationPause } from "./reputation/reputation";
import { addBusinessDays, nowIso } from "./time";
import {
  appendBlocked,
  appendSent,
  loadSent,
  nextSentId,
  remainingSendAllowance,
  SentRow,
} from "./store";

/** A generated-and-approved email persisted between the generate and send stages. */
interface ApprovedEmail {
  lead_id: string;
  business_name: string;
  email: string;
  type: string;
  subject: string;
  body: string;
  offer: string;
  offer_name: string;
  focus_problem: string;
  quality_score: number;
  spam_score: number;
  lead_score: number;
  confidence: number;
  generated_at: string;
  status: "approved";
}

/** Minimum analysis confidence required to contact a lead. */
const MIN_CONFIDENCE = 50;

export interface RunSummary {
  mode: string;
  generated: number;
  ready: number;
  sent: number;
  skipped: number;
  qualityFailed: number;
  spamBlocked: number;
  sendErrors: number;
  limitReached: boolean;
  notes: string[];
}

function emptySummary(mode: string): RunSummary {
  return {
    mode,
    generated: 0,
    ready: 0,
    sent: 0,
    skipped: 0,
    qualityFailed: 0,
    spamBlocked: 0,
    sendErrors: 0,
    limitReached: false,
    notes: [],
  };
}

// ---------------------------------------------------------------------------
// Approved-email persistence (generated/emails/<lead_id>.json + .md)
// ---------------------------------------------------------------------------

function approvedJsonPath(leadId: string): string {
  return path.join(PATHS.generated.emails, `${leadId}.json`);
}

function saveApprovedEmail(a: ApprovedEmail): void {
  fs.mkdirSync(PATHS.generated.emails, { recursive: true });
  fs.writeFileSync(approvedJsonPath(a.lead_id), JSON.stringify(a, null, 2), "utf8");
  const md =
    `# ${a.business_name} — ${a.offer_name}\n\n` +
    `- Lead: ${a.lead_id}\n- E-posta: ${a.email}\n- Kalite: ${a.quality_score}/100 · Spam: ${a.spam_score} · Lead skoru: ${a.lead_score}\n` +
    `- Üretildi: ${a.generated_at}\n\n**Konu:** ${a.subject}\n\n---\n\n${a.body}\n`;
  fs.writeFileSync(path.join(PATHS.generated.emails, `${a.lead_id}.md`), md, "utf8");
}

function loadApprovedEmail(leadId: string): ApprovedEmail | null {
  const p = approvedJsonPath(leadId);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as ApprovedEmail;
  } catch {
    return null;
  }
}

function writeFailedEmail(lead: Lead, email: GeneratedEmail, review: QualityReview): void {
  fs.mkdirSync(PATHS.generated.emails, { recursive: true });
  const md =
    `# ${lead.business_name} — KALİTE BAŞARISIZ (${review.score}/100)\n\n` +
    `**Konu:** ${email.subject}\n\n**Nedenler:**\n${review.failReasons.map((r) => `- ${r}`).join("\n")}\n\n---\n\n${email.body}\n`;
  fs.writeFileSync(path.join(PATHS.generated.emails, `${lead.lead_id}.failed.md`), md, "utf8");
}

/** Approved email bodies (with their lead id) for near-duplicate detection. */
function loadPreviousBodies(): { lead_id: string; body: string }[] {
  if (!fs.existsSync(PATHS.generated.emails)) return [];
  const out: { lead_id: string; body: string }[] = [];
  for (const f of fs.readdirSync(PATHS.generated.emails)) {
    if (!f.endsWith(".json")) continue;
    try {
      const a = JSON.parse(fs.readFileSync(path.join(PATHS.generated.emails, f), "utf8")) as ApprovedEmail;
      if (a.body) out.push({ lead_id: a.lead_id, body: a.body });
    } catch {
      /* ignore malformed */
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Generation stage
// ---------------------------------------------------------------------------

/** True for leads that are candidates for a fresh generation pass. */
function isPending(lead: Lead): boolean {
  const s = lead.status.trim().toLowerCase();
  return s === "" || s === "pending";
}

/**
 * Run generation for every pending lead. Marks each lead ready / skipped /
 * blocked and writes approved emails to disk. Does NOT send anything.
 */
export function runGenerate(config: OutreachConfig): RunSummary {
  const summary = emptySummary(config.dryRun ? "dry-run" : config.autoSendEnabled ? "send" : "draft");
  const leads = loadLeads();
  const previousBodies = loadPreviousBodies();

  log.section("Üretim (analiz → skor → teklif → e-posta → kalite → spam)");

  for (const lead of leads) {
    if (!isPending(lead)) continue;
    summary.generated++;

    // 1) Validate
    const validation = validateLead(lead);
    if (!validation.sendable) {
      lead.status = "skipped";
      lead.notes = trimNote(`Atlandı: ${validation.reasons.join("; ")}`);
      summary.skipped++;
      log.warn(`${lead.lead_id} ${lead.business_name}: atlandı — ${validation.reasons[0]}`);
      continue;
    }

    // 1b) Compliance: never contact a suppressed (do-not-contact) business.
    if (isDoNotContact({ email: lead.email, website: lead.website, business_name: lead.business_name, city: lead.city })) {
      lead.status = "skipped";
      lead.notes = trimNote("Atlandı: do-not-contact listesinde");
      summary.skipped++;
      log.warn(`${lead.lead_id} ${lead.business_name}: do-not-contact — atlandı`);
      continue;
    }

    // 2) Analyze + 3) Score
    const analysis = analyzeBusiness(lead);
    const score = scoreLead(lead, analysis, validation);
    lead.lead_score = String(score.score);
    if (!lead.observed_problem.trim() && analysis.detectedProblems[0]) {
      lead.observed_problem = PROBLEM_META[analysis.detectedProblems[0]].label;
    }

    // 4) Gates — do not send if score low, confidence low, or no specific problem
    if (score.score < config.minLeadScoreToSend) {
      lead.status = "skipped";
      lead.notes = trimNote(`Atlandı: lead skoru ${score.score} < ${config.minLeadScoreToSend}`);
      summary.skipped++;
      log.warn(`${lead.lead_id} ${lead.business_name}: düşük skor (${score.score})`);
      continue;
    }
    if (analysis.confidenceScore < MIN_CONFIDENCE) {
      lead.status = "skipped";
      lead.notes = trimNote(`Atlandı: düşük güven (${analysis.confidenceScore})`);
      summary.skipped++;
      log.warn(`${lead.lead_id} ${lead.business_name}: düşük güven (${analysis.confidenceScore})`);
      continue;
    }
    if (analysis.detectedProblems.length === 0) {
      lead.status = "skipped";
      lead.notes = trimNote("Atlandı: belirgin bir sorun tespit edilemedi");
      summary.skipped++;
      continue;
    }

    // 5) Offer + 6) Generate
    const selection = selectOffer(lead, analysis);
    if (!lead.suggested_offer.trim()) lead.suggested_offer = selection.offerName;
    const email = generateEmail(lead, analysis, selection, config);

    // 7) Quality review
    const review = reviewEmail(email, lead, analysis, config);
    if (!review.passed) {
      writeFailedEmail(lead, email, review);
      lead.status = "skipped";
      lead.notes = trimNote(`Kalite <${config.minEmailQualityScoreToSend}: ${review.failReasons.join("; ")}`);
      summary.qualityFailed++;
      log.warn(`${lead.lead_id} ${lead.business_name}: kalite ${review.score}/100 — gönderilmeyecek`);
      continue;
    }

    // 8) Spam check — compare against OTHER leads' emails only (a lead's own
    // prior/regenerated copy must not count as a near-duplicate of itself).
    const otherBodies = previousBodies.filter((b) => b.lead_id !== lead.lead_id).map((b) => b.body);
    const spam = checkSpam(email, otherBodies, config);
    if (spam.blocked) {
      appendBlocked({
        lead_id: lead.lead_id,
        business_name: lead.business_name,
        email: lead.email,
        reason: spam.reasons.join("; "),
        blocked_at: nowIso(),
      });
      lead.status = "blocked";
      lead.notes = trimNote(`Spam engeli: ${spam.reasons.join("; ")}`);
      summary.spamBlocked++;
      log.warn(`${lead.lead_id} ${lead.business_name}: spam engeli — ${spam.reasons[0]}`);
      continue;
    }

    // 9) Approve
    const approved: ApprovedEmail = {
      lead_id: lead.lead_id,
      business_name: lead.business_name,
      email: lead.email,
      type: "cold",
      subject: email.subject,
      body: email.body,
      offer: email.offer,
      offer_name: email.offerName,
      focus_problem: selection.focusProblem ?? "",
      quality_score: review.score,
      spam_score: spam.score,
      lead_score: score.score,
      confidence: analysis.confidenceScore,
      generated_at: nowIso(),
      status: "approved",
    };
    saveApprovedEmail(approved);
    previousBodies.push({ lead_id: lead.lead_id, body: email.body });
    lead.status = "ready";
    lead.notes = trimNote(`Hazır: ${email.offerName} · kalite ${review.score}/100 · skor ${score.score}`);
    summary.ready++;
    log.success(`${lead.lead_id} ${lead.business_name}: HAZIR → ${email.offerName} (kalite ${review.score})`);
  }

  saveLeads(leads);
  return summary;
}

// ---------------------------------------------------------------------------
// Send stage
// ---------------------------------------------------------------------------

/** Remaining sends allowed in this single invocation (min of daily & hourly). */
function remainingThisRun(config: OutreachConfig): number {
  return remainingSendAllowance(config.dailySendLimit, config.hourlySendLimit);
}

/**
 * Send every "ready" lead (up to the run limit) via the configured adapter.
 * Reuses the approved email from the generation stage.
 */
export async function runSend(config: OutreachConfig, summaryIn?: RunSummary): Promise<RunSummary> {
  const summary = summaryIn ?? emptySummary(config.dryRun ? "dry-run" : config.autoSendEnabled ? "send" : "draft");
  const leads = loadLeads();
  const ready = leads.filter((l) => l.status.trim().toLowerCase() === "ready");

  log.section(`Gönderim (mod: ${summary.mode})`);
  if (ready.length === 0) {
    log.info("Gönderilecek hazır e-posta yok.");
    return summary;
  }

  // Reputation guard: pause real sending on bad sending health. Dry-run only
  // warns (it never sends), so a dry-run always stays fully demonstrable.
  const pause = checkReputationPause(config);
  if (pause.paused) {
    log.warn(`İtibar koruması: ${pause.reasons.join("; ")}`);
    summary.notes.push(`Reputation pause: ${pause.reasons.join("; ")}`);
    if (!config.dryRun) {
      log.warn("Gerçek gönderim itibar koruması nedeniyle durduruldu.");
      return summary;
    }
  }

  let adapter: MailAdapter;
  try {
    adapter = getMailAdapter(config, getGmailEnv());
  } catch (err) {
    if (err instanceof MissingCredsError) {
      log.error(err.message);
      summary.notes.push(err.message);
      return summary;
    }
    throw err;
  }

  let allowance = remainingThisRun(config);
  log.info(
    `Bu çalışmada gönderim izni: ${allowance} ` +
      `(günlük limit ${config.dailySendLimit}, saatlik ${config.hourlySendLimit}). Mod: ${adapter.mode}`,
  );

  // Compliance is re-checked at the actual point of sending: a lead marked
  // "ready" in an earlier run may since have been suppressed.
  const dncRows = loadDoNotContact();

  for (const lead of ready) {
    if (allowance <= 0) {
      summary.limitReached = true;
      log.warn("Limit doldu — kalan hazır e-postalar sonraki çalışmaya bırakıldı.");
      break;
    }
    if (isDoNotContact({ email: lead.email, website: lead.website, business_name: lead.business_name, city: lead.city }, dncRows)) {
      lead.status = "skipped";
      lead.notes = trimNote("Gönderim atlandı: do-not-contact listesinde");
      log.warn(`${lead.lead_id} ${lead.business_name}: do-not-contact — gönderilmedi`);
      continue;
    }
    const approved = loadApprovedEmail(lead.lead_id);
    if (!approved) {
      log.warn(`${lead.lead_id}: onaylı e-posta bulunamadı, atlanıyor.`);
      continue;
    }

    const result = await adapterDeliver(adapter, lead, approved);
    const sent = loadSent();
    const row: SentRow = {
      sent_id: nextSentId(sent),
      lead_id: lead.lead_id,
      business_name: lead.business_name,
      email: lead.email,
      type: "cold",
      offer: approved.offer,
      subject: approved.subject,
      quality_score: String(approved.quality_score),
      spam_score: String(approved.spam_score),
      mode: result.mode,
      status: result.ok ? "ok" : "error",
      sent_at: nowIso(),
      message_id: result.messageId,
      error: result.error ?? "",
    };
    appendSent(row);

    if (result.ok) {
      const now = nowIso();
      lead.status = "sent";
      lead.last_contacted_at = now;
      lead.next_followup_at = config.followupsEnabled
        ? addBusinessDays(new Date(), config.followup1DelayBusinessDays).toISOString()
        : "";
      lead.notes = trimNote(`${labelForMode(result.mode)} · ${approved.offer_name}`);
      summary.sent++;
      // Only real deliveries consume quota; dry-run is unlimited across runs but
      // still paced within a single run.
      allowance--;
      log.success(`${lead.lead_id} ${lead.business_name}: ${labelForMode(result.mode)} (${approved.offer_name})`);
    } else {
      summary.sendErrors++;
      lead.notes = trimNote(`Gönderim hatası: ${result.error ?? "bilinmiyor"}`);
      log.error(`${lead.lead_id} ${lead.business_name}: gönderim hatası — ${result.error}`);
    }
  }

  saveLeads(leads);
  return summary;
}

async function adapterDeliver(adapter: MailAdapter, lead: Lead, approved: ApprovedEmail) {
  return adapter.deliver({ to: lead.email, subject: approved.subject, body: approved.body });
}

function labelForMode(mode: string): string {
  if (mode === "send") return "GÖNDERİLDİ";
  if (mode === "draft") return "TASLAK OLUŞTURULDU";
  return "DRY-RUN (gönderilmedi)";
}

/** Full pipeline: generate, then send up to the limit. */
export async function runStart(config: OutreachConfig): Promise<RunSummary> {
  const summary = runGenerate(config);
  return runSend(config, summary);
}

/** Trim overly long note fields so leads.csv stays readable. */
function trimNote(note: string): string {
  return note.length > 240 ? note.slice(0, 237) + "…" : note;
}
