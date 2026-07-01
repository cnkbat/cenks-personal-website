/**
 * Vesper Outreach OS — shared types.
 *
 * These types are the contract between every module in the pipeline.
 * CSV rows are read/written as `Lead` objects (all string fields, because CSV),
 * while the analysis/scoring layers work with richer typed structures.
 */

/** Lifecycle status of a lead. Mirrors the `status` column in leads.csv. */
export type LeadStatus =
  | "pending"
  | "skipped"
  | "ready"
  | "sent"
  | "followup_1_sent"
  | "followup_2_sent"
  | "replied"
  | "blocked"
  | "bounced"
  | "closed";

/** Reply classification stored in leads.csv `reply_status` / replies.csv. */
export type ReplyStatus =
  | ""
  | "none"
  | "replied"
  | "interested"
  | "not_interested"
  | "opt_out";

/**
 * One row of leads.csv. Every field is a string because it round-trips through
 * CSV. Empty string == "not provided". Never assume a field is non-empty.
 */
export interface Lead {
  /** All lead fields are strings (CSV round-trip). Index signature lets the
   *  generic CSV helpers treat a Lead as Record<string, string>. */
  [key: string]: string;
  lead_id: string;
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  website: string;
  instagram: string;
  google_maps_url: string;
  industry: string;
  city: string;
  district: string;
  business_type: string;
  observed_problem: string;
  suggested_offer: string;
  lead_score: string;
  status: string;
  last_contacted_at: string;
  next_followup_at: string;
  reply_status: string;
  notes: string;
}

/** The seven services Vesper sells. Keys are stable ids used across the codebase. */
export type OfferKey =
  | "website"
  | "crm"
  | "google-ads"
  | "meta-ads"
  | "tiktok-ads"
  | "seo"
  | "automation";

/** Stable ids for the problems the analyzer can detect. */
export type ProblemId =
  | "no_website"
  | "outdated_website"
  | "weak_mobile"
  | "no_appointment_flow"
  | "no_online_booking"
  | "no_crm"
  | "weak_google_presence"
  | "weak_conversion"
  | "no_ads_landing"
  | "google_ads_potential"
  | "meta_ads_potential"
  | "tiktok_ads_potential"
  | "poor_seo"
  | "no_clear_offer"
  | "no_whatsapp_cta"
  | "no_lead_form";

/** Result of website-analyzer.ts */
export interface BusinessAnalysis {
  detectedProblems: ProblemId[];
  opportunities: string[];
  recommendedOffer: OfferKey;
  reasoning: string;
  /** 0–100. How confident we are that this analysis is actionable. */
  confidenceScore: number;
}

/** Result of lead-validator.ts */
export interface ValidationResult {
  sendable: boolean;
  reasons: string[];
  isBusinessEmail: boolean;
}

/** Result of lead-scorer.ts */
export interface ScoreResult {
  score: number;
  breakdown: { label: string; points: number }[];
}

/** Result of offer-selector.ts */
export interface OfferSelection {
  offer: OfferKey;
  offerName: string;
  reasoning: string;
  /** The detected problem this offer is meant to solve. */
  focusProblem: ProblemId | null;
}

/** A generated email (first-touch or follow-up). */
export interface GeneratedEmail {
  lead_id: string;
  type: "cold" | "followup_1" | "followup_2";
  subject: string;
  body: string;
  offer: OfferKey;
  offerName: string;
  wordCount: number;
}

/** Result of quality-reviewer.ts */
export interface QualityReview {
  score: number;
  passed: boolean;
  checks: QualityCheck[];
  failReasons: string[];
}

export interface QualityCheck {
  name: string;
  passed: boolean;
  detail: string;
  /** Weight toward the 0–100 score. */
  weight: number;
  /** If true, failing this check fails the whole review regardless of score. */
  critical: boolean;
}

/** Result of spam-checker.ts */
export interface SpamCheck {
  blocked: boolean;
  reasons: string[];
  /** Higher == spammier. */
  score: number;
}

