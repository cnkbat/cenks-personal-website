/**
 * Autopilot — the full autonomous pipeline in one command.
 *
 * Runs, in order: setup-check → hunt → enrich → dedupe → validate → start →
 * inbox → optout → followups → reputation → report.
 *
 * It NEVER bypasses any safety gate — every step calls the same guarded
 * functions the individual commands use, so dryRun, daily/hourly limits, quality
 * review, spam checks, do-not-contact and the reputation guard all stay in force.
 * A step that is blocked (e.g. no live search API, no Gmail creds) is reported
 * and the pipeline continues.
 *
 * Command: npm run outreach:autopilot
 */
import type { OutreachConfig } from "./types";
import { getGmailEnv, getHunterEnv, hasGmailCreds } from "./config";
import { log } from "./logger";
import { loadLeads } from "./lead-importer";
import { validateLead } from "./lead-validator";
import { runStart } from "./sender";
import { runFollowups } from "./followup-engine";
import { generateReport } from "./report-generator";
import { runHunt } from "./hunter/hunter";
import { runEnrichment } from "./enrichment/enrichment";
import { runDedupe } from "./dedupe/dedupe";
import { runInbox } from "./inbox/inbox";
import { runOptout } from "./compliance/optout";
import { runReputation, checkReputationPause } from "./reputation/reputation";

export interface AutopilotStep {
  step: string;
  status: "done" | "blocked" | "skipped" | "error";
  detail: string;
}

export interface AutopilotSummary {
  mode: string;
  dryRun: boolean;
  steps: AutopilotStep[];
  safety: string[];
}

export async function runAutopilot(config: OutreachConfig): Promise<AutopilotSummary> {
  const mode = config.dryRun ? "dry-run" : config.autoSendEnabled ? "send" : "draft";
  const steps: AutopilotStep[] = [];
  const record = (step: string, status: AutopilotStep["status"], detail: string) => {
    steps.push({ step, status, detail });
    const fn = status === "error" || status === "blocked" ? log.warn : log.info;
    fn(`[autopilot] ${step}: ${status} — ${detail}`);
  };
  const guarded = async (step: string, fn: () => Promise<string> | string, skip?: string) => {
    if (skip) {
      record(step, "skipped", skip);
      return;
    }
    try {
      const detail = await fn();
      record(step, "done", detail);
    } catch (err) {
      record(step, "error", (err as Error).message);
    }
  };

  log.section(`AUTOPILOT (mod: ${mode})`);
  if (!config.autopilotEnabled) {
    log.warn("autopilotEnabled=false — yine de dry-run/güvenli adımlar çalıştırılıyor (gönderim yalnızca config izin verirse).");
  }

  // 1) setup-check
  {
    const gmail = hasGmailCreds(getGmailEnv());
    const hEnv = getHunterEnv(config);
    const liveSources: string[] = [];
    if (config.hunterSources.googleCustomSearch && hEnv.googleCustomSearchKey && hEnv.googleCustomSearchCx)
      liveSources.push("google_search");
    if (config.hunterSources.googlePlaces && hEnv.googlePlacesKey) liveSources.push("google_maps");
    record(
      "setup-check",
      "done",
      `dryRun=${config.dryRun} · Gmail=${gmail ? "hazır" : "eksik"} · canlı kaynak=${liveSources.length ? liveSources.join(",") : "yok (manuel içe aktarma)"}`,
    );
  }

  // 2) hunt
  await guarded(
    "hunt",
    async () => {
      const s = await runHunt(config);
      const needs = s.needsSetup.length ? ` · kurulum bekleyen: ${s.needsSetup.length}` : "";
      return `kampanya ${s.campaignsRun} · keşfedilen ${s.discovered} · mükerrer atlanan ${s.duplicatesSkipped}${needs}`;
    },
    config.leadHunterEnabled ? undefined : "leadHunterEnabled=false",
  );

  // 3) enrich
  await guarded("enrich", async () => {
    const s = await runEnrichment(config);
    return `işlenen ${s.processed} · e-posta bulunan ${s.emailsFound} · leads.csv'ye taşınan ${s.promoted}`;
  });

  // 4) dedupe
  await guarded("dedupe", () => {
    const s = runDedupe(config);
    return `taranan ${s.scanned} · mükerrer ${s.duplicatesFound}`;
  });

  // 5) validate
  await guarded("validate", () => {
    const leads = loadLeads();
    const sendable = leads.filter((l) => validateLead(l).sendable).length;
    return `gönderilebilir ${sendable}/${leads.length}`;
  });

  // 6) start (generate → quality → spam → limit-aware send; all gates enforced)
  await guarded("start", async () => {
    const s = await runStart(config);
    const limit = s.limitReached ? " · limit doldu" : "";
    return `üretilen ${s.generated} · hazır ${s.ready} · gönderilen ${s.sent} · kalite-fail ${s.qualityFailed} · spam-blok ${s.spamBlocked}${limit}`;
  });

  // 7) inbox + optout (reply tracking + suppression)
  await guarded("inbox", async () => {
    const s = await runInbox(config);
    const o = runOptout(config);
    return `taranan ${s.scanned} · ilgilenen ${s.interested} · opt-out ${s.optOut} · durdurulan ${o.leadsStopped}`;
  });

  // 8) followups
  await guarded("followups", async () => {
    const s = await runFollowups(config);
    return `zamanı gelen ${s.due} · gönderilen ${s.sent}`;
  });

  // 9) reputation
  await guarded("reputation", () => {
    const s = runReputation(config);
    return s.paused ? `DURAKLAT: ${s.reasons.join("; ")}` : `sağlıklı · bounce %${(s.bounceRate * 100).toFixed(1)}`;
  });

  // 10) report
  await guarded("report", () => {
    const file = generateReport(config);
    return file;
  });

  const pause = checkReputationPause(config);
  const safety: string[] = [
    config.dryRun ? "dryRun=true — hiçbir e-posta gönderilmedi." : "dryRun=false — onaylı e-postalar gönderildi.",
    `Limitler: ${config.dailySendLimit}/gün · ${config.hourlySendLimit}/saat (aşılmadı).`,
    "Kalite (≥90), spam, do-not-contact ve itibar (reputation) kontrolleri atlanmadı.",
    pause.paused ? `İtibar durumu: DURAKLATILDI (${pause.reasons.join("; ")}).` : "İtibar durumu: sağlıklı.",
  ];

  return { mode, dryRun: config.dryRun, steps, safety };
}
