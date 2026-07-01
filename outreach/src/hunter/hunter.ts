/**
 * Lead Hunter — discovery engine.
 *
 * Runs the configured source adapter for each active campaign, deduplicates the
 * raw results against existing leads and previously discovered rows, and appends
 * fresh businesses to discovered-leads.csv. It ONLY discovers and logs — it never
 * enriches, scores or sends. Every per-campaign step is wrapped so a single bad
 * source can never crash the whole run.
 *
 * Command: npm run outreach:hunt
 */
import fs from "node:fs";
import path from "node:path";
import { PATHS, getHunterEnv } from "../config";
import { log } from "../logger";
import { nowIso, dateStamp } from "../time";
import { loadLeads } from "../lead-importer";
import {
  ensureHunterDataFiles,
  loadCampaigns,
  saveCampaigns,
  loadDiscovered,
  appendDiscovered,
  nextDiscoveryId,
} from "../store";
import { isDuplicateLead, isSameBusiness } from "../dedupe/dedupe";
import type { DedupeCandidate } from "../dedupe/dedupe";
import type { CampaignRow, DiscoveredLeadRow, Lead, OutreachConfig } from "../types";
import { getHunterAdapter } from "./sources";

/** Per-campaign outcome line for the summary + report. */
export interface HuntPerCampaign {
  campaign_id: string;
  name: string;
  found: number;
  note: string;
  needsSetup: boolean;
}

/** Aggregate result of a hunt run. */
export interface HuntSummary {
  mode: string;
  campaignsRun: number;
  discovered: number;
  duplicatesSkipped: number;
  needsSetup: string[];
  perCampaign: HuntPerCampaign[];
}

/** Build a dedupe candidate from a discovered row (email always empty here). */
function candidateOfDiscovered(row: DiscoveredLeadRow): DedupeCandidate {
  return {
    email: "",
    website: row.website,
    business_name: row.business_name,
    phone: row.phone,
    city: row.city,
    district: row.district,
  };
}

