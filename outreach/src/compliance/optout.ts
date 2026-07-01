/**
 * Opt-out processor. Reads replies + reply classifications, and for anything
 * that reads as opt-out / not-interested it: (1) adds the business to the
 * do-not-contact list, and (2) stops the lead (status closed, follow-ups halt).
 *
 * Command: npm run outreach:optout
 */
import type { Lead, OutreachConfig } from "../types";
import { loadLeads, saveLeads } from "../lead-importer";
import { loadReplies, loadReplyClassifications } from "../store";
import { addDoNotContact } from "./do-not-contact";
import { normalizeDomain, normalizeEmail } from "../dedupe/dedupe";
import { log } from "../logger";

export interface OptoutSummary {
  scanned: number;
  optOutSignals: number;
  added: number;
  leadsStopped: number;
}

const STOP_STATES = new Set(["opt_out", "not_interested"]);

interface Signal {
  email: string;
  leadId: string;
  state: "opt_out" | "not_interested";
}

export function runOptout(config: OutreachConfig): OptoutSummary {
  void config;
  const summary: OptoutSummary = { scanned: 0, optOutSignals: 0, added: 0, leadsStopped: 0 };
  log.section("Opt-out işleme (do-not-contact)");

  const signals: Signal[] = [];

  // From replies.csv (manually maintained or inbox-written)
  for (const r of loadReplies()) {
    summary.scanned++;
    const state = r.reply_status.trim().toLowerCase();
    if (STOP_STATES.has(state)) {
      signals.push({ email: r.email, leadId: r.lead_id, state: state as Signal["state"] });
    }
  }
  // From reply-classifications.csv (inbox output)
  for (const c of loadReplyClassifications()) {
    summary.scanned++;
    const state = c.classification.trim().toLowerCase();
    if (STOP_STATES.has(state)) {
      signals.push({ email: c.email, leadId: c.lead_id, state: state as Signal["state"] });
    }
  }
  summary.optOutSignals = signals.length;
  if (signals.length === 0) {
    log.info("Opt-out sinyali yok.");
    return summary;
  }

  const leads = loadLeads();
  const byId = new Map(leads.map((l) => [l.lead_id, l] as const));
  const byEmail = new Map(leads.map((l) => [normalizeEmail(l.email), l] as const));

  for (const sig of signals) {
    const email = normalizeEmail(sig.email);
    const lead: Lead | undefined = byId.get(sig.leadId) ?? (email ? byEmail.get(email) : undefined);

    // Suppress the business permanently.
    if (email) {
      if (addDoNotContact({ type: "email", value: email, business_name: lead?.business_name, reason: sig.state, source: "optout" })) summary.added++;
      const domain = normalizeDomain(email);
      if (domain) addDoNotContact({ type: "domain", value: domain, business_name: lead?.business_name, reason: sig.state, source: "optout" });
    }

    // Stop the lead so it is never contacted / followed up again.
    if (lead && lead.status !== "closed") {
      lead.reply_status = sig.state;
      lead.status = "closed";
      lead.notes = `Opt-out (${sig.state}) — iletişim durduruldu`;
      summary.leadsStopped++;
    }
  }

  saveLeads(leads);
  log.info(`Sinyal: ${summary.optOutSignals} · DNC eklendi: ${summary.added} · durdurulan lead: ${summary.leadsStopped}`);
  return summary;
}
