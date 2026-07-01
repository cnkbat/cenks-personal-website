/**
 * Lead I/O. leads.csv is the single source of truth for lead state; this module
 * is the only place that reads/writes it, so the column order stays stable.
 */
import fs from "node:fs";
import { PATHS } from "./config";
import { readCsvObjects, writeCsvObjects, parseCsv } from "./csv";
import type { Lead } from "./types";

/** Canonical column order for leads.csv. Do not reorder without a migration. */
export const LEAD_HEADERS: (keyof Lead & string)[] = [
  "lead_id",
  "business_name",
  "owner_name",
  "email",
  "phone",
  "website",
  "instagram",
  "google_maps_url",
  "industry",
  "city",
  "district",
  "business_type",
  "observed_problem",
  "suggested_offer",
  "lead_score",
  "status",
  "last_contacted_at",
  "next_followup_at",
  "reply_status",
  "notes",
];

const EMPTY_LEAD: Lead = Object.fromEntries(LEAD_HEADERS.map((h) => [h, ""])) as unknown as Lead;

/** Create data/leads.csv with just the header row if it does not exist. */
export function ensureLeadsFile(): void {
  if (!fs.existsSync(PATHS.data.leads)) writeCsvObjects(PATHS.data.leads, LEAD_HEADERS, []);
}

/** Load all leads from data/leads.csv. */
export function loadLeads(): Lead[] {
  return readCsvObjects<Lead>(PATHS.data.leads).map((l) => ({ ...EMPTY_LEAD, ...l }));
}

/** Persist the full lead list back to data/leads.csv. */
export function saveLeads(leads: Lead[]): void {
  writeCsvObjects(PATHS.data.leads, LEAD_HEADERS, leads);
}

/** Look up a lead by id. */
export function findLead(leads: Lead[], leadId: string): Lead | undefined {
  return leads.find((l) => l.lead_id === leadId);
}

/** Next free sequential lead id like L0006, based on existing rows. */
export function nextLeadId(leads: Lead[]): string {
  let max = 0;
  for (const l of leads) {
    const m = /^L(\d+)$/.exec(l.lead_id);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return "L" + String(max + 1).padStart(4, "0");
}

/**
 * Merge leads from an external CSV file into leads.csv. New rows get a fresh
 * lead_id and status=pending; rows whose email already exists are skipped.
 * Returns { added, skipped } counts. Used by future importers; safe to call.
 */
export function importFromFile(file: string): { added: number; skipped: number } {
  if (!fs.existsSync(file)) throw new Error(`Import file not found: ${file}`);
  const incoming = readCsvObjects<Record<string, string>>(file);
  const existing = loadLeads();
  const seenEmails = new Set(existing.map((l) => l.email.toLowerCase()).filter(Boolean));
  let added = 0;
  let skipped = 0;

  for (const row of incoming) {
    const email = (row.email ?? "").trim().toLowerCase();
    if (email && seenEmails.has(email)) {
      skipped++;
      continue;
    }
    const lead: Lead = { ...EMPTY_LEAD, ...row } as Lead;
    lead.lead_id = lead.lead_id || nextLeadId(existing);
    lead.status = lead.status || "pending";
    existing.push(lead);
    if (email) seenEmails.add(email);
    added++;
  }
  saveLeads(existing);
  return { added, skipped };
}

/** Count the columns actually present in the header (for setup-check). */
export function leadsFileColumnCount(): number {
  if (!fs.existsSync(PATHS.data.leads)) return 0;
  const rows = parseCsv(fs.readFileSync(PATHS.data.leads, "utf8"));
  return rows.length > 0 ? rows[0].length : 0;
}
