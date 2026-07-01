/**
 * Append-only CSV stores for logs: sent-log, followups, blocked-leads, replies.
 * Shared by the sender, follow-up engine and report generator so the column
 * order and quota logic live in exactly one place.
 */
import fs from "node:fs";
import { PATHS } from "./config";
import { appendCsvRow, readCsvObjects, writeCsvObjects } from "./csv";
import { dateStamp } from "./time";
import type {
  CampaignRow,
  DiscoveredLeadRow,
  DomainReputationRow,
  DoNotContactRow,
  EnrichedLeadRow,
  LeadSourceRow,
  ReplyClassificationRow,
} from "./types";

export const SENT_HEADERS = [
  "sent_id",
  "lead_id",
  "business_name",
  "email",
  "type",
  "offer",
  "subject",
  "quality_score",
  "spam_score",
  "mode",
  "status",
  "sent_at",
  "message_id",
  "error",
] as const;

export const FOLLOWUP_HEADERS = [
  "followup_id",
  "lead_id",
  "business_name",
  "email",
  "followup_number",
  "scheduled_for",
  "status",
  "sent_at",
  "subject",
  "quality_score",
  "mode",
  "message_id",
  "error",
] as const;

export const BLOCKED_HEADERS = ["lead_id", "business_name", "email", "reason", "blocked_at"] as const;

export const REPLIES_HEADERS = [
  "reply_id",
  "lead_id",
  "business_name",
  "email",
  "received_at",
  "reply_status",
  "snippet",
  "notes",
] as const;

export type SentRow = Record<(typeof SENT_HEADERS)[number], string>;
export type FollowupRow = Record<(typeof FOLLOWUP_HEADERS)[number], string>;
export type BlockedRow = Record<(typeof BLOCKED_HEADERS)[number], string>;
export type ReplyRow = Record<(typeof REPLIES_HEADERS)[number], string>;

/** Create any missing log CSVs with header-only content. */
export function ensureLogFiles(): void {
  const files: [string, readonly string[]][] = [
    [PATHS.data.sentLog, SENT_HEADERS],
    [PATHS.data.followups, FOLLOWUP_HEADERS],
    [PATHS.data.blocked, BLOCKED_HEADERS],
    [PATHS.data.replies, REPLIES_HEADERS],
  ];
  for (const [file, headers] of files) {
    if (!fs.existsSync(file)) writeCsvObjects(file, [...headers], []);
  }
}

