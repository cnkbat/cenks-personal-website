/**
 * Lead scoring (0–100). Higher == more worth contacting. The point system
 * follows the brief exactly. Scoring is advisory input to the send decision;
 * the hard gate is `config.minLeadScoreToSend` (default 70).
 */
import type { BusinessAnalysis, Lead, ScoreResult, ValidationResult } from "./types";
import { HIGH_VALUE_CATEGORIES, APPOINTMENT_CATEGORIES, VISUAL_CATEGORIES, SEARCH_INTENT_CATEGORIES, classifyCategory } from "./knowledge";

const WEAK_SITE_PROBLEMS = new Set([
  "outdated_website",
  "weak_mobile",
  "weak_conversion",
  "poor_seo",
  "no_whatsapp_cta",
]);

const ADS_PROBLEMS = new Set([
  "google_ads_potential",
  "meta_ads_potential",
  "tiktok_ads_potential",
  "no_ads_landing",
]);

/** Score a lead using validation + analysis context. */
export function scoreLead(
  lead: Lead,
  analysis: BusinessAnalysis,
  validation: ValidationResult,
): ScoreResult {
  const breakdown: { label: string; points: number }[] = [];
  const add = (label: string, points: number) => {
    if (points !== 0) breakdown.push({ label, points });
  };

  const category = classifyCategory(lead.industry, lead.business_type);
  const hasWebsite = Boolean(lead.website.trim());
  const hasMaps = Boolean(lead.google_maps_url.trim());
  const highValue = HIGH_VALUE_CATEGORIES.has(category);
  const problems = new Set(analysis.detectedProblems);
  const hasEmail = Boolean(lead.email.trim());

  // Positives
  if (validation.isBusinessEmail) add("Kurumsal e-posta", 20);
  if (hasWebsite && [...problems].some((p) => WEAK_SITE_PROBLEMS.has(p)))
    add("Zayıf/eski web sitesi (iyileştirme fırsatı)", 15);
  if (!hasWebsite && highValue) add("Web sitesi yok ama güçlü işletme potansiyeli", 15);
  if (hasMaps) add("Google Maps / yerel işletme varlığı", 15);
  if (highValue) add("Yüksek değerli sektör", 10);
  if (APPOINTMENT_CATEGORIES.has(category)) add("Randevu/hizmet modeli", 10);
  if ([...problems].some((p) => ADS_PROBLEMS.has(p)) || VISUAL_CATEGORIES.has(category) || SEARCH_INTENT_CATEGORIES.has(category))
    add("Reklamdan fayda görme ihtimali", 10);
  if (lead.owner_name.trim()) add("Görünür yetkili/iletişim kişisi", 5);

  // Negatives
  if (!hasEmail) add("E-posta eksik", -20);
  const noBusinessData =
    !lead.industry.trim() && !lead.business_type.trim() && !hasWebsite && !hasMaps;
  if (noBusinessData) add("Net işletme verisi yok", -15);
  if (!highValue && !APPOINTMENT_CATEGORIES.has(category)) add("Düşük ticari potansiyel", -20);
  if (!validation.isBusinessEmail && category === "unknown")
    add("Kişisel/işletme dışı lead görünümü", -30);

  const raw = breakdown.reduce((sum, b) => sum + b.points, 0);
  const score = Math.max(0, Math.min(100, raw));
  return { score, breakdown };
}
