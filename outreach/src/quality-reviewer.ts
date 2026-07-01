/**
 * Automated quality review. Every email is scored 0–100 by an objective
 * checklist BEFORE it can be sent — this is what lets you run without manually
 * reading each email. Sending is blocked unless score >= config threshold
 * (default 90) AND every "critical" check passes.
 *
 * This is a deterministic reviewer (no network, fully reproducible). It exposes
 * the same `reviewEmail()` contract an LLM reviewer would, so you can layer an
 * LLM pass on top later without touching the pipeline.
 */
import type {
  BusinessAnalysis,
  GeneratedEmail,
  Lead,
  OutreachConfig,
  QualityCheck,
  QualityReview,
} from "./types";

const FORBIDDEN_SERVICE_PATTERNS: RegExp[] = [
  /sosyal medya yönet/i,
  /sosyal medya yonet/i,
  /içerik üret/i,
  /icerik uret/i,
  /içerik paket/i,
  /icerik paket/i,
  /instagram yönet/i,
  /instagram yonet/i,
  /\bcontent\b/i,
  /post atma/i,
  /reels çek/i,
];

const FALSE_PROMISE_PATTERNS: RegExp[] = [
  /garanti/i,
  /kesin satış/i,
  /kesin sonuç/i,
  /kesinlikle artır/i,
  /%\s*100/,
  /\b100\s*%/,
  /muhteşem fırsat/i,
  /kaçırmayın/i,
  /hemen dönüş yap/i,
];

const MISLEADING_SUBJECT_PATTERNS: RegExp[] = [
  /bedava/i,
  /ücretsiz para/i,
  /son şans/i,
  /acele/i,
  /kazandınız/i,
  /tıkla/i,
  /re:/i,
  /fwd:/i,
];

/** Review one generated email. Pure function — safe to call anywhere. */
export function reviewEmail(
  email: GeneratedEmail,
  lead: Lead,
  analysis: BusinessAnalysis,
  config: OutreachConfig,
): QualityReview {
  const body = email.body;
  const lower = body.toLowerCase();
  const checks: QualityCheck[] = [];

  const check = (
    name: string,
    passed: boolean,
    detail: string,
    weight: number,
    critical = false,
  ) => checks.push({ name, passed, detail, weight, critical });

  // Personalization — the actual business name must appear.
  const nameIncluded = lead.business_name.trim().length > 0 && body.includes(lead.business_name.trim());
  check("personalization", nameIncluded, nameIncluded ? "İşletme adı geçiyor" : "İşletme adı yok", 15, true);

  // A specific detected problem must back the email.
  const hasProblem = analysis.detectedProblems.length > 0;
  check("business_problem", hasProblem, hasProblem ? `${analysis.detectedProblems.length} sorun` : "Tespit edilen sorun yok", 15, true);

  // Opt-out line (exact sentence from config).
  const hasOptOut = body.includes(config.optOutLine);
  check("opt_out", hasOptOut, hasOptOut ? "Çıkış cümlesi var" : "Çıkış cümlesi yok", 12, true);

  // Portfolio link.
  const hasPortfolio = body.includes(config.portfolioUrl);
  check("portfolio_link", hasPortfolio, hasPortfolio ? "Portföy linki var" : "Portföy linki yok", 8, true);

  // Meeting link (cal.com) — supports the online/offline CTA.
  const hasMeeting = body.includes(config.calendarUrl || config.meetingUrl);
  check("meeting_link", hasMeeting, hasMeeting ? "Görüşme linki var" : "Görüşme linki yok", 6);

  // Offer fit — the chosen offer must be reflected in the copy.
  const offerFit = lower.includes(email.offerName.toLowerCase()) || offerKeywordPresent(email, lower);
  check("offer_fit", offerFit, offerFit ? `Teklif uyumlu: ${email.offerName}` : "Teklif metinde net değil", 10);

  // No forbidden services.
  const forbiddenHit = FORBIDDEN_SERVICE_PATTERNS.find((re) => re.test(body));
  check("no_forbidden_services", !forbiddenHit, forbiddenHit ? `Yasak hizmet: ${forbiddenHit}` : "Yasak hizmet yok", 12, true);

  // No false promises.
  const promiseHit = FALSE_PROMISE_PATTERNS.find((re) => re.test(body));
  check("no_false_promises", !promiseHit, promiseHit ? `Abartılı vaat: ${promiseHit}` : "Abartılı vaat yok", 10, true);

  // Subject not misleading.
  const subjectHit = MISLEADING_SUBJECT_PATTERNS.find((re) => re.test(email.subject));
  check("subject_honest", !subjectHit, subjectHit ? `Yanıltıcı konu: ${subjectHit}` : "Konu dürüst", 6, true);

  // Turkish fluency proxy — no unfilled placeholders, reasonable content.
  const noPlaceholders = !/\{\{.*?\}\}/.test(body) && !/undefined|null/.test(lower);
  check("fluency", noPlaceholders, noPlaceholders ? "Doldurulmamış alan yok" : "Şablon alanı boş kalmış", 8, true);

  // Clarity / length — cold email should be concise (90–170 words).
  const wc = email.wordCount;
  const clarity = wc >= 70 && wc <= 180;
  check("clarity_length", clarity, `${wc} kelime`, 8);

  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const gotWeight = checks.reduce((s, c) => s + (c.passed ? c.weight : 0), 0);
  const score = Math.round((gotWeight / totalWeight) * 100);

  const failedCritical = checks.filter((c) => c.critical && !c.passed);
  const passed = score >= config.minEmailQualityScoreToSend && failedCritical.length === 0;

  const failReasons = checks.filter((c) => !c.passed).map((c) => `${c.name}: ${c.detail}`);

  return { score, passed, checks, failReasons };
}

/** Loose keyword match so "offer fit" passes even when the display name isn't verbatim. */
function offerKeywordPresent(email: GeneratedEmail, lower: string): boolean {
  const map: Record<string, string[]> = {
    website: ["web sitesi", "web site", "site"],
    crm: ["randevu", "crm", "müşteri"],
    "google-ads": ["google ads", "google reklam", "arama"],
    "meta-ads": ["meta", "instagram", "facebook"],
    "tiktok-ads": ["tiktok"],
    seo: ["seo", "arama sonuç", "görünür"],
    automation: ["otomasyon", "otomatik"],
  };
  return (map[email.offer] ?? []).some((k) => lower.includes(k));
}
