/**
 * Instagram source adapter — HONEST PLACEHOLDER.
 *
 * There is no official public API for discovering business profiles, so this
 * adapter never runs for real. It points the operator at the Manual Import
 * Adapter (source=manual) to bring hand-collected profiles into the pipeline.
 */
import type { CampaignRow, HunterAdapter, HunterSearchOutput } from "../../types";

export const instagram: HunterAdapter = {
  id: "instagram",
  name: "Instagram",

  isConfigured(): boolean {
    return false;
  },

  async search(campaign: CampaignRow): Promise<HunterSearchOutput> {
    void campaign;
    return {
      results: [],
      note:
        "Instagram profilleri için resmi genel API yok; profilleri manuel toplayıp " +
        "Manual Import Adapter (source=manual) ile içe aktarın.",
      needsSetup: true,
    };
  },
};
