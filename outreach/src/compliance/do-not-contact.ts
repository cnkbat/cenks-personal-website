/**
 * Do-not-contact suppression list. The permanent "never email this business
 * again" registry, checked before every send. Entries are by email, domain, or
 * business name.
 */
import type { DoNotContactRow } from "../types";
import { appendDoNotContact, loadDoNotContactRows, nextDncId } from "../store";
import { normalizeDomain, normalizeEmail, normalizeName } from "../dedupe/dedupe";
import { nowIso } from "../time";

/** Fields a caller can offer for a suppression check. */
export interface DncCheckFields {
  email?: string;
  website?: string;
  business_name?: string;
  city?: string;
}

/** Load raw suppression rows. */
export function loadDoNotContact(): DoNotContactRow[] {
  return loadDoNotContactRows();
}

interface DncIndex {
  emails: Set<string>;
  domains: Set<string>;
  businesses: Set<string>;
}

function buildIndex(rows: DoNotContactRow[]): DncIndex {
  const idx: DncIndex = { emails: new Set(), domains: new Set(), businesses: new Set() };
  for (const r of rows) {
    const type = r.type.trim().toLowerCase();
    const value = r.value.trim();
    if (!value) continue;
    if (type === "email") idx.emails.add(normalizeEmail(value));
    else if (type === "domain") idx.domains.add(normalizeDomain(value));
    else if (type === "business") idx.businesses.add(normalizeName(value));
  }
  return idx;
}

/**
 * True if the given business/email is on the do-not-contact list. Pass a
 * pre-loaded index for hot loops, otherwise it loads the CSV each call.
 */
export function isDoNotContact(fields: DncCheckFields, rows?: DoNotContactRow[]): boolean {
  const idx = buildIndex(rows ?? loadDoNotContact());
  const email = normalizeEmail(fields.email ?? "");
  if (email && idx.emails.has(email)) return true;
  const emailDomain = email ? normalizeDomain(email) : "";
  if (emailDomain && idx.domains.has(emailDomain)) return true;
  const siteDomain = normalizeDomain(fields.website ?? "");
  if (siteDomain && idx.domains.has(siteDomain)) return true;
  const name = normalizeName(fields.business_name ?? "");
  if (name && idx.businesses.has(name)) return true;
  return false;
}

/** Add a suppression entry (idempotent by type+value). */
export function addDoNotContact(entry: {
  type: "email" | "domain" | "business";
  value: string;
  business_name?: string;
  reason: string;
  source: string;
}): boolean {
  const value = entry.value.trim();
  if (!value) return false;
  const existing = loadDoNotContact();
  const dupe = existing.some(
    (r) => r.type.trim().toLowerCase() === entry.type && r.value.trim().toLowerCase() === value.toLowerCase(),
  );
  if (dupe) return false;
  appendDoNotContact({
    entry_id: nextDncId(existing),
    type: entry.type,
    value,
    business_name: entry.business_name ?? "",
    reason: entry.reason,
    source: entry.source,
    added_at: nowIso(),
  });
  return true;
}