export function loadSent(): SentRow[] {
  return readCsvObjects<SentRow>(PATHS.data.sentLog);
}
export function appendSent(row: SentRow): void {
  appendCsvRow(PATHS.data.sentLog, [...SENT_HEADERS], row);
}
/** Highest numeric suffix among ids sharing a prefix (0 if none). */
function maxSeq(ids: string[], prefix: string): number {
  const re = new RegExp(`^${prefix}(\\d+)$`);
  let max = 0;
  for (const id of ids) {
    const m = re.exec((id || "").trim());
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return max;
}

/** Next sequential id like `<prefix>00007` — collision-proof if rows are edited/deleted. */
function seqId(prefix: string, ids: string[], pad: number): string {
  return prefix + String(maxSeq(ids, prefix) + 1).padStart(pad, "0");
}

export function nextSentId(existing: SentRow[]): string {
  return seqId("S", existing.map((r) => r.sent_id), 5);
}

export function loadFollowups(): FollowupRow[] {
  return readCsvObjects<FollowupRow>(PATHS.data.followups);
}
export function appendFollowup(row: FollowupRow): void {
  appendCsvRow(PATHS.data.followups, [...FOLLOWUP_HEADERS], row);
}
export function nextFollowupId(existing: FollowupRow[]): string {
  return seqId("F", existing.map((r) => r.followup_id), 5);
}

export function loadBlocked(): BlockedRow[] {
  return readCsvObjects<BlockedRow>(PATHS.data.blocked);
}
export function appendBlocked(row: BlockedRow): void {
  appendCsvRow(PATHS.data.blocked, [...BLOCKED_HEADERS], row);
}

export function loadReplies(): ReplyRow[] {
  return readCsvObjects<ReplyRow>(PATHS.data.replies);
}
export function appendReply(row: ReplyRow): void {
  appendCsvRow(PATHS.data.replies, [...REPLIES_HEADERS], row);
}
export function nextReplyId(existing: ReplyRow[]): string {
  return seqId("R", existing.map((r) => r.reply_id), 5);
}

/**
 * Real deliveries only (mode send/draft, status ok). Dry-run rows are logged for
 * audit but never consume real quota, so repeated dry runs keep working.
 */
function isRealDelivery(row: { mode: string; status: string }): boolean {
  return row.status === "ok" && row.mode !== "dry-run";
}

/** Count real deliveries (cold + follow-up) made today. */
export function realSendsToday(): number {
  const today = dateStamp();
  const sent = loadSent().filter((r) => isRealDelivery(r) && r.sent_at.startsWith(today)).length;
  const fups = loadFollowups().filter(
    (r) => r.status === "ok" && r.mode !== "dry-run" && r.sent_at.startsWith(today),
  ).length;
  return sent + fups;
}

/** Count real deliveries in the last rolling hour. */
export function realSendsLastHour(): number {
  const cutoff = Date.now() - 60 * 60 * 1000;
  const within = (iso: string) => {
    const t = Date.parse(iso);
    return !Number.isNaN(t) && t >= cutoff;
  };
  const sent = loadSent().filter((r) => isRealDelivery(r) && within(r.sent_at)).length;
  const fups = loadFollowups().filter(
    (r) => r.status === "ok" && r.mode !== "dry-run" && within(r.sent_at),
  ).length;
  return sent + fups;
}

/**
 * How many more emails may be delivered in this single invocation: the smaller
 * of the remaining daily and remaining hourly allowances. Cold emails and
 * follow-ups share the same pool.
 */
export function remainingSendAllowance(dailyLimit: number, hourlyLimit: number): number {
  return Math.max(0, Math.min(dailyLimit - realSendsToday(), hourlyLimit - realSendsLastHour()));
}

// ===========================================================================
// Lead Hunter OS — stores for the 7 new CSV files.
// ===========================================================================

export const CAMPAIGN_HEADERS = [
  "campaign_id", "name", "city", "district", "industry", "business_type",
  "query", "source", "max_results", "status", "created_at", "last_run_at", "notes",
] as const;

export const LEAD_SOURCE_HEADERS = [
  "source_id", "name", "type", "enabled", "requires_setup", "env_keys", "notes",
] as const;

export const DISCOVERED_HEADERS = [
  "discovery_id", "campaign_id", "business_name", "website", "phone", "city", "district",
  "industry", "business_type", "source", "source_url", "google_maps_url", "instagram",
  "rating", "review_count", "discovered_at", "status", "notes",
] as const;

export const ENRICHED_HEADERS = [
  "discovery_id", "campaign_id", "business_name", "email", "email_source", "website",
  "has_website", "website_status", "website_quality", "mobile_friendly", "has_online_booking",
  "has_whatsapp", "has_lead_form", "has_services_page", "seo_basics", "ad_opportunity",
  "instagram", "google_maps_url", "whatsapp_link", "contact_page", "detected_problems",
  "recommended_offer", "confidence", "lead_score", "enriched_at", "status", "notes",
] as const;

export const DNC_HEADERS = [
  "entry_id", "type", "value", "business_name", "reason", "source", "added_at",
] as const;

export const REPUTATION_HEADERS = [
  "logged_at", "window", "sends", "bounces", "replies", "opt_outs", "complaints",
  "failures", "gmail_errors", "bounce_rate", "opt_out_rate", "status", "reason",
] as const;

export const REPLY_CLASS_HEADERS = [
  "reply_id", "lead_id", "email", "classification", "confidence", "matched_by",
  "classified_at", "subject", "snippet", "action_taken",
] as const;

// --- Campaigns ---
export function loadCampaigns(): CampaignRow[] {
  return readCsvObjects<CampaignRow>(PATHS.data.campaigns);
}
export function saveCampaigns(rows: CampaignRow[]): void {
  writeCsvObjects(PATHS.data.campaigns, [...CAMPAIGN_HEADERS], rows);
}

// --- Lead sources registry ---
export function loadLeadSources(): LeadSourceRow[] {
  return readCsvObjects<LeadSourceRow>(PATHS.data.leadSources);
}

// --- Discovered leads ---
export function loadDiscovered(): DiscoveredLeadRow[] {
  return readCsvObjects<DiscoveredLeadRow>(PATHS.data.discovered);
}
export function saveDiscovered(rows: DiscoveredLeadRow[]): void {
  writeCsvObjects(PATHS.data.discovered, [...DISCOVERED_HEADERS], rows);
}
export function appendDiscovered(row: DiscoveredLeadRow): void {
  appendCsvRow(PATHS.data.discovered, [...DISCOVERED_HEADERS], row);
}
export function nextDiscoveryId(existing: DiscoveredLeadRow[]): string {
  return seqId("D", existing.map((r) => r.discovery_id), 6);
}

// --- Enriched leads ---
export function loadEnriched(): EnrichedLeadRow[] {
  return readCsvObjects<EnrichedLeadRow>(PATHS.data.enriched);
}
export function saveEnriched(rows: EnrichedLeadRow[]): void {
  writeCsvObjects(PATHS.data.enriched, [...ENRICHED_HEADERS], rows);
}
export function appendEnriched(row: EnrichedLeadRow): void {
  appendCsvRow(PATHS.data.enriched, [...ENRICHED_HEADERS], row);
}

// --- Do-not-contact ---
export function loadDoNotContactRows(): DoNotContactRow[] {
  return readCsvObjects<DoNotContactRow>(PATHS.data.doNotContact);
}
export function appendDoNotContact(row: DoNotContactRow): void {
  appendCsvRow(PATHS.data.doNotContact, [...DNC_HEADERS], row);
}
export function nextDncId(existing: DoNotContactRow[]): string {
  return seqId("DNC", existing.map((r) => r.entry_id), 5);
}

// --- Reputation log ---
export function loadReputation(): DomainReputationRow[] {
  return readCsvObjects<DomainReputationRow>(PATHS.data.reputationLog);
}
export function appendReputation(row: DomainReputationRow): void {
  appendCsvRow(PATHS.data.reputationLog, [...REPUTATION_HEADERS], row);
}

// --- Reply classifications ---
export function loadReplyClassifications(): ReplyClassificationRow[] {
  return readCsvObjects<ReplyClassificationRow>(PATHS.data.replyClassifications);
}
export function appendReplyClassification(row: ReplyClassificationRow): void {
  appendCsvRow(PATHS.data.replyClassifications, [...REPLY_CLASS_HEADERS], row);
}
export function nextReplyClassId(existing: ReplyClassificationRow[]): string {
  return seqId("RC", existing.map((r) => r.reply_id), 5);
}

/** Bounce/opt-out counts today. */
export function bounceCountToday(): number {
  const today = dateStamp();
  return loadSent().filter((r) => r.status === "bounced" && r.sent_at.startsWith(today)).length;
}

/**
 * Create any missing Lead-Hunter data files with header-only content. Does NOT
 * seed campaigns/sources — those ship as tracked files with example rows.
 */
export function ensureHunterDataFiles(): void {
  const files: [string, readonly string[]][] = [
    [PATHS.data.leadSources, LEAD_SOURCE_HEADERS],
    [PATHS.data.campaigns, CAMPAIGN_HEADERS],
    [PATHS.data.discovered, DISCOVERED_HEADERS],
    [PATHS.data.enriched, ENRICHED_HEADERS],
    [PATHS.data.doNotContact, DNC_HEADERS],
    [PATHS.data.reputationLog, REPUTATION_HEADERS],
    [PATHS.data.replyClassifications, REPLY_CLASS_HEADERS],
  ];
  for (const [file, headers] of files) {
    if (!fs.existsSync(file)) writeCsvObjects(file, [...headers], []);
  }
}
