/**
 * Business/website directory source adapter — HONEST PLACEHOLDER.
 *
 * Reserved for a future directory data source. Never runs for real in V1.
 */
import type { CampaignRow, HunterAdapter, HunterSearchOutput } from "../../types";

export const directory: HunterAdapter = {
  id: "directory",
  name: "İşletme Rehberi",

  isConfigured(): boolean {
    return false;
  },

  async search(campaign: CampaignRow): Promise<HunterSearchOutput> {
    void campaign;
    return {
      results: [],
      note: "Website/işletme rehberi adaptörü placeholder. İleride bir rehber kaynağı eklenebilir.",
      needsSetup: true,
    };
  },
};
