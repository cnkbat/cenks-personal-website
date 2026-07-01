/**
 * Follow-up engine. Sends up to two automated follow-ups per lead:
 *   follow-up 1 — 3 business days after the cold email
 *   follow-up 2 — 7 business days after the cold email
 *
 * Never follows up a lead that replied, opted out, bounced, or was blocked, and
 * never sends more than two. Follow-ups count toward the same daily/hourly
 * limits as cold emails.
 */
import type { Lead, MailAdapter, OutreachConfig } from "./types";
import { getGmailEnv } from "./config";
import { log } from "./logger";
import { loadLeads, saveLeads } from "./lead-importer";
import { analyzeBusiness } from "./website-analyzer";
import { selectOffer } from "./offer-selector";
import { generateFollowup } from "./email-generator";
import { reviewEmail } from "./quality-reviewer";
import { checkSpam } from "./spam-checker";
import { getMailAdapter, MissingCredsError } from "./gmail-client";
import { isDoNotContact, loadDoNotContact } from "./compliance/do-not-contact";
import { checkReputationPause } from "./reputation/reputation";
import { addBusinessDays, isDueOrPast, nowIso } from "./time";
import {
  appendFollowup,
  FollowupRow,
  loadFollowups,
  nextFollowupId,
  remainingSendAllowance,
} from "./store";

export interface FollowupSummary {
  mode: string;
  due: number;
  sent: number;
  skipped: number;
  errors: number;
  limitReached: boolean;
  notes: string[];
}

/** Reply states that permanently stop follow-ups. */
const STOP_REPLY_STATES = new Set(["replied", "interested", "not_interested", "opt_out"]);

/** Which follow-up number is next for a lead, or null if none is due. */
function nextFollowupNumber(lead: Lead): 1 | 2 | null {
  const status = lead.status.trim().toLowerCase();
  if (status === "sent") return 1;
  if (status === "followup_1_sent") return 2;
  return null;
}

function eligible(lead: Lead): boolean {
  if (STOP_REPLY_STATES.has(lead.reply_status.trim().toLowerCase())) return false;
  if (nextFollowupNumber(lead) === null) return false;
  return isDueOrPast(lead.next_followup_at);
}

export async function runFollowups(config: OutreachConfig): Promise<FollowupSummary> {
  const mode = config.dryRun ? "dry-run" : config.autoSendEnabled ? "send" : "draft";
  const summary: FollowupSummary = {
    mode,
    due: 0,
    sent: 0,
    skipped: 0,
    errors: 0,
    limitReached: false,
    notes: [],
  };

  log.section(`Takip e-postaları (mod: ${mode})`);

  if (!config.followupsEnabled) {
    log.info("Takipler config'de kapalı (followupsEnabled=false).");
    return summary;
  }

  const leads = loadLeads();
  const dueLeads = leads.filter(eligible);
  summary.due = dueLeads.length;
  if (dueLeads.length === 0) {
    log.info("Zamanı gelen takip yok.");
    return summary;
  }

  // Reputation guard: follow-ups are real emails from the same pool as cold
  // emails, so they honor the same pause. Dry-run only warns (it never sends).
  const pause = checkReputationPause(config);
  if (pause.paused) {
    log.warn(`İtibar koruması: ${pause.reasons.join("; ")}`);
    summary.notes.push(`Reputation pause: ${pause.reasons.join("; ")}`);
    if (!config.dryRun) {
      log.warn("Takip gönderimi itibar koruması nedeniyle durduruldu.");
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

  let allowance = remainingSendAllowance(config.dailySendLimit, config.hourlySendLimit);
  log.info(`Takip gönderim izni: ${allowance} · zamanı gelen: ${dueLeads.length}`);

  const dncRows = loadDoNotContact();

  for (const lead of dueLeads) {
    if (allowance <= 0) {
      summary.limitReached = true;
      log.warn("Limit doldu — kalan takipler sonraki çalışmaya bırakıldı.");
      break;
    }
    const n = nextFollowupNumber(lead);
    if (n === null) continue;

    // Compliance: never follow up a suppressed business.
    if (isDoNotContact({ email: lead.email, website: lead.website, business_name: lead.business_name, city: lead.city }, dncRows)) {
      summary.skipped++;
      log.warn(`${lead.lead_id}: do-not-contact — takip atlandı.`);
      continue;
    }

    // Reconstruct the offer so the follow-up stays consistent with the cold email.
    const analysis = analyzeBusiness(lead);
    const selection = selectOffer(lead, analysis);
    const email = generateFollowup(lead, selection, config, n);

    // Quality + spam (similarity check disabled for short reminders).
    const review = reviewEmail(email, lead, analysis, config);
    const spam = checkSpam(email, [], config);
    if (!review.passed || spam.blocked) {
      summary.skipped++;
      lead.notes = `Takip ${n} atlandı: ${!review.passed ? review.failReasons[0] : spam.reasons[0]}`;
      log.warn(`${lead.lead_id}: takip ${n} kalite/spam nedeniyle atlandı.`);
      continue;
    }

    const scheduledFor = lead.next_followup_at;
    const result = await adapter.deliver({ to: lead.email, subject: email.subject, body: email.body });
    const fups = loadFollowups();
    const row: FollowupRow = {
      followup_id: nextFollowupId(fups),
      lead_id: lead.lead_id,
      business_name: lead.business_name,
      email: lead.email,
      followup_number: String(n),
      scheduled_for: scheduledFor,
      status: result.ok ? "ok" : "error",
      sent_at: nowIso(),
      subject: email.subject,
      quality_score: String(review.score),
      mode: result.mode,
      message_id: result.messageId,
      error: result.error ?? "",
    };
    appendFollowup(row);

    if (result.ok) {
      const now = nowIso();
      lead.last_contacted_at = now;
      if (n === 1) {
        lead.status = "followup_1_sent";
        lead.next_followup_at = addBusinessDays(
          new Date(),
          Math.max(1, config.followup2DelayBusinessDays - config.followup1DelayBusinessDays),
        ).toISOString();
      } else {
        lead.status = "followup_2_sent";
        lead.next_followup_at = "";
      }
      summary.sent++;
      allowance--;
      log.success(`${lead.lead_id} ${lead.business_name}: takip ${n} → ${result.mode}`);
    } else {
      summary.errors++;
      lead.notes = `Takip ${n} gönderim hatası: ${result.error}`;
      log.error(`${lead.lead_id}: takip ${n} hata — ${result.error}`);
    }
  }

  saveLeads(leads);
  return summary;
}
