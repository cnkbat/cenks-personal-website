/**
 * Enrichment pass. Takes raw discovered leads (status="new"), fetches their
 * website (within a per-run budget), detects concrete gaps, extracts a contact
 * email, runs the shared analyzer/scorer/offer-selector, writes an enriched row,
 * and promotes qualifying leads into leads.csv.
 *
 * This module only researches and logs — it NEVER sends email. Promotion is
 * guarded by score, a real detected problem, dedupe and the do-not-contact list.
 * No row can crash the run: every iteration is wrapped in try/catch.
 *
 * Command elsewhere.
 */
import type { EnrichedLeadRow, Lead, OutreachConfig, ProblemId } from "../types";
import { log } from "../logger";
import { nowIso } from "../time";
import { isDuplicateLead, normalizeDomain } from "../dedupe/dedupe";
import { isDoNotContact, loadDoNotContact } from "../compliance/do-not-contact";
import { appendEnriched, loadDiscovered, saveDiscovered } from "../store";
import { loadLeads, nextLeadId, saveLeads } from "../lead-importer";
import { validateLead } from "../lead-validator";
import { analyzeBusiness } from "../website-analyzer";
import { scoreLead } from "../lead-scorer";
import { selectOffer } from "../offer-selector";
import { PROBLEM_META } from "../knowledge";
import { fetchPage } from "./website-fetch";
import { extractEmails, pickBestEmail } from "./email-extractor";

/** Aggregate outcome of one enrichment run. */
export interface EnrichSummary {
  processed: number;
  enriched: number;
  emailsFound: number;
  noEmail: number;
  promoted: number;
  rejected: number;
  duplicates: number;
  doNotContact: number;
  fetchesUsed: number;
}

/** Problems that indicate a paid-ads opportunity. */
const ADS_PROBLEMS = new Set<ProblemId>([
  "google_ads_potential",
  "meta_ads_potential",
  "tiktok_ads_potential",
  "no_ads_landing",
]);

/** Website signals detected from a page's (lowercased) HTML. */
interface SiteSignals {
  hasOnlineBooking: boolean;
  hasWhatsapp: boolean;
  hasLeadForm: boolean;
  hasServicesPage: boolean;
  seoBasics: boolean;
  mobileFriendly: boolean;
}

/** Empty Lead with every column present (leads.csv is a fixed-shape CSV). */
function blankLead(): Lead {
  return {
    lead_id: "",
    business_name: "",
    owner_name: "",
    email: "",
    phone: "",
    website: "",
    instagram: "",
    google_maps_url: "",
    industry: "",
    city: "",
    district: "",
    business_type: "",
    observed_problem: "",
    suggested_offer: "",
    lead_score: "",
    status: "",
    last_contacted_at: "",
    next_followup_at: "",
    reply_status: "",
    notes: "",
  };
}

/** CSV boolean string. */
function boolStr(b: boolean): string {
  return b ? "true" : "false";
}

/** Registrable domain of a site URL (reuses the dedupe normaliser). */
function siteDomain(url: string): string {
  return normalizeDomain(url);
}

