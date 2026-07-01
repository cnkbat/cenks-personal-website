/**
 * Sending-reputation monitor. Reads the sent-log, reply classifications and
 * blocked list to compute a rolling health snapshot (bounce rate, opt-out rate,
 * Gmail API errors, complaints) and decides whether sending should PAUSE.
 *
 * This module never sends email and never bypasses limits. It is read-only for
 * the pause check (`checkReputationPause`, called by the sender on every run)
 * and only appends one audit row to the reputation log in `runReputation`.
 *
 * Command: npm run outreach:reputation
 */
import type { DomainReputationRow, OutreachConfig } from "../types";
import {
  appendReputation,
  loadBlocked,
  loadReplies,
  loadReplyClassifications,
  loadSent,
  realSendsLastHour,
  realSendsToday,
} from "../store";
import { normalizeEmail } from "../dedupe/dedupe";
import { log } from "../logger";
import { nowIso } from "../time";

/** A rolling snapshot of sending health used to gate the sender. */
export interface ReputationSnapshot {
  sendsToday: number;
  sendsLastHour: number;
  totalSends: number;
  bounces: number;
  replies: number;
  optOuts: number;
  complaints: number;
  failures: number;
  gmailErrors: number;
  bounceRate: number;
  optOutRate: number;
  paused: boolean;
  reasons: string[];
}

/** Substrings that mark a sent-log error as a Gmail/transport-level failure. */
const GMAIL_ERROR_HINTS = ["gmail", "token", "429", "rate", "quota"];

/** Substrings (any language) that mark an inbound reply as a spam complaint. */
const COMPLAINT_HINTS = ["spam", "şikayet", "complaint"];

/**
 * Compute the current reputation snapshot from the log CSVs. Read-only: performs
 * no disk writes so it is safe to call on every sender invocation.
 */
function computeSnapshot(config: OutreachConfig): ReputationSnapshot {
  const sent = loadSent();
  const classifications = loadReplyClassifications();
  const replyRows = loadReplies();
  const blocked = loadBlocked();

  // Deliveries that actually went out.
  const totalSends = sent.filter((r) => r.status === "ok").length;
  const failures = sent.filter((r) => r.status === "error").length;
  const gmailErrors = sent.filter((r) => {
    const err = (r.error || "").toLowerCase();
    return err !== "" && GMAIL_ERROR_HINTS.some((hint) => err.includes(hint));
  }).length;

  // Bounces come from both the sent-log status and classified inbound replies.
  const bouncedSent = sent.filter((r) => r.status === "bounced").length;
  const bouncedClass = classifications.filter((r) => r.classification === "bounced").length;
  const bounces = bouncedSent + bouncedClass;

  // Unique repliers across both files (inbox writes a classification AND a reply
  // row per reply, so a naive sum would double-count).
  const replierEmails = new Set<string>();
  for (const r of classifications) if (normalizeEmail(r.email)) replierEmails.add(normalizeEmail(r.email));
  for (const r of replyRows) if (normalizeEmail(r.email)) replierEmails.add(normalizeEmail(r.email));
  const replies = replierEmails.size;
  const optOuts = classifications.filter((r) => r.classification === "opt_out").length;
  const complaints = classifications.filter((r) => {
    const text = `${r.snippet || ""} ${r.subject || ""}`.toLowerCase();
    return COMPLAINT_HINTS.some((hint) => text.includes(hint));
  }).length;

  const sendsToday = realSendsToday();
  const sendsLastHour = realSendsLastHour();

  const bounceRate = bounces / Math.max(1, totalSends);
  const optOutRate = optOuts / Math.max(1, totalSends);

  const reasons: string[] = [];
  if (bounceRate > config.pauseOnBounceRateAbove) {
    reasons.push(`Bounce oranı yüksek (%${(bounceRate * 100).toFixed(1)})`);
  }
  if (optOutRate > config.pauseOnOptOutRateAbove) {
    reasons.push(`Opt-out oranı yüksek (%${(optOutRate * 100).toFixed(1)})`);
  }
  if (gmailErrors >= 3) {
    reasons.push("Gmail API hataları");
  }
  if (failures >= 5) {
    reasons.push("Gönderim hataları yüksek");
  }
  const similarBlocked = blocked.filter((r) => (r.reason || "").includes("benziyor")).length;
  if (similarBlocked >= 5) {
    reasons.push("Çok fazla benzer e-posta engellendi");
  }

  return {
    sendsToday,
    sendsLastHour,
    totalSends,
    bounces,
    replies,
    optOuts,
    complaints,
    failures,
    gmailErrors,
    bounceRate,
    optOutRate,
    paused: reasons.length > 0,
    reasons,
  };
}

/**
 * Read-only pause gate for the sender. Returns whether sending should be paused
 * and the human-readable Turkish reasons. MUST NOT write to disk.
 */
export function checkReputationPause(config: OutreachConfig): { paused: boolean; reasons: string[] } {
  const snapshot = computeSnapshot(config);
  return { paused: snapshot.paused, reasons: snapshot.reasons };
}

/**
 * Compute the reputation snapshot, append one audit row to the reputation log,
 * print a Turkish summary and return the snapshot.
 */
export function runReputation(config: OutreachConfig): ReputationSnapshot {
  const snapshot = computeSnapshot(config);

  const row: DomainReputationRow = {
    logged_at: nowIso(),
    window: "rolling",
    sends: String(snapshot.totalSends),
    bounces: String(snapshot.bounces),
    replies: String(snapshot.replies),
    opt_outs: String(snapshot.optOuts),
    complaints: String(snapshot.complaints),
    failures: String(snapshot.failures),
    gmail_errors: String(snapshot.gmailErrors),
    bounce_rate: snapshot.bounceRate.toFixed(3),
    opt_out_rate: snapshot.optOutRate.toFixed(3),
    status: snapshot.paused ? "paused" : "ok",
    reason: snapshot.reasons.join("; "),
  };
  appendReputation(row);

  log.section("Gönderim itibarı (reputation)");
  log.info(`Toplam gönderim: ${snapshot.totalSends} · bugün: ${snapshot.sendsToday} · son saat: ${snapshot.sendsLastHour}`);
  log.info(`Bounce: ${snapshot.bounces} (%${(snapshot.bounceRate * 100).toFixed(1)}) · opt-out: ${snapshot.optOuts} (%${(snapshot.optOutRate * 100).toFixed(1)})`);
  log.info(`Yanıt: ${snapshot.replies} · şikayet: ${snapshot.complaints} · hata: ${snapshot.failures} · Gmail hatası: ${snapshot.gmailErrors}`);

  if (snapshot.paused) {
    log.warn(`Gönderim DURAKLATILDI: ${snapshot.reasons.join("; ")}`);
  } else {
    log.success("Gönderim itibarı sağlıklı; duraklatma yok.");
  }

  return snapshot;
}
