/**
 * Google Places (Maps) source adapter — HONEST PLACEHOLDER for V1.
 *
 * This adapter does NOT scrape or call any API yet. isConfigured is always false
 * and search returns needsSetup=true with the exact steps required to enable a
 * real Places Text Search integration in a later step.
 */
import type { CampaignRow, HunterAdapter, HunterSearchOutput } from "../../types";

export const googleMaps: HunterAdapter = {
  id: "google_maps",
  name: "Google Places (Maps)",

  isConfigured(): boolean {
    return false;
  },

  async search(campaign: CampaignRow): Promise<HunterSearchOutput> {
    void campaign;
    return {
      results: [],
      note:
        "Google Places (Maps) adaptörü V1'de placeholder. Kurulum: GOOGLE_PLACES_API_KEY alın, " +
        "config.hunterSources.googlePlaces=true yapın; Places Text Search entegrasyonu bu adım sonrası eklenir.",
      needsSetup: true,
    };
  },
};
