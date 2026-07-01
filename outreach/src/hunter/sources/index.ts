/**
 * Registry of all Lead Hunter source adapters.
 *
 * The hunter looks up the adapter for a campaign by its `source` id. Unknown
 * sources fall back to the manual adapter (the always-available safe default).
 */
import type { HunterAdapter } from "../../types";
import { manual } from "./manual";
import { googleSearch } from "./google-search";
import { googleMaps } from "./google-maps";
import { instagram } from "./instagram";
import { directory } from "./directory";

/** All adapters, in display order. */
export const HUNTER_ADAPTERS: HunterAdapter[] = [manual, googleSearch, googleMaps, instagram, directory];

/** Resolve an adapter by source id, defaulting to manual. */
export function getHunterAdapter(sourceId: string): HunterAdapter {
  return HUNTER_ADAPTERS.find((a) => a.id === sourceId) ?? manual;
}
