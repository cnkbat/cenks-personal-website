/**
 * Inbox module. Scans recent Gmail replies (read-only), classifies each inbound
 * message, records it to reply-classifications.csv + replies.csv, and updates the
 * matched lead's state so the follow-up engine stops chasing people who replied,
 * opted out, or bounced. Never sends anything — only reads, classifies, logs.
 *
 * When Gmail is not configured it falls back to classifying any manually-added
 * rows in replies.csv that have not been classified yet.
 *
 * Command: npm run outreach:inbox
 */
import fs from "node:fs";
import path from "node:path";
import type { Lead, OutreachConfig, ReplyClassification, ReplyClassificationRow } from "../types";
import { getGmailEnv, PATHS } from "../config";
import { createGmailReader } from "../gmail-client";
import { loadLeads, saveLeads } from "../lead-importer";
import {
  appendReply,
  appendReplyClassification,
  loadReplies,
  loadReplyClassifications,
  nextReplyClassId,
  nextReplyId,
  type ReplyRow,
} from "../store";
import { addDoNotContact } from "../compliance/do-not-contact";
import { normalizeDomain, normalizeEmail } from "../dedupe/dedupe";
import { dateStamp, nowIso } from "../time";
import { log } from "../logger";

export interface InboxSummary {
  mode: string;
  gmailConfigured: boolean;
  scanned: number;
  classified: number;
  interested: number;
  optOut: number;
  bounced: number;
  stopped: number;
  note: string;
}

/** True if any needle occurs in the haystack. */
function includesAny(haystack: string, needles: string[]): boolean {
  return needles.some((n) => haystack.includes(n));
}

/**
 * Classify one inbound reply from its subject/from/snippet using simple Turkish
 * + English keyword heuristics. Deterministic; checked in priority order so a
 * bounce/opt-out always wins over softer intents. Confidence is a coarse 0.5–0.9.
 */
export function classifyReply(
  subject: string,
  from: string,
  snippet: string,
): { classification: ReplyClassification; confidence: number } {
  const subj = subject.toLowerCase();
  const sender = from.toLowerCase();
  const snip = snippet.toLowerCase();
  const all = `${subj} ${snip}`;

  // 1. Bounce / delivery failure — highest priority (from-address or subject).
  if (
    includesAny(sender, ["mailer-daemon", "postmaster"]) ||
    includesAny(subj, ["undeliverable", "delivery status", "teslim edilemedi", "geri döndü"])
  ) {
    return { classification: "bounced", confidence: 0.9 };
  }

  // 2. Automatic replies / out-of-office.
  if (
    includesAny(all, ["otomatik yanıt", "out of office", "tatilde", "iş yerinde değil", "auto-reply"])
  ) {
    return { classification: "auto_reply", confidence: 0.8 };
  }

  // 3. Opt-out / unsubscribe.
  if (
    includesAny(all, [
      "çıkar",
      "rahatsız etme",
      "listeden çık",
      "bir daha yazma",
      "unsubscribe",
      "abonelikten",
    ])
  ) {
    return { classification: "opt_out", confidence: 0.9 };
  }

  // 4. Explicit "not interested".
  if (
    includesAny(all, [
      "ilgilenmiyor",
      "istemiyoruz",
      "gerek yok",
      "hayır teşekkür",
      "olumsuz",
      "not interested",
    ])
  ) {
    return { classification: "not_interested", confidence: 0.8 };
  }

  // 5. Interested / positive intent.
  if (
    includesAny(all, [
      "evet",
      "olur",
      "görüşelim",
      "fiyat",
      "teklif",
      "randevu",
      "bilgi alabilir",
      "ilgileniyor",
      "uygun",
      "ne zaman",
    ])
  ) {
    return { classification: "interested", confidence: 0.8 };
  }

  // 6. Maybe later / not right now.
  if (includesAny(all, ["sonra", "ilerleyen", "şimdilik", "müsait değil", "daha sonra"])) {
    return { classification: "maybe_later", confidence: 0.7 };
  }

  // 7. Nothing matched.
  return { classification: "irrelevant", confidence: 0.5 };
}

/** Extract a bare email address from a "Name <email@x>" or plain token. */
function extractSenderEmail(from: string): string {
  const angle = /<([^>]+)>/.exec(from);
  if (angle) return normalizeEmail(angle[1]);
  const token = from.split(/\s+/).find((t) => t.includes("@"));
  return normalizeEmail(token ?? from);
}

