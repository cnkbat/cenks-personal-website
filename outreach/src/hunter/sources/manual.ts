/**
 * Manual Import source adapter.
 *
 * Reads businesses a human collected by hand from a per-campaign CSV template at
 * generated/hunter/manual/<campaign_id>.csv. This is the honest fallback for
 * sources with no usable public API (e.g. Instagram): collect leads manually,
 * drop them into the template, and re-run the hunt.
 *
 * If the template is missing/empty, it is created (header + one commented example
 * row) and the adapter reports needsSetup=true with Turkish instructions.
 */
import fs from "node:fs";
import path from "node:path";
import { PATHS } from "../../config";
import { readCsvObjects } from "../../csv";
import type { CampaignRow, HunterAdapter, HunterResult, HunterSearchOutput, OutreachConfig } from "../../types";

/** Columns the manual template accepts (any subset may be filled). */
const MANUAL_COLUMNS = [
  "business_name",
  "website",
  "phone",
  "city",
  "district",
  "industry",
  "business_type",
  "instagram",
  "google_maps_url",
  "source_url",
  "rating",
  "review_count",
] as const;

type ManualRow = Partial<Record<(typeof MANUAL_COLUMNS)[number], string>>;

/** Absolute path to the manual template for a given campaign. */
function templatePath(campaignId: string): string {
  return path.join(PATHS.generated.hunter, "manual", `${campaignId}.csv`);
}

/** Write a header-only template (with one commented example line) if missing. */
function ensureTemplate(file: string): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const header = MANUAL_COLUMNS.join(",");
  const example =
    "# Örnek: Güzellik Merkezi X,https://ornek.com,+90 555 000 0000,İstanbul,Kadıköy,güzellik,salon,ornekx,,,4.6,120";
  fs.writeFileSync(file, `${header}\n${example}\n`, "utf8");
}

/** Map a raw template row into a full HunterResult (missing fields => ""). */
function toResult(row: ManualRow): HunterResult {
  return {
    business_name: row.business_name ?? "",
    website: row.website ?? "",
    phone: row.phone ?? "",
    city: row.city ?? "",
    district: row.district ?? "",
    industry: row.industry ?? "",
    business_type: row.business_type ?? "",
    source: "manual",
    source_url: row.source_url ?? "",
    google_maps_url: row.google_maps_url ?? "",
    instagram: row.instagram ?? "",
    rating: row.rating ?? "",
    review_count: row.review_count ?? "",
  };
}

export const manual: HunterAdapter = {
  id: "manual",
  name: "Manuel İçe Aktarım",

  isConfigured(config: OutreachConfig): boolean {
    return config.hunterSources.manualImport;
  },

  async search(campaign: CampaignRow): Promise<HunterSearchOutput> {
    const file = templatePath(campaign.campaign_id);
    const rows = readCsvObjects<ManualRow & Record<string, string>>(file).filter((r) => {
      const name = (r.business_name ?? "").trim();
      // Ignore empty rows and the commented "#" example line in the template.
      return name.length > 0 && !name.startsWith("#");
    });

    if (rows.length === 0) {
      ensureTemplate(file);
      return {
        results: [],
        note: `Manuel giriş şablonu oluşturuldu: ${file}. Bulduğunuz işletmeleri doldurup 'npm run outreach:hunt' komutunu tekrar çalıştırın.`,
        needsSetup: true,
      };
    }

    const results = rows.map(toResult);
    return { results, note: "", needsSetup: false };
  },
};