/** Write a short Turkish markdown report for this run. Never throws. */
function writeReport(summary: HuntSummary): void {
  try {
    fs.mkdirSync(PATHS.generated.hunter, { recursive: true });
    const file = path.join(PATHS.generated.hunter, `hunt-${dateStamp()}.md`);
    const lines: string[] = [];
    lines.push(`# Lead Hunter Raporu — ${dateStamp()}`);
    lines.push("");
    lines.push(`- Mod: ${summary.mode}`);
    lines.push(`- Çalışan kampanya: ${summary.campaignsRun}`);
    lines.push(`- Bulunan (yeni) işletme: ${summary.discovered}`);
    lines.push(`- Atlanan mükerrer: ${summary.duplicatesSkipped}`);
    lines.push("");
    lines.push("## Kampanya Detayları");
    if (summary.perCampaign.length === 0) {
      lines.push("");
      lines.push("Çalıştırılacak kampanya bulunamadı.");
    }
    for (const c of summary.perCampaign) {
      lines.push("");
      lines.push(`### ${c.name} (${c.campaign_id})`);
      lines.push(`- Bulunan: ${c.found}`);
      lines.push(`- Kurulum gerekli: ${c.needsSetup ? "evet" : "hayır"}`);
      if (c.note) lines.push(`- Not: ${c.note}`);
    }
    if (summary.needsSetup.length > 0) {
      lines.push("");
      lines.push("## Kurulum Gereken Kaynaklar");
      for (const n of summary.needsSetup) lines.push(`- ${n}`);
    }
    fs.writeFileSync(file, lines.join("\n") + "\n", "utf8");
    log.info(`Rapor yazıldı: ${file}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log.warn(`Rapor yazılamadı: ${msg}`);
  }
}

/**
 * Run the lead-discovery pass. Selects active campaigns (or one campaign by id
 * regardless of status), runs each campaign's source adapter, and appends new,
 * non-duplicate businesses to discovered-leads.csv.
 */
export async function runHunt(
  config: OutreachConfig,
  opts?: { campaignId?: string },
): Promise<HuntSummary> {
  ensureHunterDataFiles();

  const mode = config.dryRun ? "dry-run" : "canlı";
  const summary: HuntSummary = {
    mode,
    campaignsRun: 0,
    discovered: 0,
    duplicatesSkipped: 0,
    needsSetup: [],
    perCampaign: [],
  };

  log.section("Lead Hunter — Keşif");

  if (!config.leadHunterEnabled) {
    const note = "Lead Hunter kapalı. config.leadHunterEnabled=true yaparak etkinleştirin.";
    log.warn(note);
    summary.needsSetup.push(note);
    return summary;
  }

  const allCampaigns = loadCampaigns();
  let selected: CampaignRow[];
  if (opts?.campaignId) {
    selected = allCampaigns.filter((c) => c.campaign_id === opts.campaignId);
    if (selected.length === 0) {
      const note = `Kampanya bulunamadı: ${opts.campaignId}.`;
      log.warn(note);
      summary.needsSetup.push(note);
      writeReport(summary);
      return summary;
    }
  } else {
    selected = allCampaigns.filter((c) => c.status.trim().toLowerCase() === "active");
    if (selected.length === 0) {
      const note = "Aktif kampanya yok. campaigns.csv içinde bir kampanyanın status alanını 'active' yapın.";
      log.warn(note);
      summary.needsSetup.push(note);
      writeReport(summary);
      return summary;
    }
  }

  const leads: Lead[] = loadLeads();
  // Snapshot of everything already discovered, extended as we append this run so
  // ids stay sequential and within-run duplicates are also caught.
  const discovered: DiscoveredLeadRow[] = loadDiscovered();

  for (const campaign of selected) {
    summary.campaignsRun++;
    const perCampaign: HuntPerCampaign = {
      campaign_id: campaign.campaign_id,
      name: campaign.name,
      found: 0,
      note: "",
      needsSetup: false,
    };

    try {
      const adapter = getHunterAdapter(campaign.source);
      const env = getHunterEnv(config);
      log.info(`Kampanya '${campaign.name}' — kaynak: ${adapter.name}`);

      const out = await adapter.search(campaign, config, env);
      perCampaign.note = out.note;
      perCampaign.needsSetup = out.needsSetup;
      if (out.needsSetup && out.note) summary.needsSetup.push(`${campaign.name}: ${out.note}`);

      const cap = Math.min(
        Number(campaign.max_results) || config.maxHunterResultsPerCampaign,
        config.maxHunterResultsPerCampaign,
      );
      const results = out.results.slice(0, cap);

      for (const result of results) {
        const candidate: DedupeCandidate = {
          email: "",
          website: result.website,
          business_name: result.business_name,
          phone: result.phone,
          city: result.city || campaign.city,
          district: result.district || campaign.district,
        };

        const dupOfLead = isDuplicateLead(candidate, leads);
        const dupOfDiscovered = discovered.some((d) =>
          isSameBusiness(candidate, candidateOfDiscovered(d)),
        );
        if (dupOfLead || dupOfDiscovered) {
          summary.duplicatesSkipped++;
          continue;
        }

        const row: DiscoveredLeadRow = {
          discovery_id: nextDiscoveryId(discovered),
          campaign_id: campaign.campaign_id,
          business_name: result.business_name,
          website: result.website,
          phone: result.phone,
          city: result.city || campaign.city,
          district: result.district || campaign.district,
          industry: result.industry || campaign.industry,
          business_type: result.business_type || campaign.business_type,
          source: result.source,
          source_url: result.source_url,
          google_maps_url: result.google_maps_url,
          instagram: result.instagram,
          rating: result.rating,
          review_count: result.review_count,
          discovered_at: nowIso(),
          status: "new",
          notes: "",
        };
        appendDiscovered(row);
        discovered.push(row);
        perCampaign.found++;
        summary.discovered++;
      }

      log.success(`'${campaign.name}' — ${perCampaign.found} yeni işletme eklendi.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      perCampaign.note = perCampaign.note || `Hata: ${msg}`;
      log.error(`Kampanya '${campaign.name}' çalışırken hata: ${msg}`);
    }

    // Record the run time even when the adapter needed setup or errored.
    campaign.last_run_at = nowIso();
    summary.perCampaign.push(perCampaign);
  }

  try {
    saveCampaigns(allCampaigns);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log.warn(`Kampanya güncellemesi kaydedilemedi: ${msg}`);
  }

  log.info(
    `Toplam: ${summary.discovered} yeni · ${summary.duplicatesSkipped} mükerrer atlandı · ${summary.campaignsRun} kampanya.`,
  );
  writeReport(summary);
  return summary;
}
