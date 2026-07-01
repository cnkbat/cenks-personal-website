/**
 * Deduplication engine. Prevents the same business being discovered, enriched or
 * contacted twice. Matches on normalized email, website domain, phone, and
 * business-name + city. Also the guard that stops re-contacting a lead already
 * in leads.csv (any status).
 *
 * Command: npm run outreach:dedupe
 */
import type { Lead, OutreachConfig } from "../types";
import { loadLeads } from "../lead-importer";
import { loadDiscovered, saveDiscovered } from "../store";
import { log } from "../logger";

export interface DedupeSummary {
  scanned: number;
  duplicatesFound: number;
  discoveredMarked: number;
}

/** A minimal shape any candidate lead can provide for matching. */
export interface DedupeCandidate {
  email: string;
  website: string;
  business_name: string;
  phone: string;
  city: string;
  district: string;
}

export function normalizeEmail(s: string): string {
  return s.trim().toLowerCase();
}

/** Registrable-ish domain from an email or URL (strip scheme, www, path). */
export function normalizeDomain(s: string): string {
  const v = s.trim().toLowerCase();
  if (!v) return "";
  if (v.includes("@")) return v.slice(v.lastIndexOf("@") + 1).replace(/^www\./, "");
  try {
    const u = new URL(v.includes("://") ? v : `https://${v}`);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return v.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
}

/** Lowercased, punctuation-stripped, suffix-trimmed business name. */
export function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,]/g, " ")
    .replace(/\b(ltd|şti|sti|a\.?ş|as|ltd\.şti|inc|llc)\b/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Last 10 significant digits of a phone (drops +90 / leading 0). */
export function normalizePhone(s: string): string {
  const digits = s.replace(/\D/g, "");
  if (!digits) return "";
  let d = digits;
  if (d.startsWith("90") && d.length >= 12) d = d.slice(2);
  if (d.startsWith("0") && d.length >= 11) d = d.slice(1);
  return d.slice(-10);
}

function keysOf(c: DedupeCandidate | Lead) {
  return {
    email: normalizeEmail(c.email || ""),
    domain: normalizeDomain(c.website || "") || normalizeDomain(c.email || ""),
    phone: normalizePhone(c.phone || ""),
    name: normalizeName(c.business_name || ""),
    city: (c.city || "").trim().toLowerCase(),
  };
}

/** True if two records almost certainly refer to the same business. */
export function isSameBusiness(a: DedupeCandidate | Lead, b: DedupeCandidate | Lead): boolean {
  const ka = keysOf(a);
  const kb = keysOf(b);
  if (ka.email && ka.email === kb.email) return true;
  if (ka.domain && ka.domain === kb.domain) return true;
  if (ka.phone && ka.phone === kb.phone) return true;
  if (ka.name && ka.name === kb.name && ka.city && ka.city === kb.city) return true;
  return false;
}

/**
 * True if a candidate matches ANY existing lead (regardless of status) — the
 * guard that stops re-contacting or re-promoting a business we already have.
 */
export function isDuplicateLead(candidate: DedupeCandidate, existing: Lead[]): boolean {
  return existing.some((l) => isSameBusiness(candidate, l));
}

/**
 * Scan discovered-leads.csv and mark rows that duplicate an existing lead or an
 * earlier discovered row (status -> "duplicate"). Idempotent.
 */
export function runDedupe(config: OutreachConfig): DedupeSummary {
  void config;
  const leads = loadLeads();
  const discovered = loadDiscovered();
  const summary: DedupeSummary = { scanned: 0, duplicatesFound: 0, discoveredMarked: 0 };

  log.section("Tekilleştirme (dedupe)");

  const seen: DedupeCandidate[] = [];
  for (const row of discovered) {
    const status = row.status.trim().toLowerCase();
    // Only consider live rows; leave promoted/rejected alone.
    if (status !== "new" && status !== "enriched" && status !== "duplicate") continue;
    summary.scanned++;
    const candidate: DedupeCandidate = {
      email: row.email ?? "",
      website: row.website,
      business_name: row.business_name,
      phone: row.phone,
      city: row.city,
      district: row.district,
    };
    const dupOfLead = isDuplicateLead(candidate, leads);
    const dupOfEarlier = seen.some((s) => isSameBusiness(candidate, s));
    if (dupOfLead || dupOfEarlier) {
      summary.duplicatesFound++;
      if (row.status !== "duplicate") {
        row.status = "duplicate";
        row.notes = row.notes ? `${row.notes}; tekilleştirme: mükerrer` : "tekilleştirme: mükerrer";
        summary.discoveredMarked++;
      }
    } else {
      seen.push(candidate);
    }
  }

  saveDiscovered(discovered);
  log.info(`Tarandı: ${summary.scanned} · mükerrer: ${summary.duplicatesFound} · işaretlendi: ${summary.discoveredMarked}`);
  return summary;
}
