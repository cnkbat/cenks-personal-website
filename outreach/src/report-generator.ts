/**
 * Report generator. Produces /outreach/generated/reports/daily-report-<date>.md
 * from the current state of leads.csv + the logs. Pure read — never sends.
 */
import fs from "node:fs";
import path from "node:path";
import type { Lead, OutreachConfig } from "./types";
import { getGmailEnv, hasGmailCreds, PATHS } from "./config";
import { loadLeads } from "./lead-importer";
import { loadBlocked, loadFollowups, loadReplies, loadSent } from "./store";
import { CATEGORY_LABEL, classifyCategory } from "./knowledge";
import { dateStamp, isDueOrPast } from "./time";

function countBy<T>(items: T[], key: (t: T) => string): Map<string, number> {
  const m = new Map<string, number>();
  for (const it of items) {
    const k = key(it);
    if (!k) continue;
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return m;
}

function topEntries(m: Map<string, number>, n: number): [string, number][] {
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

/** Read offer names from approved email JSONs (for offer distribution). */
function approvedOffers(): string[] {
  if (!fs.existsSync(PATHS.generated.emails)) return [];
  const out: string[] = [];
  for (const f of fs.readdirSync(PATHS.generated.emails)) {
    if (!f.endsWith(".json")) continue;
    try {
      const a = JSON.parse(fs.readFileSync(path.join(PATHS.generated.emails, f), "utf8")) as {
        offer_name?: string;
      };
      if (a.offer_name) out.push(a.offer_name);
    } catch {
      /* ignore */
    }
  }
  return out;
}

/** Build the list of "manual actions needed" from current state + config. */
function manualActions(config: OutreachConfig, leads: Lead[]): string[] {
  const actions: string[] = [];
  if (config.dryRun)
    actions.push("DRY-RUN açık — hiçbir e-posta gönderilmiyor. Test bittiğinde outreach-config.json → `dryRun: false`.");
  if (!hasGmailCreds(getGmailEnv()))
    actions.push("Gmail kimlik bilgileri eksik — MANUAL_SETUP.md adımlarını tamamlayın (`npm run outreach:setup-check`).");

  const personalSkips = leads.filter((l) => l.notes.toLowerCase().includes("kişisel e-posta")).length;
  if (personalSkips > 0)
    actions.push(`${personalSkips} lead kişisel e-posta nedeniyle atlandı — kurumsal e-posta adresi bulmayı deneyin.`);

  const blocked = leads.filter((l) => l.status === "blocked").length;
  if (blocked > 0) actions.push(`${blocked} lead spam kontrolünde engellendi — blocked-leads.csv'yi inceleyin.`);

  const pending = leads.filter((l) => l.status === "pending" || l.status === "").length;
  if (pending === 0) actions.push("Bekleyen lead kalmadı — leads.csv'ye 10–20 yeni lead ekleyin.");

  const replies = loadReplies().length;
  if (replies > 0) actions.push(`${replies} yanıt kaydı var — replies.csv'yi inceleyip sıcak leadleri işaretleyin.`);

  if (actions.length === 0) actions.push("Bekleyen manuel işlem yok. 👍");
  return actions;
}

/** Generate and write the report. Returns the file path. */
export function generateReport(config: OutreachConfig): string {
  const leads = loadLeads();
  const sent = loadSent();
  const followups = loadFollowups();
  const blocked = loadBlocked();
  const today = dateStamp();

  const byStatus = countBy(leads, (l) => l.status || "pending");
  const sentToday = sent.filter((r) => r.sent_at.startsWith(today) && r.status === "ok");
  const followupsToday = followups.filter((r) => r.sent_at.startsWith(today) && r.status === "ok");

  const offerDist = countBy(approvedOffers(), (o) => o);
  const contactedCategories = countBy(
    leads.filter((l) => ["sent", "ready", "followup_1_sent", "followup_2_sent"].includes(l.status)),
    (l) => CATEGORY_LABEL[classifyCategory(l.industry, l.business_type)],
  );

  const upcoming = leads
    .filter((l) => l.next_followup_at && ["sent", "followup_1_sent"].includes(l.status))
    .sort((a, b) => a.next_followup_at.localeCompare(b.next_followup_at));

  const dueNow = upcoming.filter((l) => isDueOrPast(l.next_followup_at));

  const lines: string[] = [];
  lines.push(`# Vesper Outreach OS — Günlük Rapor (${today})`);
  lines.push("");
  lines.push(`Mod: **${config.dryRun ? "DRY-RUN (gönderim yok)" : config.autoSendEnabled ? "GÖNDERİM" : "TASLAK"}** · Marka: ${config.brandName}`);
  lines.push("");

  lines.push("## Özet");
  lines.push(`- Toplam lead: **${leads.length}**`);
  lines.push(`- Bugün gönderilen (cold): **${sentToday.length}** · Bugün takip: **${followupsToday.length}**`);
  lines.push(`- Toplam gönderim kaydı: ${sent.filter((r) => r.status === "ok").length}`);
  lines.push("");

  lines.push("## Lead durum dağılımı");
  for (const [status, count] of topEntries(byStatus, 20)) lines.push(`- ${status}: ${count}`);
  lines.push("");

  lines.push("## Bu çalışmadaki sonuçlar");
  lines.push(`- Hazır (ready): ${byStatus.get("ready") ?? 0}`);
  lines.push(`- Gönderildi (sent): ${byStatus.get("sent") ?? 0}`);
  lines.push(`- Atlandı (skipped): ${byStatus.get("skipped") ?? 0}`);
  lines.push(`- Kalite/eksik nedeniyle atlanan: ${leads.filter((l) => l.notes.toLowerCase().includes("kalite")).length}`);
  lines.push(`- Engellenen (blocked): ${byStatus.get("blocked") ?? 0} (blocked-leads.csv: ${blocked.length})`);
  lines.push("");

  lines.push("## Takipler");
  lines.push(`- Zamanı gelen takip: **${dueNow.length}**`);
  lines.push(`- Planlanan sonraki takipler: ${upcoming.length}`);
  for (const l of upcoming.slice(0, 10))
    lines.push(`  - ${l.next_followup_at.slice(0, 10)} · ${l.business_name} (${l.status})`);
  lines.push("");

  lines.push("## Teklif dağılımı");
  if (offerDist.size === 0) lines.push("- (Henüz üretilmiş e-posta yok)");
  for (const [offer, count] of topEntries(offerDist, 10)) lines.push(`- ${offer}: ${count}`);
  lines.push("");

  lines.push("## En çok önerilen sektörler");
  if (contactedCategories.size === 0) lines.push("- (Henüz iletişime geçilen lead yok)");
  for (const [cat, count] of topEntries(contactedCategories, 8)) lines.push(`- ${cat}: ${count}`);
  lines.push("");

  lines.push("## Yapılması gereken manuel işlemler");
  for (const a of manualActions(config, leads)) lines.push(`- ${a}`);
  lines.push("");

  fs.mkdirSync(PATHS.generated.reports, { recursive: true });
  const file = path.join(PATHS.generated.reports, `daily-report-${today}.md`);
  fs.writeFileSync(file, lines.join("\n") + "\n", "utf8");
  return file;
}