/**
 * Apply the effect of a classification to a matched lead. Returns true if the
 * lead's status changed (so it can be counted as "stopped"). Also returns the
 * Turkish action-taken description for the classification log.
 */
function applyToLead(
  lead: Lead | undefined,
  classification: ReplyClassification,
): { statusChanged: boolean; actionTaken: string } {
  if (!lead) return { statusChanged: false, actionTaken: "eşleşen lead bulunamadı" };
  const prevStatus = lead.status;

  switch (classification) {
    case "interested":
      lead.reply_status = "interested";
      lead.status = "replied";
      return {
        statusChanged: lead.status !== prevStatus,
        actionTaken: "lead 'replied' olarak işaretlendi (ilgileniyor)",
      };
    case "not_interested":
      lead.reply_status = "not_interested";
      lead.status = "closed";
      return {
        statusChanged: lead.status !== prevStatus,
        actionTaken: "lead 'closed' olarak işaretlendi (ilgilenmiyor)",
      };
    case "opt_out": {
      lead.reply_status = "opt_out";
      lead.status = "closed";
      if (lead.email) {
        addDoNotContact({
          type: "email",
          value: lead.email,
          business_name: lead.business_name,
          reason: "Yanıtta çıkma talebi (opt-out)",
          source: "inbox",
        });
        const domain = normalizeDomain(lead.email);
        if (domain) {
          addDoNotContact({
            type: "domain",
            value: domain,
            business_name: lead.business_name,
            reason: "Yanıtta çıkma talebi (opt-out)",
            source: "inbox",
          });
        }
      }
      return {
        statusChanged: lead.status !== prevStatus,
        actionTaken: "lead kapatıldı ve do-not-contact listesine eklendi (opt-out)",
      };
    }
    case "bounced":
      lead.status = "bounced";
      return {
        statusChanged: lead.status !== prevStatus,
        actionTaken: "lead 'bounced' olarak işaretlendi",
      };
    case "maybe_later":
      lead.reply_status = "replied";
      return {
        statusChanged: lead.status !== prevStatus,
        actionTaken: "yanıt kaydedildi (daha sonra)",
      };
    default:
      // auto_reply / irrelevant — record only, don't touch lead state.
      return { statusChanged: false, actionTaken: "yalnızca kaydedildi" };
  }
}

/** Mutable running counters for one inbox run. */
interface Counters {
  scanned: number;
  classified: number;
  interested: number;
  optOut: number;
  bounced: number;
  stopped: number;
}

/**
 * Classify one reply, log it to both CSVs, and update the matched lead. Mutates
 * the running-id lists so subsequent ids stay unique within this invocation.
 */
function processReply(
  input: { subject: string; from: string; snippet: string; email: string; receivedAt: string },
  leads: Lead[],
  classList: ReplyClassificationRow[],
  replyList: ReplyRow[],
  counters: Counters,
  writeReplyRow: boolean,
): void {
  const email = input.email;
  const lead = leads.find((l) => normalizeEmail(l.email) === email && !!email);
  const { classification, confidence } = classifyReply(input.subject, input.from, input.snippet);
  const { statusChanged, actionTaken } = applyToLead(lead, classification);

  const classRow: ReplyClassificationRow = {
    reply_id: nextReplyClassId(classList),
    lead_id: lead?.lead_id ?? "",
    email,
    classification,
    confidence: String(confidence),
    matched_by: lead ? "email" : "none",
    classified_at: nowIso(),
    subject: input.subject,
    snippet: input.snippet,
    action_taken: actionTaken,
  };
  appendReplyClassification(classRow);
  classList.push(classRow);

  // Only write a NEW replies.csv row for genuinely new inbound messages (Gmail
  // path). In the fallback we are re-reading existing replies.csv rows, so
  // appending again would duplicate them.
  if (writeReplyRow) {
    const replyRow: ReplyRow = {
      reply_id: nextReplyId(replyList),
      lead_id: lead?.lead_id ?? "",
      business_name: lead?.business_name ?? "",
      email,
      received_at: input.receivedAt || nowIso(),
      reply_status: classification,
      snippet: input.snippet,
      notes: actionTaken,
    };
    appendReply(replyRow);
    replyList.push(replyRow);
  }

  counters.classified++;
  if (classification === "interested") counters.interested++;
  if (classification === "opt_out") counters.optOut++;
  if (classification === "bounced") counters.bounced++;
  if (statusChanged) counters.stopped++;
}

