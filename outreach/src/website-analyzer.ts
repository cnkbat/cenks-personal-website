/**
 * Business analyzer. Detects concrete problems/opportunities for a lead from the
 * data we have (URLs + free-text observed_problem/notes + industry).
 *
 * PLUGGABLE BY DESIGN: today this is a deterministic heuristic engine (no
 * network). To add real scraping or an LLM pass later, implement the same
 * `analyzeBusiness(lead) => BusinessAnalysis` contract and swap it in sender.ts.
 * Everything downstream only depends on the returned shape.
 */
import type { BusinessAnalysis, Lead, ProblemId } from "./types";
import {
  APPOINTMENT_CATEGORIES,
  Category,
  CATEGORY_LABEL,
  SEARCH_INTENT_CATEGORIES,
  VISUAL_CATEGORIES,
  classifyCategory,
} from "./knowledge";
import { selectOffer } from "./offer-selector";

function hasAny(hay: string, words: string[]): boolean {
  return words.some((w) => hay.includes(w));
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/** Build the Turkish opportunity list from the business category. */
function opportunitiesFor(category: Category, hasWebsite: boolean): string[] {
  const out: string[] = [];
  if (!hasWebsite) out.push("Kendi web sitesi ile güçlü bir ilk izlenim oluşturma");
  if (APPOINTMENT_CATEGORIES.has(category))
    out.push("Online randevu + otomatik hatırlatma ile kaçan aramaları müşteriye çevirme");
  if (SEARCH_INTENT_CATEGORIES.has(category))
    out.push("Google'da yüksek niyetli aramaları yakalama");
  if (VISUAL_CATEGORIES.has(category))
    out.push("Görsel platformlarda (Meta/TikTok) yerel kitleye ulaşma");
  out.push("Dijital süreçleri sadeleştirip tekrar eden işleri otomatikleştirme");
  return out;
}

/**
 * Analyze a single lead. Returns detected problems, opportunities, a recommended
 * offer and a 0–100 confidence score. Never throws.
 */
export function analyzeBusiness(lead: Lead): BusinessAnalysis {
  const hay = `${lead.observed_problem} ${lead.notes}`.toLowerCase();
  const category = classifyCategory(lead.industry, lead.business_type);
  const hasWebsite = Boolean(lead.website.trim());
  const hasInstagram = Boolean(lead.instagram.trim());
  const hasMaps = Boolean(lead.google_maps_url.trim());

  const problems = new Set<ProblemId>();

  // --- Structural (from presence/absence of channels) ---
  if (!hasWebsite) {
    problems.add("no_website");
  } else {
    // We have a site; look for quality signals in the notes.
    if (hasAny(hay, ["eski", "güncel değil", "guncel degil", "outdated", "modası", "eskimiş"]))
      problems.add("outdated_website");
    if (hasAny(hay, ["mobil", "telefonda", "responsive", "yavaş", "yavas", "slow"]))
      problems.add("weak_mobile");
    if (hasAny(hay, ["dönüşüm", "donusum", "conversion", "cta", "yönlend", "yonlend"]))
      problems.add("weak_conversion");
    if (hasAny(hay, ["form", "lead", "başvuru", "basvuru"])) problems.add("no_lead_form");
    if (hasAny(hay, ["whatsapp", "wp hattı", "iletişim butonu"])) problems.add("no_whatsapp_cta");
  }

  // --- Discovery / SEO ---
  if (hasAny(hay, ["seo", "google'da", "googleda", "arama", "sıralama", "siralama", "üst sıra", "ust sira", "görünür", "gorunur"])) {
    problems.add(hasWebsite ? "poor_seo" : "weak_google_presence");
  }

  // --- Appointment / CRM ---
  if (hasAny(hay, ["randevu", "rezervasyon", "booking", "appointment", "telefonla"])) {
    problems.add("no_appointment_flow");
    if (hasAny(hay, ["online", "web üzerinden", "web uzerinden"])) problems.add("no_online_booking");
  }
  if (hasAny(hay, ["takip", "crm", "müşteri kayıt", "musteri kayit", "excel", "defter"]))
    problems.add("no_crm");

  // --- Ads ---
  if (hasAny(hay, ["google ads", "reklam", "adwords"])) problems.add("google_ads_potential");
  if (hasAny(hay, ["dönüşüm sayfası", "landing", "açılış sayfası", "acilis sayfasi"]))
    problems.add("no_ads_landing");
  if (hasAny(hay, ["instagram reklam", "meta", "facebook"])) problems.add("meta_ads_potential");
  if (hasAny(hay, ["tiktok"])) problems.add("tiktok_ads_potential");

  // --- Category-implied gaps (so sparse-but-real leads still get a concrete problem) ---
  if (problems.size === 0 || (!hasWebsite && APPOINTMENT_CATEGORIES.has(category))) {
    if (APPOINTMENT_CATEGORIES.has(category)) problems.add("no_appointment_flow");
    if (SEARCH_INTENT_CATEGORIES.has(category)) problems.add("google_ads_potential");
    if (VISUAL_CATEGORIES.has(category)) problems.add("tiktok_ads_potential");
    if (hasWebsite && problems.size === 0) problems.add("weak_google_presence");
  }

  const detectedProblems = [...problems];

  // --- Confidence ---
  let confidence = 35;
  if (lead.observed_problem.trim()) confidence += 22;
  if (category !== "unknown") confidence += 15;
  if (hasWebsite || hasMaps || hasInstagram) confidence += 10;
  if (lead.suggested_offer.trim()) confidence += 8;
  confidence += Math.min(15, detectedProblems.length * 5);
  if (detectedProblems.length === 0) confidence = Math.min(confidence, 25);
  confidence = clamp(confidence, 0, 100);

  const opportunities = opportunitiesFor(category, hasWebsite);

  // Recommend an offer from the detected problems (uses the same rules as sender).
  const partial: BusinessAnalysis = {
    detectedProblems,
    opportunities,
    recommendedOffer: "website",
    reasoning: "",
    confidenceScore: confidence,
  };
  const selection = selectOffer(lead, partial);

  const reasoning =
    detectedProblems.length > 0
      ? `${CATEGORY_LABEL[category]} işletmesi; ${detectedProblems.length} sorun tespit edildi. Önerilen: ${selection.offerName}.`
      : `Yeterli sinyal yok (${CATEGORY_LABEL[category]}); güvenli öneri: ${selection.offerName}.`;

  return {
    detectedProblems,
    opportunities,
    recommendedOffer: selection.offer,
    reasoning,
    confidenceScore: confidence,
  };
}
