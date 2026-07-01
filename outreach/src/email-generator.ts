/**
 * Email generation. Fills a Turkish template with lead-specific data so every
 * email is personalized (business name + one real detected problem + one
 * concrete improvement + the chosen offer + portfolio + meeting CTA + opt-out).
 *
 * The copy lives in /outreach/templates/*.tr.md — edit tone there. This module
 * only decides *which* problem/offer/subject to inject.
 */
import fs from "node:fs";
import path from "node:path";
import type {
  BusinessAnalysis,
  GeneratedEmail,
  Lead,
  OfferKey,
  OfferSelection,
  OutreachConfig,
} from "./types";
import { OFFER_META, OFFER_NAMES, PROBLEM_META, stableHash } from "./knowledge";
import { PATHS } from "./config";

/** offer key -> template filename */
const OFFER_TEMPLATE: Record<OfferKey, string> = {
  website: "website-offer.tr.md",
  crm: "crm-offer.tr.md",
  "google-ads": "google-ads-offer.tr.md",
  "meta-ads": "meta-ads-offer.tr.md",
  "tiktok-ads": "tiktok-ads-offer.tr.md",
  seo: "seo-offer.tr.md",
  automation: "automation-offer.tr.md",
};

const templateCache = new Map<string, string>();

function readTemplate(file: string): string {
  if (templateCache.has(file)) return templateCache.get(file)!;
  const full = path.join(PATHS.templates, file);
  const text = fs.readFileSync(full, "utf8");
  templateCache.set(file, text);
  return text;
}

/** Substitute all {{key}} placeholders. Unknown keys are left as-is. */
function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (m, key: string) =>
    key in vars ? vars[key] : m,
  );
}

function greeting(lead: Lead): string {
  if (lead.owner_name.trim()) return `Merhaba ${lead.owner_name.trim()},`;
  return `Merhaba ${lead.business_name.trim()} ekibi,`;
}

/** The meeting CTA — online OR offline, book via cal.com, asks them to specify. */
function meetingCta(config: OutreachConfig): string {
  const url = config.calendarUrl || config.meetingUrl;
  return (
    `İsterseniz kısa bir görüşme yapabiliriz. ` +
    `Online ya da yüz yüze hangisi sizin için uygunsa ona göre ilerleyebiliriz:\n${url}`
  );
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function pickSubject(offer: OfferKey, lead: Lead): string {
  const subjects = OFFER_META[offer].subjects;
  const idx = stableHash(lead.lead_id || lead.business_name) % subjects.length;
  return subjects[idx].replace(/\{business_name\}/g, lead.business_name.trim());
}

function problemSentence(selection: OfferSelection, analysis: BusinessAnalysis): string {
  const focus = selection.focusProblem ?? analysis.detectedProblems[0] ?? null;
  if (focus) return PROBLEM_META[focus].sentence;
  return "İşletmenizin dijital tarafında geliştirilebilecek birkaç somut nokta olduğunu düşünüyorum.";
}

/** Generate the first-touch cold email for a lead. */
export function generateEmail(
  lead: Lead,
  analysis: BusinessAnalysis,
  selection: OfferSelection,
  config: OutreachConfig,
): GeneratedEmail {
  const offer = selection.offer;
  const template = readTemplate(OFFER_TEMPLATE[offer]);
  const vars: Record<string, string> = {
    greeting: greeting(lead),
    sender_name: config.senderName,
    brand_name: config.brandName,
    business_name: lead.business_name.trim(),
    problem_sentence: problemSentence(selection, analysis),
    improvement: OFFER_META[offer].improvement,
    offer_name: OFFER_NAMES[offer],
    portfolio_url: config.portfolioUrl,
    meeting_url: config.calendarUrl || config.meetingUrl,
    cta: meetingCta(config),
    opt_out: config.optOutLine,
  };
  const body = fill(template, vars).trim();
  return {
    lead_id: lead.lead_id,
    type: "cold",
    subject: pickSubject(offer, lead),
    body,
    offer,
    offerName: OFFER_NAMES[offer],
    wordCount: wordCount(body),
  };
}

/** Generate a follow-up (n = 1 or 2) referencing the first email. */
export function generateFollowup(
  lead: Lead,
  selection: OfferSelection,
  config: OutreachConfig,
  n: 1 | 2,
): GeneratedEmail {
  const template = readTemplate(n === 1 ? "followup-1.tr.md" : "followup-2.tr.md");
  const offer = selection.offer;
  const vars: Record<string, string> = {
    greeting: greeting(lead),
    sender_name: config.senderName,
    brand_name: config.brandName,
    business_name: lead.business_name.trim(),
    offer_name: OFFER_NAMES[offer],
    portfolio_url: config.portfolioUrl,
    meeting_url: config.calendarUrl || config.meetingUrl,
    cta: meetingCta(config),
    opt_out: config.optOutLine,
  };
  const body = fill(template, vars).trim();
  const subject = `${lead.business_name.trim()} — kısa bir hatırlatma`;
  return {
    lead_id: lead.lead_id,
    type: n === 1 ? "followup_1" : "followup_2",
    subject,
    body,
    offer,
    offerName: OFFER_NAMES[offer],
    wordCount: wordCount(body),
  };
}