/** Write the Turkish inbox summary report to generated/inbox/. */
function writeInboxReport(summary: InboxSummary): void {
  const today = dateStamp();
  const lines: string[] = [];
  lines.push(`# Vesper Outreach OS — Gelen Kutusu Raporu (${today})`);
  lines.push("");
  lines.push(`Mod: **${summary.mode}** · Gmail yapılandırıldı: **${summary.gmailConfigured ? "evet" : "hayır"}**`);
  lines.push("");
  lines.push("## Özet");
  lines.push(`- Taranan mesaj: **${summary.scanned}**`);
  lines.push(`- Sınıflandırılan: **${summary.classified}**`);
  lines.push(`- İlgilenen: **${summary.interested}**`);
  lines.push(`- Çıkma talebi (opt-out): **${summary.optOut}**`);
  lines.push(`- Geri dönen (bounced): **${summary.bounced}**`);
  lines.push(`- Durumu güncellenen lead: **${summary.stopped}**`);
  lines.push("");
  lines.push("## Not");
  lines.push(`- ${summary.note}`);
  lines.push("");

  try {
    fs.mkdirSync(PATHS.generated.inbox, { recursive: true });
    const file = path.join(PATHS.generated.inbox, `inbox-${today}.md`);
    fs.writeFileSync(file, lines.join("\n") + "\n", "utf8");
  } catch {
    // Never let report writing crash the run.
  }
}

/**
 * Scan and classify replies. Uses Gmail when configured, otherwise falls back to
 * classifying manually-added replies.csv rows. Never throws — on any error it
 * returns a summary with an explanatory Turkish note.
 */
export async function runInbox(config: OutreachConfig): Promise<InboxSummary> {
  log.section("Gelen kutusu (inbox)");

  const env = getGmailEnv();
  const reader = createGmailReader(config, env);
  const gmailConfigured = !!reader;
  const mode = config.dryRun ? "dry-run" : "live";

  const counters: Counters = {
    scanned: 0,
    classified: 0,
    interested: 0,
    optOut: 0,
    bounced: 0,
    stopped: 0,
  };

  const leads = loadLeads();
  const classList = loadReplyClassifications();
  const replyList = loadReplies();
  let note = "";

  if (reader) {
    try {
      const msgs = await reader.listReplyMessages("newer_than:14d -in:sent", 50);
      counters.scanned = msgs.length;
      for (const msg of msgs) {
        const email = extractSenderEmail(msg.from);
        processReply(
          { subject: msg.subject, from: msg.from, snippet: msg.snippet, email, receivedAt: msg.date },
          leads,
          classList,
          replyList,
          counters,
          true, // Gmail message = new inbound → write a replies.csv row
        );
      }
      note = `Gmail üzerinden ${counters.scanned} mesaj tarandı, ${counters.classified} tanesi sınıflandırıldı.`;
    } catch (err) {
      note = `Gmail taraması sırasında hata oluştu: ${(err as Error).message}. Elle eklenen replies.csv kayıtları için tekrar deneyin.`;
      log.warn(note);
    }
  } else {
    // Fallback: classify manually-added replies.csv rows not yet classified.
    const classifiedEmails = new Set(
      classList.map((c) => normalizeEmail(c.email)).filter(Boolean),
    );
    const pending = replyList.filter((r) => {
      const em = normalizeEmail(r.email);
      return em !== "" && !classifiedEmails.has(em);
    });
    counters.scanned = pending.length;
    for (const row of pending) {
      const email = normalizeEmail(row.email);
      processReply(
        { subject: "", from: row.email, snippet: row.snippet, email, receivedAt: row.received_at },
        leads,
        classList,
        replyList,
        counters,
        false, // already an existing replies.csv row → do not duplicate it
      );
    }
    note =
      "Gmail yapılandırılmadı — yalnızca elle eklenen replies.csv sınıflandırıldı. Otomatik yanıt taraması için MANUAL_SETUP.md'deki Gmail adımlarını tamamlayın.";
  }

  saveLeads(leads);

  const summary: InboxSummary = {
    mode,
    gmailConfigured,
    scanned: counters.scanned,
    classified: counters.classified,
    interested: counters.interested,
    optOut: counters.optOut,
    bounced: counters.bounced,
    stopped: counters.stopped,
    note,
  };

  writeInboxReport(summary);
  log.info(
    `Tarandı: ${summary.scanned} · sınıflandırıldı: ${summary.classified} · ilgilenen: ${summary.interested} · opt-out: ${summary.optOut} · bounced: ${summary.bounced} · güncellenen lead: ${summary.stopped}`,
  );
  return summary;
}
