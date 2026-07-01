/**
 * Vesper Outreach OS — CLI entry point.
 *
 * Commands (wired to package.json scripts):
 *   setup-check  validate  generate  send  start  followups  report
 *
 * Run: `npx tsx outreach/src/cli.ts <command>` or via the npm scripts.
 */
import fs from "node:fs";
import { getGmailEnv, getHunterEnv, hasGmailCreds, loadConfig, loadEnv, PATHS } from "./config";
import { log } from "./logger";
import { ensureLeadsFile, loadLeads } from "./lead-importer";
import { ensureHunterDataFiles, ensureLogFiles } from "./store";
import { validateLead } from "./lead-validator";
import { runGenerate, runSend, runStart, RunSummary } from "./sender";
import { runFollowups } from "./followup-engine";
import { generateReport } from "./report-generator";
import { runHunt } from "./hunter/hunter";
import { runEnrichment } from "./enrichment/enrichment";
import { runDedupe } from "./dedupe/dedupe";
import { runInbox } from "./inbox/inbox";
import { runOptout } from "./compliance/optout";
import { runReputation } from "./reputation/reputation";
import { runCampaign } from "./campaigns/campaigns";
import { runAutopilot } from "./autopilot";

const BANNER = "✦ Vesper Outreach OS";

function printRunSummary(s: RunSummary): void {
  log.blank();
  log.section("Özet");
  console.log(
    [
      `mod: ${s.mode}`,
      `üretildi: ${s.generated}`,
      `hazır: ${s.ready}`,
      `gönderildi: ${s.sent}`,
      `atlandı: ${s.skipped}`,
      `kalite-fail: ${s.qualityFailed}`,
      `spam-blok: ${s.spamBlocked}`,
      `hata: ${s.sendErrors}`,
    ].join(" · "),
  );
  if (s.limitReached) log.warn("Günlük/saatlik limit doldu — kalanı sonraki çalışmaya bırakıldı.");
  for (const n of s.notes) log.warn(n);
}

function cmdSetupCheck(): void {
  log.section("Kurulum kontrolü");
  const problems: string[] = [];

  // Config
  let dryRun = true;
  let autoSend = true;
  try {
    const config = loadConfig();
    dryRun = config.dryRun;
    autoSend = config.autoSendEnabled;
    log.success(`Config okundu · dryRun=${config.dryRun} · autoSend=${config.autoSendEnabled} · günlük=${config.dailySendLimit} · saatlik=${config.hourlySendLimit}`);
    log.info(`Marka: ${config.brandName} · Portföy: ${config.portfolioUrl} · Görüşme: ${config.meetingUrl}`);
  } catch (err) {
    problems.push(`Config hatası: ${(err as Error).message}`);
    log.error(`Config hatası: ${(err as Error).message}`);
  }

  // Data files
  for (const [name, file] of Object.entries({
    "leads.csv": PATHS.data.leads,
    "sent-log.csv": PATHS.data.sentLog,
    "followups.csv": PATHS.data.followups,
    "blocked-leads.csv": PATHS.data.blocked,
    "replies.csv": PATHS.data.replies,
  })) {
    if (fs.existsSync(file)) log.success(`Veri dosyası var: ${name}`);
    else {
      problems.push(`Eksik veri dosyası: ${name}`);
      log.error(`Eksik veri dosyası: ${name}`);
    }
  }

  // Leads
  try {
    const leads = loadLeads();
    const pending = leads.filter((l) => l.status === "pending" || l.status === "").length;
    log.info(`Toplam lead: ${leads.length} · bekleyen: ${pending}`);
    if (leads.length === 0) problems.push("leads.csv boş — en az birkaç lead ekleyin.");
  } catch (err) {
    problems.push(`leads.csv okunamadı: ${(err as Error).message}`);
  }

  // Gmail env
  loadEnv();
  const env = getGmailEnv();
  const envVars = {
    GMAIL_CLIENT_ID: env.clientId,
    GMAIL_CLIENT_SECRET: env.clientSecret,
    GMAIL_REFRESH_TOKEN: env.refreshToken,
    GMAIL_SENDER_EMAIL: env.senderEmail,
  };
  for (const [k, v] of Object.entries(envVars)) {
    if (v) log.success(`Env var set: ${k}`);
    else log.warn(`Env var eksik: ${k}`);
  }

  const gmailReady = hasGmailCreds(env);
  log.blank();
  if (gmailReady) log.success("Gmail kimlik bilgileri tam.");
  else log.warn("Gmail kimlik bilgileri eksik — gerçek gönderim için MANUAL_SETUP.md'yi izleyin.");

  // Lead Hunter sources (all optional — manual import always works)
  log.blank();
  try {
    const config = loadConfig();
    const hEnv = getHunterEnv(config);
    const src = config.hunterSources;
    log.info(`Lead Hunter: ${config.leadHunterEnabled ? "açık" : "kapalı"} · manuel içe aktarma: ${src.manualImport ? "açık" : "kapalı"} (API gerektirmez)`);
    const gcs = src.googleCustomSearch && hEnv.googleCustomSearchKey && hEnv.googleCustomSearchCx;
    const places = src.googlePlaces && hEnv.googlePlacesKey;
    if (gcs) log.success("Google Custom Search: yapılandırıldı");
    else log.info("Google Custom Search: kapalı (opsiyonel — GOOGLE_CUSTOM_SEARCH_API_KEY + _CX)");
    if (places) log.success("Google Places: yapılandırıldı");
    else log.info("Google Places (Maps): placeholder (opsiyonel — GOOGLE_PLACES_API_KEY)");
  } catch {
    /* config already reported above */
  }

  log.blank();
  log.section("Sonuç");
  if (!gmailReady && !dryRun) {
    log.error("dryRun=false ama Gmail bilgileri eksik. Gönderim çalışmaz. dryRun=true bırakın veya kimlik bilgilerini ekleyin.");
  }
  if (dryRun) log.info("DRY-RUN açık: güvenli. Gerçek gönderim için config'de dryRun=false yapın (kurulumdan sonra).");
  if (autoSend) log.info("autoSendEnabled=true: kimlik bilgileri hazır ve dryRun=false olduğunda e-postalar otomatik gönderilir.");

  if (problems.length === 0) log.success("Kritik eksik yok. `npm run outreach:validate` ile devam edebilirsiniz.");
  else {
    log.blank();
    log.error("Tamamlanması gerekenler:");
    for (const p of problems) console.log(`   - ${p}`);
  }
}