/** Detect page-level signals from raw HTML. */
function detectSignals(html: string): SiteSignals {
  const hay = html.toLowerCase();
  return {
    hasWhatsapp: /wa\.me|api\.whatsapp|whatsapp:\/\//.test(hay),
    hasLeadForm: hay.includes("<form") || hay.includes("mailto:"),
    hasOnlineBooking: ["randevu", "rezervasyon", "booking", "appointment", "calendly", "cal.com"].some(
      (k) => hay.includes(k),
    ),
    hasServicesPage: ["hizmet", "services", "tedavi"].some((k) => hay.includes(k)),
    seoBasics:
      hay.includes("<title") &&
      /meta[^>]+name=["']description["']/.test(hay) &&
      hay.includes("<h1"),
    mobileFriendly: /meta[^>]+name=["']viewport["']/.test(hay),
  };
}

/** 0–100 quality heuristic from https + detected signals. */
function qualityScore(httpsOk: boolean, s: SiteSignals): number {
  let q = 0;
  if (httpsOk) q += 20;
  if (s.mobileFriendly) q += 20;
  if (s.seoBasics) q += 20;
  if (s.hasOnlineBooking) q += 12;
  if (s.hasWhatsapp) q += 10;
  if (s.hasLeadForm) q += 10;
  if (s.hasServicesPage) q += 8;
  return Math.max(0, Math.min(100, q));
}

/** Find the first contact/iletisim link in the HTML, if any. */
function findContactHref(html: string): string {
  const re = /href\s*=\s*["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const low = (m[1] ?? "").toLowerCase();
    if (low.includes("iletisim") || low.includes("iletişim") || low.includes("contact")) {
      return m[1];
    }
  }
  return "";
}

/** Resolve a possibly-relative href against a base URL. */
function resolveUrl(base: string, href: string): string {
  try {
    return new URL(href, base.includes("://") ? base : `https://${base}`).toString();
  } catch {
    return href;
  }
}

/** Turkish notes string listing detected gaps (keyword-aligned for the analyzer). */
function synthesizeNotes(s: SiteSignals): string {
  return [
    !s.hasOnlineBooking ? "online randevu yok" : "",
    !s.hasWhatsapp ? "whatsapp yok" : "",
    !s.seoBasics ? "google'da üst sıralarda değil / seo zayıf" : "",
    !s.hasLeadForm ? "form yok" : "",
    !s.mobileFriendly ? "mobil zayıf" : "",
  ]
    .filter(Boolean)
    .join(", ");
}

/**
 * Run the enrichment pass over all discovered rows with status="new". Respects a
 * fetch budget of config.maxWebsiteFetchesPerRun. Never throws per row.
 */
export async function runEnrichment(config: OutreachConfig): Promise<EnrichSummary> {
  const summary: EnrichSummary = {
    processed: 0,
    enriched: 0,
    emailsFound: 0,
    noEmail: 0,
    promoted: 0,
    rejected: 0,
    duplicates: 0,
    doNotContact: 0,
    fetchesUsed: 0,
  };

  log.section("Zenginleştirme (enrichment)");

  const discovered = loadDiscovered();
  const leads = loadLeads();
  const dncRows = loadDoNotContact();
  const budget = config.maxWebsiteFetchesPerRun;

  for (const row of discovered) {
    if (row.status.trim().toLowerCase() !== "new") continue;
    summary.processed++;

    try {
      const website = row.website.trim();
      const hasWebsite = Boolean(website);

      // --- Signals / website inspection (blank defaults for no-website leads) ---
      let signals: SiteSignals = {
        hasOnlineBooking: false,
        hasWhatsapp: false,
        hasLeadForm: false,
        hasServicesPage: false,
        seoBasics: false,
        mobileFriendly: false,
      };
      let websiteStatus = "";
      let websiteQuality = 0;
      let contactPage = "";
      let homepageHtml = "";
      let contactHtml = "";

      if (hasWebsite && summary.fetchesUsed < budget) {
        const r = await fetchPage(website, config.requestTimeoutMs);
        summary.fetchesUsed++;
        homepageHtml = r.html;
        signals = detectSignals(r.html);
        const httpsOk = /^https:/i.test(r.finalUrl);
        websiteStatus = r.ok ? String(r.status) : `error:${r.error}`;
        websiteQuality = qualityScore(httpsOk, signals);

        // Try a contact page for a better email, if the budget allows.
        const contactHref = findContactHref(r.html);
        if (contactHref && summary.fetchesUsed < budget) {
          const contactUrl = resolveUrl(r.finalUrl || website, contactHref);
          const cr = await fetchPage(contactUrl, config.requestTimeoutMs);
          summary.fetchesUsed++;
          contactHtml = cr.html;
          contactPage = cr.ok ? cr.finalUrl || contactUrl : contactUrl;
        }
      }

      // --- Email extraction (homepage + contact page) ---
      const homepageEmails = extractEmails(homepageHtml);
      const contactEmails = extractEmails(contactHtml);
      const best = pickBestEmail([...homepageEmails, ...contactEmails], siteDomain(website));
      const fromContact = Boolean(
        best && !homepageEmails.includes(best.email) && contactEmails.includes(best.email),
      );
      const emailSource = best ? (fromContact ? "contact_page" : "homepage") : "none";
      const email = best?.email ?? "";

      // --- Build a Lead for the shared analysis pipeline ---
      const analysisLead = blankLead();
      analysisLead.business_name = row.business_name;
      analysisLead.email = email;
      analysisLead.phone = row.phone;
      analysisLead.website = website;
      analysisLead.instagram = row.instagram;
      analysisLead.google_maps_url = row.google_maps_url;
      analysisLead.industry = row.industry;
      analysisLead.city = row.city;
      analysisLead.district = row.district;
      analysisLead.business_type = row.business_type;
      analysisLead.observed_problem = "";
      analysisLead.lead_score = "";
      analysisLead.status = "pending";
      analysisLead.notes = synthesizeNotes(signals);

      const validation = validateLead(analysisLead);
      const analysis = analyzeBusiness(analysisLead);
      const score = scoreLead(analysisLead, analysis, validation);
      const selection = selectOffer(analysisLead, analysis);

      const adOpportunity = analysis.detectedProblems.some((p) => ADS_PROBLEMS.has(p));

      // --- Enriched row (append per row) ---
      const enrichedRow: EnrichedLeadRow = {
        discovery_id: row.discovery_id,
        campaign_id: row.campaign_id,
        business_name: row.business_name,
        email,
        email_source: emailSource,
        website,
        has_website: boolStr(hasWebsite),
        website_status: websiteStatus,
        website_quality: String(websiteQuality),
        mobile_friendly: boolStr(signals.mobileFriendly),
        has_online_booking: boolStr(signals.hasOnlineBooking),
        has_whatsapp: boolStr(signals.hasWhatsapp),
        has_lead_form: boolStr(signals.hasLeadForm),
        has_services_page: boolStr(signals.hasServicesPage),
        seo_basics: boolStr(signals.seoBasics),
        ad_opportunity: boolStr(adOpportunity),
        instagram: row.instagram,
        google_maps_url: row.google_maps_url,
        whatsapp_link: "",
        contact_page: contactPage,
        detected_problems: analysis.detectedProblems.join("|"),
        recommended_offer: selection.offerName,
        confidence: String(analysis.confidenceScore),
        lead_score: String(score.score),
        enriched_at: nowIso(),
        status: "enriched",
        notes: "",
      };

      if (best) summary.emailsFound++;
      else summary.noEmail++;

      // --- Promotion decision ---
      const candidate = {
        email,
        website,
        business_name: row.business_name,
        phone: row.phone,
        city: row.city,
        district: row.district,
      };
      const isDup = isDuplicateLead(candidate, leads);
      const isDnc = isDoNotContact(
        { email, website, business_name: row.business_name, city: row.city },
        dncRows,
      );
      const scoreOk = score.score >= config.minLeadScoreToSend;
      const hasProblem = analysis.detectedProblems.length > 0;

      let finalStatus: string;
      if (best && scoreOk && hasProblem && !isDup && !isDnc) {
        const focus = selection.focusProblem;
        const observed = focus
          ? PROBLEM_META[focus].label
          : analysis.detectedProblems[0]
            ? PROBLEM_META[analysis.detectedProblems[0]].label
            : "";

        const newLead = blankLead();
        newLead.lead_id = nextLeadId(leads);
        newLead.business_name = row.business_name;
        newLead.email = email;
        newLead.phone = row.phone;
        newLead.website = website;
        newLead.instagram = row.instagram;
        newLead.google_maps_url = row.google_maps_url;
        newLead.industry = row.industry;
        newLead.city = row.city;
        newLead.district = row.district;
        newLead.business_type = row.business_type;
        newLead.observed_problem = observed;
        newLead.suggested_offer = selection.offerName;
        newLead.lead_score = String(score.score);
        newLead.status = "pending";
        newLead.notes = `Lead Hunter: ${row.campaign_id}`;
        leads.push(newLead);

        finalStatus = "promoted";
        summary.promoted++;
        log.info(`Yükseltildi: ${row.business_name} (skor ${score.score}, ${selection.offerName})`);
      } else if (isDnc) {
        finalStatus = "do_not_contact";
        summary.doNotContact++;
      } else if (isDup) {
        finalStatus = "duplicate";
        summary.duplicates++;
      } else if (!best) {
        // Counted once in summary.noEmail above.
        finalStatus = "no_email";
      } else {
        finalStatus = "rejected";
        summary.rejected++;
      }

      row.status = finalStatus;
      enrichedRow.status = finalStatus;
      appendEnriched(enrichedRow);
      summary.enriched++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log.warn(`Zenginleştirme atlandı (${row.business_name || row.discovery_id}): ${msg}`);
    }
  }

  saveLeads(leads);
  saveDiscovered(discovered);

  log.info(
    `İşlenen: ${summary.processed} · zenginleştirilen: ${summary.enriched} · e-posta: ${summary.emailsFound} · ` +
      `yükseltilen: ${summary.promoted} · mükerrer: ${summary.duplicates} · ` +
      `iletişim yasağı: ${summary.doNotContact} · reddedilen: ${summary.rejected} · fetch: ${summary.fetchesUsed}`,
  );

  return summary;
}