/** Settings for the optional scheduled runner (outreach:scheduler). */
export interface SchedulerSettings {
  /** Master switch — if false, the scheduler refuses to run. */
  enabled: boolean;
  /** Minutes between runs in daemon mode (clamped 15–1440). */
  intervalMinutes: number;
  /** Allow the scheduler to loop while dryRun is true (safe: sends nothing). */
  allowDryRun: boolean;
  /** Hard backstop on how many runs may happen per calendar day. */
  maxRunsPerDay: number;
}

/** Which Lead Hunter source adapters are enabled (config toggles). */
export interface HunterSourcesConfig {
  googleCustomSearch: boolean;
  googlePlaces: boolean;
  serpApi: boolean;
  manualImport: boolean;
}

/** Names of the ENV VARS that hold each API key (config stores names, not keys). */
export interface HunterApiKeyEnvNames {
  googleCustomSearchEnv: string;
  googleCustomSearchCxEnv: string;
  googlePlacesEnv: string;
  serpApiEnv: string;
}

/** The parsed outreach-config.json plus computed defaults. */
export interface OutreachConfig {
  portfolioUrl: string;
  meetingUrl: string;
  /** Preferred alias for the booking link used in emails (falls back to meetingUrl). */
  calendarUrl: string;
  senderName: string;
  brandName: string;
  language: string;
  dryRun: boolean;
  dailySendLimit: number;
  hourlySendLimit: number;
  minLeadScoreToSend: number;
  minEmailQualityScoreToSend: number;
  autoSendEnabled: boolean;
  followupsEnabled: boolean;
  followup1DelayBusinessDays: number;
  followup2DelayBusinessDays: number;
  gmailLabel: string;
  optOutLine: string;
  allowedOffers: string[];
  forbiddenOffers: string[];
  scheduler: SchedulerSettings;
  // --- Lead Hunter OS layer ---
  leadHunterEnabled: boolean;
  hunterSources: HunterSourcesConfig;
  apiKeys: HunterApiKeyEnvNames;
  maxHunterResultsPerCampaign: number;
  maxWebsiteFetchesPerRun: number;
  requestTimeoutMs: number;
  minReviewCountPreferred: number;
  pauseOnBounceRateAbove: number;
  pauseOnOptOutRateAbove: number;
  autopilotEnabled: boolean;
}

/** Resolved API keys pulled from env by the configured env-var names ("" if unset). */
export interface HunterEnv {
  googleCustomSearchKey: string;
  googleCustomSearchCx: string;
  googlePlacesKey: string;
  serpApiKey: string;
}

/** Gmail OAuth credentials pulled from environment variables. */
export interface GmailEnv {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  senderEmail: string;
}

/** A single outbound message request for the mail adapter. */
export interface MailMessage {
  to: string;
  subject: string;
  body: string;
}

/** Result of an adapter send/draft attempt. */
export interface MailResult {
  ok: boolean;
  mode: "send" | "draft" | "dry-run";
  messageId: string;
  error?: string;
}

/** The mail transport contract. Gmail + dry-run both implement this. */
export interface MailAdapter {
  readonly mode: "send" | "draft" | "dry-run";
  deliver(message: MailMessage): Promise<MailResult>;
}

// ===========================================================================
// Lead Hunter OS — CSV row shapes (all fields strings; CSV round-trip).
// Row types live here (single source of truth); the CSV headers + I/O helpers
// live in store.ts. Index signatures let the generic CSV helpers treat each
// row as Record<string, string>.
// ===========================================================================

/** data/campaigns.csv — a saved lead-search campaign. */
export interface CampaignRow {
  [key: string]: string;
  campaign_id: string;
  name: string;
  city: string;
  district: string;
  industry: string;
  business_type: string;
  query: string;
  source: string;
  max_results: string;
  status: string; // active | inactive | done
  created_at: string;
  last_run_at: string;
  notes: string;
}

