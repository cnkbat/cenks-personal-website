/**
 * Scheduled runner for Vesper Outreach OS.
 *
 * This is a THIN wrapper around the existing pipeline — it does NOT touch or
 * bypass anything. Each tick simply calls `runStart()` (validate → analyze →
 * score → offer → generate → quality review → spam check → limit-aware send)
 * and then `generateReport()`. All safety gates (quality ≥ threshold, spam
 * block, lead score, opt-out, daily/hourly limits) live in the pipeline and
 * remain fully in force here.
 *
 * Two modes:
 *   - default : daemon loop, one run every `scheduler.intervalMinutes` (60).
 *   - "once"  : a single guarded run then exit — for Windows Task Scheduler /
 *               cron, which provides the hourly trigger itself.
 *
 * Hard stops (the runner refuses / halts):
 *   - scheduler.enabled = false
 *   - dryRun = true AND scheduler.allowDryRun = false
 *   - dryRun = false AND Gmail credentials are missing
 */
import fs from "node:fs";
import path from "node:path";
import type { OutreachConfig } from "./types";
import { getGmailEnv, hasGmailCreds, loadConfig, loadEnv, PATHS } from "./config";
import { log } from "./logger";
import { runStart } from "./sender";
import { generateReport } from "./report-generator";
import { ensureLeadsFile } from "./lead-importer";
import { ensureLogFiles, remainingSendAllowance } from "./store";
import { dateStamp, nowIso } from "./time";

/** Append a lifecycle line to generated/logs/scheduler.log (+ console). */
function schedulerLog(msg: string): void {
  fs.mkdirSync(PATHS.generated.logs, { recursive: true });
  try {
    fs.appendFileSync(path.join(PATHS.generated.logs, "scheduler.log"), `[${nowIso()}] ${msg}\n`, "utf8");
  } catch {
    /* never let logging crash the scheduler */
  }
  log.info(`[scheduler] ${msg}`);
}

interface Preflight {
  ok: boolean;
  reason?: string;
}

/** Decide whether the scheduler may run given the current config + creds. */
function preflight(config: OutreachConfig): Preflight {
  if (!config.scheduler.enabled) return { ok: false, reason: "scheduler.enabled = false" };
  if (config.dryRun && !config.scheduler.allowDryRun)
    return { ok: false, reason: "dryRun = true ve scheduler.allowDryRun = false" };
  if (!config.dryRun && !hasGmailCreds(getGmailEnv()))
    return { ok: false, reason: "Gmail kimlik bilgileri eksik (gerçek gönderim yapılamaz)" };
  return { ok: true };
}

function modeLabel(config: OutreachConfig): string {
  return config.dryRun ? "dry-run" : config.autoSendEnabled ? "send" : "draft";
}

/** One guarded pipeline run + report. Assumes preflight already passed. */
async function runOnce(config: OutreachConfig): Promise<void> {
  const allowance = remainingSendAllowance(config.dailySendLimit, config.hourlySendLimit);
  schedulerLog(
    `Çalışma başlıyor · mod: ${modeLabel(config)} · bu saat gönderim izni: ${allowance} ` +
      `(günlük ${config.dailySendLimit}, saatlik ${config.hourlySendLimit})`,
  );
  const summary = await runStart(config);
  const reportPath = generateReport(config);
  schedulerLog(
    `Çalışma bitti · gönderildi: ${summary.sent} · hazır: ${summary.ready} · atlandı: ${summary.skipped} ` +
      `· kalite-fail: ${summary.qualityFailed} · spam-blok: ${summary.spamBlocked} · rapor: ${path.basename(reportPath)}`,
  );
  if (summary.limitReached) schedulerLog("Limit doldu — kalan hazır e-postalar bir sonraki saate bırakıldı.");
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function main(): Promise<void> {
  loadEnv();
  ensureLeadsFile();
  ensureLogFiles();

  const runOnceMode = process.argv.slice(2).includes("once") || process.env.OUTREACH_SCHEDULER_ONCE === "1";
  console.log(`\n✦ Vesper Outreach OS — zamanlayıcı (${runOnceMode ? "tek sefer" : "sürekli"})\n`);

  let config = loadConfig();
  const pre = preflight(config);
  if (!pre.ok) {
    schedulerLog(`DURDURULDU: ${pre.reason}`);
    log.warn("Zamanlayıcı güvenlik nedeniyle çalışmadı. outreach-config.json / kimlik bilgilerini kontrol edin.");
    return;
  }

  // Single-shot mode (Task Scheduler / cron provides the hourly trigger).
  if (runOnceMode) {
    await runOnce(config);
    schedulerLog("Tek seferlik çalışma tamamlandı.");
    return;
  }

  // Daemon mode: loop, re-reading config each tick so edits (and a flip to
  // dryRun=false without creds) are picked up and can halt the loop safely.
  schedulerLog(
    `Zamanlayıcı başladı · her ${config.scheduler.intervalMinutes} dk · ` +
      `günlük maks ${config.scheduler.maxRunsPerDay} çalışma · mod: ${modeLabel(config)}`,
  );

  let running = true;
  const stop = (sig: string) => {
    schedulerLog(`${sig} alındı — zamanlayıcı durduruluyor.`);
    running = false;
    process.exit(0);
  };
  process.on("SIGINT", () => stop("SIGINT"));
  process.on("SIGTERM", () => stop("SIGTERM"));

  let day = dateStamp();
  let runsToday = 0;

  while (running) {
    config = loadConfig();
    const check = preflight(config);
    if (!check.ok) {
      schedulerLog(`DURDURULDU: ${check.reason}`);
      break;
    }

    const today = dateStamp();
    if (today !== day) {
      day = today;
      runsToday = 0;
      schedulerLog(`Yeni gün (${today}) — çalışma sayacı sıfırlandı.`);
    }

    if (runsToday >= config.scheduler.maxRunsPerDay) {
      schedulerLog(`Günlük maksimum çalışma (${config.scheduler.maxRunsPerDay}) doldu — sonraki güne kadar bekleniyor.`);
    } else {
      try {
        await runOnce(config);
        runsToday++;
      } catch (err) {
        schedulerLog(`Çalışma hatası (döngü devam ediyor): ${(err as Error).message}`);
      }
    }

    const waitMs = config.scheduler.intervalMinutes * 60 * 1000;
    schedulerLog(`Sonraki çalışma ~${config.scheduler.intervalMinutes} dk sonra.`);
    await sleep(waitMs);
  }
}

main().catch((err) => {
  log.error(`Zamanlayıcı beklenmeyen hata: ${(err as Error).stack ?? err}`);
  process.exit(1);
});
