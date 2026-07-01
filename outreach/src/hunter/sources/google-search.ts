/**
 * Google Custom Search (Programmable Search Engine) source adapter.
 *
 * When enabled + keyed, this performs ONE real HTTP request per campaign against
 * the Custom Search JSON API and maps result items into HunterResult rows.
 * When not configured it returns an honest needsSetup note with exact setup
 * instructions and makes no network call.
 */
import type { CampaignRow, HunterAdapter, HunterEnv, HunterResult, HunterSearchOutput, OutreachConfig } from "../../types";

/** Shape of the pieces of the Custom Search JSON response we consume. */
interface CustomSearchItem {
  title?: string;
  link?: string;
}
interface CustomSearchResponse {
  items?: CustomSearchItem[];
}

/** Build the search query from the campaign (explicit query wins). */
function buildQuery(campaign: CampaignRow): string {
  const q = (campaign.query || "").trim();
  if (q) return q;
  return `${campaign.industry} ${campaign.city} ${campaign.district}`.trim();
}

export const googleSearch: HunterAdapter = {
  id: "google_search",
  name: "Google Custom Search",

  isConfigured(config: OutreachConfig, env: HunterEnv): boolean {
    return Boolean(
      config.hunterSources.googleCustomSearch && env.googleCustomSearchKey && env.googleCustomSearchCx,
    );
  },

  async search(campaign: CampaignRow, config: OutreachConfig, env: HunterEnv): Promise<HunterSearchOutput> {
    if (!this.isConfigured(config, env)) {
      return {
        results: [],
        note:
          "Google Custom Search kapalı. Kurulum: config.hunterSources.googleCustomSearch=true + " +
          "GOOGLE_CUSTOM_SEARCH_API_KEY ve GOOGLE_CUSTOM_SEARCH_CX ortam değişkenleri.",
        needsSetup: true,
      };
    }

    const query = buildQuery(campaign);
    const url =
      "https://www.googleapis.com/customsearch/v1" +
      `?key=${encodeURIComponent(env.googleCustomSearchKey)}` +
      `&cx=${encodeURIComponent(env.googleCustomSearchCx)}` +
      `&q=${encodeURIComponent(query)}` +
      "&num=10";

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.requestTimeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) {
        return {
          results: [],
          note: `Google Custom Search hatası: HTTP ${res.status}`,
          needsSetup: false,
        };
      }
      const data = (await res.json()) as CustomSearchResponse;
      const items = data.items ?? [];
      const cap = Math.min(Number(campaign.max_results) || 50, config.maxHunterResultsPerCampaign);
      const results: HunterResult[] = items.slice(0, cap).map((item) => ({
        business_name: item.title ?? "",
        website: item.link ?? "",
        phone: "",
        city: "",
        district: "",
        industry: "",
        business_type: "",
        source: "google_search",
        source_url: item.link ?? "",
        google_maps_url: "",
        instagram: "",
        rating: "",
        review_count: "",
      }));
      return { results, note: "", needsSetup: false };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { results: [], note: `Google Custom Search hatası: ${msg}`, needsSetup: false };
    } finally {
      clearTimeout(timer);
    }
  },
};
