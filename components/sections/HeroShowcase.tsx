"use client";

import { motion } from "framer-motion";
import { Bell, TrendingUp } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

const ease = [0.22, 1, 0.36, 1] as const;

function BrowserDashboard() {
  return (
    <img
      src="/assets/beauty-crm-preview.webp"
      alt=""
      width={1536}
      height={1024}
      decoding="async"
      className="shadow-premium block w-full rounded-2xl border border-white/10"
    />
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
        <div className="relative flex items-center justify-center pt-2.5">
          <div className="h-1 w-10 rounded-full bg-white/15" />
        </div>
        <div className="flex items-center justify-between px-3.5 pt-2.5">
          <div className="text-[12px] font-semibold text-white">{t.app}</div>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366]/20">
            <span className="h-2 w-2 rounded-full bg-[#25D366]" />
          </span>
        </div>
        <div className="px-3.5 pt-1 text-[9px] text-white/40">{t.today}</div>
        <div className="mt-2 flex-1 space-y-1.5 px-3">
          {t.items.map((it, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-2"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: ["#7c5cff", "#22d3ee", "#e879f9"][i] }}
                />
                <div className="text-[9px] font-medium text-white/80">{it}</div>
              </div>
              <div className="mt-1.5 h-1 w-3/4 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-around border-t border-white/10 px-4 py-2.5">
          <span className="h-1.5 w-5 rounded-full bg-[var(--accent)]" />
          <span className="h-1.5 w-5 rounded-full bg-white/15" />
          <span className="h-1.5 w-5 rounded-full bg-white/15" />
        </div>
      </div>
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
        <div className="text-2xl font-semibold tracking-tight text-white">+120</div>
        <div className="mb-1 rounded-full bg-[#4ade80]/15 px-1.5 py-0.5 text-[9px] font-semibold text-[#4ade80]">
          +24%
        </div>
      </div>
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
      <div
        aria-hidden
        className="glow-pulse absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle_at_60%_40%,rgba(124,92,255,0.35),transparent_60%)] blur-2xl"
      />

      <div className="relative aspect-[4/3.4] w-full">
        <div className="float-y absolute left-0 top-2 w-[78%]">
          <BrowserDashboard />
        </div>

        <div className="float-y-rev absolute -right-1 bottom-0 w-[30%] max-w-[150px]">
          <PhoneApp />
        </div>

        <div
          className="float-y absolute -right-2 top-0 w-[44%] max-w-[200px]"
          style={{ animationDelay: "-2s" }}
        >
          <AnalyticsCard />
        </div>

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
