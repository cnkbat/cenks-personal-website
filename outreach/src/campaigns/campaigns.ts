/**
 * Campaign manager. Rolls up the state of each lead-search campaign across the
 * pipeline (discovered -> enriched -> sendable -> sent -> replies -> interested)
 * and computes a conversion rate plus the concrete next actions the operator
 * should take. Pure read + a Markdown report; never sends anything.
 *
 * Command: npm run outreach:campaign
 */
import fs from "node:fs";
import path from "node:path";
import type { OutreachConfig } from "../types";
import { PATHS } from "../config";
import {
  loadCampaigns,
  loadDiscovered,
  loadEnriched,
  loadReplyClassifications,
  loadSent,
} from "../store";
import { loadLeads } from "../lead-importer";
import { normalizeEmail } from "../dedupe/dedupe";
import { dateStamp } from "../time";
import { log } from "../logger";

/** Per-campaign rollup of pipeline counts + suggested next actions. */
export interface CampaignStat {
  campaign_id: string;
  name: string;
  status: string;
  discovered: number;
  enriched: number;
  sendable: number;
  sent: number;
  replies: number;
  interested: number;
  conversionRate: number;
  nextActions: string[];
}

/** Output of a campaign-manager run. */
export interface CampaignManagerSummary {
  campaigns: CampaignStat[];
}

/** Build a Turkish next-actions checklist from a campaign's current state. */
function buildNextActions(
  config: OutreachConfig,
  status: string,
  discovered: number,
  enriched: number,
  sendable: number,
  replies: number,
): string[] {
  const actions: string[] = [];
  if (status !== "active") actions.push("Kampanyayı aktifleştir (status=active)");
  if (discovered === 0) actions.push("Kaynak ekleyip 'npm run outreach:hunt' çalıştır");
  if (enriched < discovered) actions.push("'npm run outreach:enrich' çalıştır");
  if (sendable > 0 && config.dryRun) actions.push("Test bitince dryRun=false yapıp gönder");
  if (sendable > 0 && !config.dryRun) actions.push("'npm run outreach:start' ile gönder");
  if (replies > 0) actions.push("'npm run outreach:inbox' ile yanıtları sınıflandır");
  return actions;
}

/** Escape a value for safe inclusion in a Markdown table cell. */
function cell(value: string): string {
  return value.replace(/\|/g, "\\|");
}

/** Write the Turkish campaign report and return its path. */
function writeReport(stats: CampaignStat[], stamp: string): string {
  const lines: string[] = [];
  lines.push(`# Vesper Outreach OS — Kampanya Raporu (${stamp})`);
  lines.push("");
  lines.push(`Toplam kampanya: **${stats.length}**`);
  lines.push("");
  lines.push("## Kampanya durumları");
  lines.push("");
  lines.push(
    "| Kampanya | Durum | Bulunan | Zenginleştirilen | Gönderilebilir | Gönderilen | Yanıt | İlgilenen | Dönüşüm |",
  );
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  if (stats.length === 0) {
    lines.push("| (Kampanya yok) | - | 0 | 0 | 0 | 0 | 0 | 0 | %0 |");
  }
  for (const s of stats) {
    const pct = `%${(s.conversionRate * 100).toFixed(1)}`;
    lines.push(
      `| ${cell(s.name || s.campaign_id)} | ${cell(s.status || "-")} | ${s.discovered} | ${s.enriched} | ${s.sendable} | ${s.sent} | ${s.replies} | ${s.interested} | ${pct} |`,
    );
  }
  lines.push("");

  lines.push("## Önerilen sonraki adımlar");
  lines.push("");
  for (const s of stats) {
    lines.push(`### ${s.name || s.campaign_id}`);
    if (s.nextActions.length === 0) {
      lines.push("- Bekleyen işlem yok.");
    } else {
      for (const a of s.nextActions) lines.push(`- ${a}`);
    }
    lines.push("");
  }

  fs.mkdirSync(PATHS.generated.campaigns, { recursive: true });
  const file = path.join(PATHS.generated.campaigns, `campaigns-${stamp}.md`);
  fs.writeFileSync(file, lines.join("\n") + "\n", "utf8");
  return file;
}

/**
 * Roll up every campaign (or just `opts.campaignId`) and write a report. Reads
 * discovered/enriched/leads/sent/reply-classification stores; sends nothing.
 */
export function runCampaign(
  config: OutreachConfig,
  opts?: { campaignId?: string },
): CampaignManagerSummary {
  log.section("Kampanya yöneticisi");

  const campaigns = loadCampaigns();
  const discoveredRows = loadDiscovered();
  const enriched = loadEnriched();
  const sentRows = loadSent();
  const classifications = loadReplyClassifications();
  // loadLeads is part of the documented contract; kept for state parity even
  // though the rollup keys off enriched-lead emails.
  void loadLeads();

  const selected = opts?.campaignId
    ? campaigns.filter((c) => c.campaign_id === opts.campaignId)
    : campaigns;

  const okSends = sentRows.filter((r) => r.status === "ok");

  const stats: CampaignStat[] = [];
  for (const c of selected) {
    const discovered = discoveredRows.filter((d) => d.campaign_id === c.campaign_id).length;
    const enrichedRows = enriched.filter((e) => e.campaign_id === c.campaign_id);
    const enrichedCount = enrichedRows.length;
    const sendable = enrichedRows.filter((e) => e.status === "promoted").length;

    const campaignEmails = new Set<string>();
    for (const e of enrichedRows) {
      if (e.email) campaignEmails.add(normalizeEmail(e.email));
    }

    const sent = okSends.filter(
      (r) => r.email && campaignEmails.has(normalizeEmail(r.email)),
    ).length;

    const campaignReplies = classifications.filter(
      (r) => r.email && campaignEmails.has(normalizeEmail(r.email)),
    );
    const replies = campaignReplies.length;
    const interested = campaignReplies.filter((r) => r.classification === "interested").length;

    const conversionRate = sent ? interested / sent : 0;

    const nextActions = buildNextActions(
      config,
      c.status,
      discovered,
      enrichedCount,
      sendable,
      replies,
    );

    stats.push({
      campaign_id: c.campaign_id,
      name: c.name,
      status: c.status,
      discovered,
      enriched: enrichedCount,
      sendable,
      sent,
      replies,
      interested,
      conversionRate,
      nextActions,
    });
  }

  const file = writeReport(stats, dateStamp());

  const totalDiscovered = stats.reduce((n, s) => n + s.discovered, 0);
  const totalSendable = stats.reduce((n, s) => n + s.sendable, 0);
  const totalInterested = stats.reduce((n, s) => n + s.interested, 0);
  log.info(
    `Kampanya: ${stats.length} · bulunan: ${totalDiscovered} · gönderilebilir: ${totalSendable} · ilgilenen: ${totalInterested}`,
  );
  log.success(`Rapor yazıldı: ${file}`);

  return { campaigns: stats };
}