function cmdValidate(): void {
  log.section("Lead doğrulama (gönderim yok)");
  const leads = loadLeads();
  let ok = 0;
  for (const lead of leads) {
    const v = validateLead(lead);
    if (v.sendable) {
      ok++;
      log.success(`${lead.lead_id} ${lead.business_name}: gönderilebilir`);
    } else {
      log.warn(`${lead.lead_id} ${lead.business_name || "(isimsiz)"}: ${v.reasons.join("; ")}`);
    }
  }
  log.blank();
  log.info(`Gönderilebilir: ${ok}/${leads.length}`);
}

async function main(): Promise<void> {
  const command = (process.argv[2] ?? "help").toLowerCase();
  console.log(`\n${BANNER} — komut: ${command}\n`);
  loadEnv();
  // Self-heal: make sure data files exist (fresh clone has them gitignored).
  ensureLeadsFile();
  ensureLogFiles();
  ensureHunterDataFiles();
  const arg = process.argv[3] ?? "";

  switch (command) {
    case "setup-check":
      cmdSetupCheck();
      break;
    case "validate":
      cmdValidate();
      break;
    case "generate": {
      const config = loadConfig();
      printRunSummary(runGenerate(config));
      log.info("Üretilen e-postalar: outreach/generated/emails/*.md (onaylılar) ve *.failed.md (kalitesiz).");
      break;
    }
    case "send": {
      const config = loadConfig();
      printRunSummary(await runSend(config));
      break;
    }
    case "start": {
      const config = loadConfig();
      printRunSummary(await runStart(config));
      break;
    }
    case "followups": {
      const config = loadConfig();
      const s = await runFollowups(config);
      log.blank();
      log.info(`Takip özeti — mod: ${s.mode} · zamanı gelen: ${s.due} · gönderildi: ${s.sent} · atlandı: ${s.skipped} · hata: ${s.errors}`);
      break;
    }
    case "report": {
      const config = loadConfig();
      const file = generateReport(config);
      log.success(`Rapor oluşturuldu: ${file}`);
      break;
    }
    case "hunt": {
      const config = loadConfig();
      const s = await runHunt(config, arg ? { campaignId: arg } : undefined);
      log.blank();
      log.info(`Avlama özeti — kampanya: ${s.campaignsRun} · keşfedilen: ${s.discovered} · mükerrer atlanan: ${s.duplicatesSkipped}`);
      for (const c of s.perCampaign) log.info(`  ${c.name}: ${c.found} bulundu${c.needsSetup ? " · KURULUM: " + c.note : ""}`);
      if (s.needsSetup.length) for (const n of s.needsSetup) log.warn(n);
      break;
    }
    case "enrich": {
      const config = loadConfig();
      const s = await runEnrichment(config);
      log.blank();
      log.info(`Zenginleştirme — işlenen: ${s.processed} · e-posta: ${s.emailsFound} · e-posta yok: ${s.noEmail} · taşınan: ${s.promoted} · mükerrer: ${s.duplicates} · DNC: ${s.doNotContact} · site okuma: ${s.fetchesUsed}`);
      break;
    }
    case "dedupe": {
      const config = loadConfig();
      const s = runDedupe(config);
      log.blank();
      log.info(`Tekilleştirme — taranan: ${s.scanned} · mükerrer: ${s.duplicatesFound} · işaretlenen: ${s.discoveredMarked}`);
      break;
    }
    case "inbox": {
      const config = loadConfig();
      const s = await runInbox(config);
      log.blank();
      log.info(`Gelen kutusu — Gmail: ${s.gmailConfigured ? "bağlı" : "bağlı değil"} · taranan: ${s.scanned} · ilgilenen: ${s.interested} · opt-out: ${s.optOut} · bounce: ${s.bounced} · durdurulan: ${s.stopped}`);
      if (s.note) log.warn(s.note);
      break;
    }
    case "optout": {
      const config = loadConfig();
      const s = runOptout(config);
      log.blank();
      log.info(`Opt-out — sinyal: ${s.optOutSignals} · DNC eklenen: ${s.added} · durdurulan lead: ${s.leadsStopped}`);
      break;
    }
    case "reputation": {
      const config = loadConfig();
      const s = runReputation(config);
      log.blank();
      log.info(`İtibar — durum: ${s.paused ? "DURAKLATILDI" : "sağlıklı"} · bounce %${(s.bounceRate * 100).toFixed(1)} · opt-out %${(s.optOutRate * 100).toFixed(1)} · gmail-hata: ${s.gmailErrors}`);
      if (s.paused) for (const r of s.reasons) log.warn(r);
      break;
    }
    case "campaign": {
      const config = loadConfig();
      const s = runCampaign(config, arg ? { campaignId: arg } : undefined);
      log.blank();
      for (const c of s.campaigns) {
        log.info(`${c.name} [${c.status}] — keşif ${c.discovered} · zeng. ${c.enriched} · gönderilebilir ${c.sendable} · gönderilen ${c.sent} · yanıt ${c.replies} · ilgilenen ${c.interested}`);
        for (const a of c.nextActions) log.info(`    → ${a}`);
      }
      break;
    }
    case "autopilot": {
      const config = loadConfig();
      const s = await runAutopilot(config);
      log.blank();
      log.section("Autopilot özeti");
      for (const st of s.steps) console.log(`  ${st.status === "done" ? "✓" : st.status === "error" ? "✗" : "•"} ${st.step}: ${st.detail}`);
      log.blank();
      log.section("Güvenlik");
      for (const line of s.safety) log.info(line);
      break;
    }
    case "help":
    default:
      console.log(
        [
          "Kullanım: npm run outreach:<komut>",
          "",
          "  setup-check   Kimlik/ortam/dosya kontrolü + eksik kurulum listesi",
          "  validate      Leadleri doğrula (gönderim yok)",
          "  generate      E-postaları üret + AI kalite/spam kontrolü (gönderim yok)",
          "  send          Onaylanmış hazır e-postaları gönder (limitlere uyar)",
          "  start         Tam hat: üret → kalite → gönder",
          "  followups     Zamanı gelen takipleri gönder",
          "  report        Günlük raporu oluştur",
          "  -- Lead Hunter OS --",
          "  hunt [id]     Kampanyalardan lead keşfet (kaynak adaptörleri)",
          "  enrich        Keşfedilen leadleri zenginleştir + nitelikli olanları leads.csv'ye taşı",
          "  dedupe        Mükerrer leadleri işaretle",
          "  inbox         Yanıtları tara + sınıflandır (Gmail varsa)",
          "  optout        Opt-out/ilgilenmiyor yanıtlarını do-not-contact'e ekle",
          "  reputation    Gönderim itibarı/warmup kontrolü",
          "  campaign [id] Kampanya durumları + sonraki adımlar",
          "  autopilot     Tam otonom hat (tüm güvenlik kapıları aktif)",
          "",
          "Güvenlik: outreach-config.json içinde dryRun=true iken hiçbir e-posta gönderilmez.",
        ].join("\n"),
      );
      break;
  }
}

main().catch((err) => {
  log.error(`Beklenmeyen hata: ${(err as Error).stack ?? err}`);
  process.exit(1);
});
