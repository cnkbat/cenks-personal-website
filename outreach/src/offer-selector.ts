/**
 * Offer selection. Turns a set of detected problems into exactly one offer to
 * pitch — and guarantees that offer is backed by a real detected problem
 * ("the selected offer must match the detected problem").
 */
import type { BusinessAnalysis, Lead, OfferKey, OfferSelection, ProblemId } from "./types";
import {
  APPOINTMENT_CATEGORIES,
  Category,
  CATEGORY_LABEL,
  OFFER_NAMES,
  SEARCH_INTENT_CATEGORIES,
  VISUAL_CATEGORIES,
  classifyCategory,
} from "./knowledge";

/** Which offer each problem is solved by. */
export const PROBLEM_TO_OFFER: Record<ProblemId, OfferKey> = {
  no_website: "website",
  outdated_website: "website",
  weak_mobile: "website",
  weak_conversion: "website",
  no_clear_offer: "website",
  no_whatsapp_cta: "website",
  no_appointment_flow: "crm",
  no_online_booking: "crm",
  no_crm: "crm",
  google_ads_potential: "google-ads",
  no_ads_landing: "google-ads",
  meta_ads_potential: "meta-ads",
  tiktok_ads_potential: "tiktok-ads",
  weak_google_presence: "seo",
  poor_seo: "seo",
  no_lead_form: "automation",
};

/** Map a free-text suggested_offer to a canonical OfferKey (or null). */
export function normalizeSuggestedOffer(text: string): OfferKey | null {
  const t = text.toLowerCase().trim();
  if (!t) return null;
  if (t.includes("crm") || t.includes("randevu") || t.includes("appointment")) return "crm";
  if (t.includes("google")) return "google-ads";
  if (t.includes("meta") || t.includes("facebook") || t.includes("instagram ad")) return "meta-ads";
  if (t.includes("tiktok")) return "tiktok-ads";
  if (t.includes("seo") || t.includes("görünürlük")) return "seo";
  if (t.includes("automation") || t.includes("otomasyon")) return "automation";
  if (t.includes("website") || t.includes("web site") || t.includes("web sitesi") || t.includes("site"))
    return "website";
  return null;
}

/** Priority of an offer for this business context (higher = stronger fit). */
function offerPriority(offer: OfferKey, category: Category, hasWebsite: boolean): number {
  switch (offer) {
    case "website":
      return !hasWebsite ? 100 : 78;
    case "crm":
      return APPOINTMENT_CATEGORIES.has(category) ? 90 : 42;
    case "seo":
      return hasWebsite ? 70 : 12;
    case "google-ads":
      return SEARCH_INTENT_CATEGORIES.has(category) ? 66 : 46;
    case "tiktok-ads":
      return VISUAL_CATEGORIES.has(category) ? 60 : 26;
    case "meta-ads":
      return VISUAL_CATEGORIES.has(category) ? 56 : 36;
    case "automation":
      return 50;
    default:
      return 0;
  }
}

/** First detected problem that this offer would solve, if any. */
function focusForOffer(offer: OfferKey, problems: ProblemId[]): ProblemId | null {
  return problems.find((p) => PROBLEM_TO_OFFER[p] === offer) ?? null;
}

function build(
  offer: OfferKey,
  focus: ProblemId | null,
  reasoning: string,
): OfferSelection {
  return { offer, offerName: OFFER_NAMES[offer], focusProblem: focus, reasoning };
}

/**
 * Pick the single best offer for a lead. Order of preference:
 *  1. A valid human `suggested_offer` that is backed by a detected problem.
 *  2. The detected problem whose offer has the highest contextual priority.
 *  3. A safe foundational fallback (website if none, else SEO).
 */
export function selectOffer(lead: Lead, analysis: BusinessAnalysis): OfferSelection {
  const category = classifyCategory(lead.industry, lead.business_type);
  const hasWebsite = Boolean(lead.website.trim());
  const problems = analysis.detectedProblems;

  // 1) Respect a valid, evidence-backed human suggestion.
  const suggested = normalizeSuggestedOffer(lead.suggested_offer);
  if (suggested) {
    const focus = focusForOffer(suggested, problems);
    if (focus) {
      return build(
        suggested,
        focus,
        `Sizin önerdiğiniz teklif (${OFFER_NAMES[suggested]}) tespit edilen sorunla uyumlu (${CATEGORY_LABEL[category]}).`,
      );
    }
  }

  // 2) Highest-priority offer among detected problems.
  let best: { offer: OfferKey; focus: ProblemId; priority: number } | null = null;
  for (const p of problems) {
    const offer = PROBLEM_TO_OFFER[p];
    const priority = offerPriority(offer, category, hasWebsite);
    if (!best || priority > best.priority) best = { offer, focus: p, priority };
  }
  if (best) {
    return build(
      best.offer,
      best.focus,
      `${CATEGORY_LABEL[category]} işletmesi için en güçlü uyum: ${OFFER_NAMES[best.offer]}.`,
    );
  }

  // 3) Fallback (should be rare — analyzer nearly always finds a problem).
  const fallback: OfferKey = hasWebsite ? "seo" : "website";
  return build(fallback, null, "Belirgin bir sorun tespit edilemedi; temel öneri uygulandı.");
}