/** data/lead-sources.csv — registry of source adapters + their setup status. */
export interface LeadSourceRow {
  [key: string]: string;
  source_id: string;
  name: string;
  type: string; // manual | google_search | google_maps | instagram | directory
  enabled: string; // true | false
  requires_setup: string; // true | false
  env_keys: string;
  notes: string;
}

/** data/discovered-leads.csv — raw businesses found by the hunter (pre-enrichment). */
export interface DiscoveredLeadRow {
  [key: string]: string;
  discovery_id: string;
  campaign_id: string;
  business_name: string;
  website: string;
  phone: string;
  city: string;
  district: string;
  industry: string;
  business_type: string;
  source: string;
  source_url: string;
  google_maps_url: string;
  instagram: string;
  rating: string;
  review_count: string;
  discovered_at: string;
  status: string; // new | enriched | promoted | duplicate | rejected
  notes: string;
}

/** data/enriched-leads.csv — a discovered lead after the enrichment pass. */
export interface EnrichedLeadRow {
  [key: string]: string;
  discovery_id: string;
  campaign_id: string;
  business_name: string;
  email: string;
  email_source: string; // homepage | contact_page | none
  website: string;
  has_website: string;
  website_status: string;
  website_quality: string;
  mobile_friendly: string;
  has_online_booking: string;
  has_whatsapp: string;
  has_lead_form: string;
  has_services_page: string;
  seo_basics: string;
  ad_opportunity: string;
  instagram: string;
  google_maps_url: string;
  whatsapp_link: string;
  contact_page: string;
  detected_problems: string;
  recommended_offer: string;
  confidence: string;
  lead_score: string;
  enriched_at: string;
  status: string; // enriched | promoted | rejected | no_email | duplicate | do_not_contact
  notes: string;
}

/** data/do-not-contact.csv — permanent suppression list. */
export interface DoNotContactRow {
  [key: string]: string;
  entry_id: string;
  type: string; // email | domain | business
  value: string;
  business_name: string;
  reason: string;
  source: string;
  added_at: string;
}

/** data/domain-reputation-log.csv — a sending-health snapshot. */
export interface DomainReputationRow {
  [key: string]: string;
  logged_at: string;
  window: string; // day | hour | rolling
  sends: string;
  bounces: string;
  replies: string;
  opt_outs: string;
  complaints: string;
  failures: string;
  gmail_errors: string;
  bounce_rate: string;
  opt_out_rate: string;
  status: string; // ok | paused
  reason: string;
}

/** data/reply-classifications.csv — one classified inbound reply. */
export interface ReplyClassificationRow {
  [key: string]: string;
  reply_id: string;
  lead_id: string;
  email: string;
  classification: string;
  confidence: string;
  matched_by: string;
  classified_at: string;
  subject: string;
  snippet: string;
  action_taken: string;
}

/** A raw business discovered by a hunter source adapter (pre-enrichment). */
export interface HunterResult {
  business_name: string;
  website: string;
  phone: string;
  city: string;
  district: string;
  industry: string;
  business_type: string;
  source: string;
  source_url: string;
  google_maps_url: string;
  instagram: string;
  rating: string;
  review_count: string;
}

/** Outcome of one source adapter searching for one campaign. */
export interface HunterSearchOutput {
  results: HunterResult[];
  /** Human-readable note (e.g. setup instructions when needsSetup=true). */
  note: string;
  /** True when the adapter could not run for real (missing key/flag/data). */
  needsSetup: boolean;
}

/** The contract every hunter source adapter implements. */
export interface HunterAdapter {
  readonly id: string;
  readonly name: string;
  /** True if this adapter has what it needs (flags/keys) to run for real. */
  isConfigured(config: OutreachConfig, env: HunterEnv): boolean;
  /** Search for businesses for one campaign. MUST NOT throw. */
  search(campaign: CampaignRow, config: OutreachConfig, env: HunterEnv): Promise<HunterSearchOutput>;
}

/** Reply classification categories (inbox). */
export type ReplyClassification =
  | "interested"
  | "maybe_later"
  | "not_interested"
  | "opt_out"
  | "bounced"
  | "auto_reply"
  | "irrelevant";
