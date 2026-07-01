/**
 * Config + path resolution + .env loading for Vesper Outreach OS.
 *
 * Nothing here does network I/O. Secrets are read from environment variables
 * (optionally hydrated from the repo's .env / .env.local files) and are never
 * written to disk or logged.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { GmailEnv, HunterEnv, OutreachConfig } from "./types";

const SRC_DIR = path.dirname(fileURLToPath(import.meta.url));

/** Absolute path to /outreach (one level up from /outreach/src). */
export const OUTREACH_ROOT = path.resolve(SRC_DIR, "..");

/** Absolute path to the repo root (one level up from /outreach). */
export const REPO_ROOT = path.resolve(OUTREACH_ROOT, "..");

/** Every filesystem location the system touches, resolved once. */
export const PATHS = {
  root: OUTREACH_ROOT,
  config: path.join(OUTREACH_ROOT, "outreach-config.json"),
  data: {
    dir: path.join(OUTREACH_ROOT, "data"),
    leads: path.join(OUTREACH_ROOT, "data", "leads.csv"),
    sentLog: path.join(OUTREACH_ROOT, "data", "sent-log.csv"),
    followups: path.join(OUTREACH_ROOT, "data", "followups.csv"),
    blocked: path.join(OUTREACH_ROOT, "data", "blocked-leads.csv"),
    replies: path.join(OUTREACH_ROOT, "data", "replies.csv"),
    // Lead Hunter OS
    leadSources: path.join(OUTREACH_ROOT, "data", "lead-sources.csv"),
    campaigns: path.join(OUTREACH_ROOT, "data", "campaigns.csv"),
    discovered: path.join(OUTREACH_ROOT, "data", "discovered-leads.csv"),
    enriched: path.join(OUTREACH_ROOT, "data", "enriched-leads.csv"),
    doNotContact: path.join(OUTREACH_ROOT, "data", "do-not-contact.csv"),
    reputationLog: path.join(OUTREACH_ROOT, "data", "domain-reputation-log.csv"),
    replyClassifications: path.join(OUTREACH_ROOT, "data", "reply-classifications.csv"),
  },
  templates: path.join(OUTREACH_ROOT, "templates"),
  generated: {
    dir: path.join(OUTREACH_ROOT, "generated"),
    emails: path.join(OUTREACH_ROOT, "generated", "emails"),
    followups: path.join(OUTREACH_ROOT, "generated", "followups"),
    reports: path.join(OUTREACH_ROOT, "generated", "reports"),
    logs: path.join(OUTREACH_ROOT, "generated", "logs"),
    // Lead Hunter OS
    hunter: path.join(OUTREACH_ROOT, "generated", "hunter"),
    campaigns: path.join(OUTREACH_ROOT, "generated", "campaigns"),
    enrichment: path.join(OUTREACH_ROOT, "generated", "enrichment"),
    inbox: path.join(OUTREACH_ROOT, "generated", "inbox"),
  },
} as const;

/** Safe defaults, used to fill any field missing from outreach-config.json. */
const DEFAULT_CONFIG: OutreachConfig = {
  portfolioUrl: "https://cenk-emir-bat.vercel.app",
  meetingUrl: "https://cal.com/cenk-emir-bat/30min",
  calendarUrl: "https://cal.com/cenk-emir-bat/30min",
  senderName: "Cenk Emir Bat",
  brandName: "Vesper",
  language: "tr",
  dryRun: true,
  dailySendLimit: 20,
  hourlySendLimit: 5,
  minLeadScoreToSend: 70,
  minEmailQualityScoreToSend: 90,
  autoSendEnabled: true,
  followupsEnabled: true,
  followup1DelayBusinessDays: 3,
  followup2DelayBusinessDays: 7,
  gmailLabel: "Vesper Outreach",
  optOutLine: "Uygun değilse sorun değil, bir daha rahatsız etmeyeyim.",
  allowedOffers: [
    "Premium Website",
    "AI CRM / Appointment System",
    "Google Ads",
    "Meta Ads",
    "TikTok Ads",
    "SEO",
    "AI Business Automation",
  ],
  forbiddenOffers: [
    "Social Media Management",
    "Content Creation",
    "Content Package",
    "Instagram Management",
  ],
  scheduler: {
    enabled: true,
    intervalMinutes: 60,
    allowDryRun: true,
    maxRunsPerDay: 24,
  },
  // --- Lead Hunter OS layer (conservative defaults; all paid sources off) ---
  leadHunterEnabled: true,
  hunterSources: {
    googleCustomSearch: false,
    googlePlaces: false,
    serpApi: false,
    manualImport: true,
  },
  apiKeys: {
    googleCustomSearchEnv: "GOOGLE_CUSTOM_SEARCH_API_KEY",
    googleCustomSearchCxEnv: "GOOGLE_CUSTOM_SEARCH_CX",
    googlePlacesEnv: "GOOGLE_PLACES_API_KEY",
    serpApiEnv: "SERPAPI_API_KEY",
  },
  maxHunterResultsPerCampaign: 50,
  maxWebsiteFetchesPerRun: 30,
  requestTimeoutMs: 10000,
  minReviewCountPreferred: 20,
  pauseOnBounceRateAbove: 0.05,
  pauseOnOptOutRateAbove: 0.1,
  autopilotEnabled: false,
};

