"use client";

import { motion } from "framer-motion";
import { Bell, Calendar, TrendingUp, Users, Wallet } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Tiny monospace chip documenting the production asset that will replace a
 * placeholder, e.g. "beauty-crm-dashboard.webp · 1600×900".
 */
function AssetTag({ file, dim }: { file: string; dim: string }) {
  return (
    <span className="pointer-events-none absolute bottom-1.5 right-2 z-10 rounded-md bg-black/45 px-1.5 py-0.5 font-mono text-[8px] leading-none tracking-tight text-white/45 backdrop-blur-sm">
      {file} · {dim}
    </span>
  );
}

const bar = "rounded-full bg-white/10";

function BrowserDashboard() {
  const { locale } = useLanguage();
  const t =
    locale === "tr"
      ? {
          url: "beauty-crm.app",
          title: "Gösterge Paneli",
          stats: [
            { label: "Randevu", value: "48", icon: Calendar },
            { label: "Gelir", value: "₺62K", icon: Wallet },
            { label: "Müşteri", value: "312", icon: Users },
          ],
          list: ["Ayşe Y.", "Mert K.", "Elif D."],
        }
      : {
          url: "beauty-crm.app",
          title: "Dashboard",
          stats: [
            { label: "Bookings", value: "48", icon: Calendar },
            { label: "Revenue", value: "$4.2K", icon: Wallet },
            { label: "Clients", value: "312", icon: Users },
          ],
          list: ["Ayşe Y.", "Mert K.", "Elif D."],
        };

  return (
    <div className="glass-card shadow-premium relative overflow-hidden rounded-2xl">
      {/* top bar */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.02] px-3.5 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        <div className="ml-2 flex h-6 flex-1 items-center rounded-md border border-white/10 bg-white/[0.03] px-2.5 text-[10px] text-white/40">
          {t.url}
        </div>
      </div>

      <div className="flex">
        {/* sidebar */}
        <div className="hidden w-[68px] flex-col gap-2 border-r border-white/10 p-3 sm:flex">
          <div className="h-6 w-6 rounded-lg bg-[linear-gradient(135deg,#7c5cff,#22d3ee)]" />
          <div className="mt-2 h-2 w-9 rounded-full bg-white/20" />
          <div className={`h-2 w-8 ${bar}`} />
          <div className={`h-2 w-10 ${bar}`} />
          <div className={`h-2 w-7 ${bar}`} />
          <div className={`h-2 w-9 ${bar}`} />
        </div>

        {/* main */}
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-semibold text-white">
              {t.title}
            </div>
            <div className="h-6 w-16 rounded-full bg-[linear-gradient(110deg,#7c5cff,#22d3ee)]" />
          </div>

          {/* stat cards */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {t.stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-2"
                >
                  <Icon className="h-3.5 w-3.5 text-[var(--accent-2)]" />
                  <div className="mt-1.5 text-[13px] font-semibold text-white">
                    {s.value}
                  </div>
                  <div className="text-[9px] text-white/40">{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* chart */}
          <div className="mt-3 flex h-20 items-end gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
            {[40, 62, 48, 80, 55, 72, 90, 64].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-[linear-gradient(to_top,#7c5cff,#22d3ee)]"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>

          {/* list */}
          <div className="mt-3 space-y-1.5">
            {t.list.map((name, i) => (
              <div
                key={name}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1.5"
              >
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white"
                  style={{
                    background:
                      i === 0
                        ? "linear-gradient(135deg,#7c5cff,#a855f7)"
                        : i === 1
                          ? "linear-gradient(135deg,#22d3ee,#3b82f6)"
                          : "linear-gradient(135deg,#e879f9,#7c5cff)",
                  }}
                >
                  {name.charAt(0)}
                </span>
                <div className={`h-1.5 flex-1 ${bar}`} style={{ maxWidth: 90 }} />
                <span className="text-[9px] text-white/40">
                  {10 + i * 2}:30
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AssetTag file="beauty-crm-dashboard.webp" dim="1600×900" />
    </div>
  );
}

function PhoneApp() {
  const { locale } = useLanguage();
  const t =
    locale === "tr"
      ? { app: "CRM", today: "Bugün", items: ["09:30 Ayşe", "11:00 Mert", "14:30 Elif"] }
      : { app: "CRM", today: "Today", items: ["09:30 Ayşe", "11:00 Mert", "14:30 Elif"] };

  return (
    <div className="glass-card shadow-premium relative h-full w-full overflow-hidden rounded-[2rem] p-1.5">
      <div className="flex h-full flex-col rounded-[1.6rem] border border-white/10 bg-[linear-gradient(170deg,#0d1020,#0a0c18)]">
        {/* notch */}
        <div className="relative flex items-center justify-center pt-2.5">
          <div className="h-1 w-10 rounded-full bg-white/15" />
        </div>
        {/* header */}
        <div className="flex items-center justify-between px-3.5 pt-2.5">
          <div className="text-[12px] font-semibold text-white">{t.app}</div>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366]/20">
            <span className="h-2 w-2 rounded-full bg-[#25D366]" />
          </span>
        </div>
        <div className="px-3.5 pt-1 text-[9px] text-white/40">{t.today}</div>
        {/* list */}
        <div className="mt-2 flex-1 space-y-1.5 px-3">
          {t.items.map((it, i) => (
            <div
              key={it}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-2"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: ["#7c5cff", "#22d3ee", "#e879f9"][i],
                  }}
                />
                <div className="text-[9px] font-medium text-white/80">{it}</div>
              </div>
              <div className="mt-1.5 h-1 w-3/4 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
        {/* tab bar */}
        <div className="flex items-center justify-around border-t border-white/10 px-4 py-2.5">
          <span className="h-1.5 w-5 rounded-full bg-[var(--accent)]" />
          <span className="h-1.5 w-5 rounded-full bg-white/15" />
          <span className="h-1.5 w-5 rounded-full bg-white/15" />
        </div>
      </div>
      <AssetTag file="crm-mobile-app.webp" dim="800×1600" />
    </div>
  );
}

function AnalyticsCard() {
  const { locale } = useLanguage();
  const label = locale === "tr" ? "Tamamlanan Proje" : "Completed Projects";
  return (
    <div className="glass-card shadow-premium relative overflow-hidden rounded-2xl p-3.5">
      <div className="flex items-center gap-1.5 text-[10px] text-white/50">
        <TrendingUp className="h-3.5 w-3.5 text-[#4ade80]" />
        {label}
      </div>
      <div className="mt-1 flex items-end gap-2">
        <div className="text-2xl font-semibold tracking-tight text-white">
          +120
        </div>
        <div className="mb-1 rounded-full bg-[#4ade80]/15 px-1.5 py-0.5 text-[9px] font-semibold text-[#4ade80]">
          +24%
        </div>
      </div>
      {/* sparkline */}
      <svg viewBox="0 0 120 36" className="mt-1.5 h-9 w-full" fill="none">
        <defs>
          <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 30 L18 24 L36 26 L54 16 L72 18 L90 8 L120 4"
          stroke="#22d3ee"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0 30 L18 24 L36 26 L54 16 L72 18 L90 8 L120 4 L120 36 L0 36 Z"
          fill="url(#spark)"
        />
      </svg>
      <AssetTag file="analytics-floating-card.webp" dim="600×400" />
    </div>
  );
}

function NotificationCard() {
  const { locale } = useLanguage();
  const t =
    locale === "tr"
      ? { title: "Yeni Randevu", body: "Ayşe Y. • 14:30", now: "şimdi" }
      : { title: "New Appointment", body: "Ayşe Y. • 14:30", now: "now" };
  return (
    <div className="glass-card shadow-premium relative flex items-center gap-3 overflow-hidden rounded-2xl p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#7c5cff,#22d3ee)] text-white">
        <Bell className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold text-white">{t.title}</div>
          <div className="text-[9px] text-white/35">{t.now}</div>
        </div>
        <div className="text-[10px] text-white/50">{t.body}</div>
      </div>
      <AssetTag file="notification-widget.webp" dim="420×220" />
    </div>
  );
}

export function HeroShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.25, ease }}
      className="relative mx-auto w-full max-w-[520px] lg:max-w-none"
    >
      {/* ambient glow behind the composition */}
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle_at_60%_40%,rgba(124,92,255,0.35),transparent_60%)] blur-2xl glow-pulse"
      />

      {/* perspective wrapper */}
      <div className="relative aspect-[4/3.4] w-full">
        {/* Main dashboard */}
        <div className="float-y absolute left-0 top-2 w-[78%]">
          <BrowserDashboard />
        </div>

        {/* Phone, front-right */}
        <div className="float-y-rev absolute -right-1 bottom-0 w-[30%] max-w-[150px]">
          <PhoneApp />
        </div>

        {/* Analytics card, top-right */}
        <div
          className="float-y absolute -right-2 top-0 w-[44%] max-w-[200px]"
          style={{ animationDelay: "-2s" }}
        >
          <AnalyticsCard />
        </div>

        {/* Notification, bottom-left */}
        <div
          className="float-y-rev absolute -left-2 bottom-6 w-[56%] max-w-[230px]"
          style={{ animationDelay: "-3s" }}
        >
          <NotificationCard />
        </div>
      </div>
    </motion.div>
  );
}