let envLoaded = false;

/**
 * Hydrate process.env from .env / .env.local at the repo root without
 * overriding variables already present in the real environment. Idempotent.
 */
export function loadEnv(): void {
  if (envLoaded) return;
  envLoaded = true;
  for (const file of [".env", ".env.local"]) {
    const full = path.join(REPO_ROOT, file);
    if (!fs.existsSync(full)) continue;
    const text = fs.readFileSync(full, "utf8");
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      if (!key || key in process.env) continue;
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
}

/** Read + validate outreach-config.json, merged over defaults. */
export function loadConfig(): OutreachConfig {
  if (!fs.existsSync(PATHS.config)) {
    throw new Error(
      `outreach-config.json not found at ${PATHS.config}. Copy the default and edit it.`,
    );
  }
  let parsed: Partial<OutreachConfig>;
  try {
    parsed = JSON.parse(fs.readFileSync(PATHS.config, "utf8"));
  } catch (err) {
    throw new Error(`outreach-config.json is not valid JSON: ${(err as Error).message}`);
  }
  const config: OutreachConfig = { ...DEFAULT_CONFIG, ...parsed };
  // Nested objects need explicit merges (spread above is shallow).
  config.scheduler = { ...DEFAULT_CONFIG.scheduler, ...(parsed.scheduler ?? {}) };
  config.hunterSources = { ...DEFAULT_CONFIG.hunterSources, ...(parsed.hunterSources ?? {}) };
  config.apiKeys = { ...DEFAULT_CONFIG.apiKeys, ...(parsed.apiKeys ?? {}) };
  // Booking link: an explicit calendarUrl wins; otherwise fall back to the
  // config's meetingUrl (honor a custom meetingUrl even with no calendarUrl set).
  config.calendarUrl = (parsed.calendarUrl && parsed.calendarUrl.trim()) || config.meetingUrl;

  // Guard rails: never let a bad config exceed the safety ceilings.
  config.dailySendLimit = clamp(config.dailySendLimit, 1, 50);
  config.hourlySendLimit = clamp(config.hourlySendLimit, 1, config.dailySendLimit);
  config.minEmailQualityScoreToSend = clamp(config.minEmailQualityScoreToSend, 0, 100);
  config.minLeadScoreToSend = clamp(config.minLeadScoreToSend, 0, 100);
  config.scheduler.intervalMinutes = clamp(config.scheduler.intervalMinutes, 15, 1440);
  config.scheduler.maxRunsPerDay = clamp(config.scheduler.maxRunsPerDay, 1, 48);
  config.maxHunterResultsPerCampaign = clamp(config.maxHunterResultsPerCampaign, 1, 200);
  config.maxWebsiteFetchesPerRun = clamp(config.maxWebsiteFetchesPerRun, 1, 200);
  config.requestTimeoutMs = clamp(config.requestTimeoutMs, 2000, 60000);
  config.pauseOnBounceRateAbove = clampFloat(config.pauseOnBounceRateAbove, 0.01, 1);
  config.pauseOnOptOutRateAbove = clampFloat(config.pauseOnOptOutRateAbove, 0.01, 1);
  return config;
}

/** Gmail OAuth credentials from the environment (may be empty strings). */
export function getGmailEnv(): GmailEnv {
  loadEnv();
  return {
    clientId: process.env.GMAIL_CLIENT_ID ?? "",
    clientSecret: process.env.GMAIL_CLIENT_SECRET ?? "",
    refreshToken: process.env.GMAIL_REFRESH_TOKEN ?? "",
    senderEmail: process.env.GMAIL_SENDER_EMAIL ?? "",
  };
}

/** True only when all four Gmail credentials are present. */
export function hasGmailCreds(env: GmailEnv): boolean {
  return Boolean(env.clientId && env.clientSecret && env.refreshToken && env.senderEmail);
}

/** Resolve hunter API keys from env, using the env-var NAMES stored in config. */
export function getHunterEnv(config: OutreachConfig): HunterEnv {
  loadEnv();
  return {
    googleCustomSearchKey: process.env[config.apiKeys.googleCustomSearchEnv] ?? "",
    googleCustomSearchCx: process.env[config.apiKeys.googleCustomSearchCxEnv] ?? "",
    googlePlacesKey: process.env[config.apiKeys.googlePlacesEnv] ?? "",
    serpApiKey: process.env[config.apiKeys.serpApiEnv] ?? "",
  };
}

function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(Math.round(n), max));
}

function clampFloat(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(n, max));
}
