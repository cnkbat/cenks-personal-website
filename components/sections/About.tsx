"use client";

import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/reveal";

export function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="section-pad relative px-4">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <div>
          <Reveal>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium tracking-wide text-[var(--muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_2px_rgba(124,92,255,0.7)]" />
              {t.about.subtitle}
            </span>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
              {t.about.title}
            </h2>
          </Reveal>

          <div className="mt-7 space-y-5">
            {t.about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p
                  className={
                    i === 0
                      ? "text-xl font-medium text-white"
                      : "text-[15px] leading-relaxed text-[var(--muted)] sm:text-base"
                  }
                >
                  {p}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-9 grid grid-cols-3 gap-3">
              {t.about.highlights.map((h, i) => (
                <div
                  key={i}
                  className="glass-card rounded-2xl p-4 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="text-lg font-semibold tracking-tight text-white">
                    {h.value}
                  </div>
                  <div className="mt-1 text-xs leading-tight text-[var(--muted)]">
                    {h.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Premium profile card */}
        <Reveal delay={0.1}>
          <div className="relative mx-auto w-full max-w-sm">
            <div
              aria-hidden
              className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_35%_20%,rgba(124,92,255,0.4),transparent_60%)] blur-2xl glow-pulse"
            />
            <motion.div
              whileHover={{ y: -6, rotate: -0.6 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card shadow-premium relative aspect-[4/5] overflow-hidden rounded-[2rem]"
            >
              {/* Portrait placeholder */}
              <div className="absolute inset-0 bg-[linear-gradient(165deg,#11142a,#0a0c18)]" />
              <div className="absolute inset-0 grid-bg-dots opacity-50" />
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-2/3 bg-[radial-gradient(ellipse_70%_60%_at_50%_10%,rgba(124,92,255,0.3),transparent_70%)]"
              />

              {/* Monogram standing in for the portrait */}
              <div className="absolute inset-0 flex items-center justify-center pb-20">
                <div className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] bg-[linear-gradient(135deg,#7c5cff,#22d3ee)] text-5xl font-bold text-white shadow-[0_30px_70px_-15px_rgba(124,92,255,0.85)]">
                  CB
                </div>
              </div>

              {/* Top-left chip */}
              <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-md">
                <MapPin className="h-3 w-3 text-[var(--accent-2)]" />
                Finland
              </div>
              <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-[var(--accent-3)]" />
                MSc
              </div>

              {/* Asset caption */}
              <span className="pointer-events-none absolute bottom-[4.7rem] right-3 rounded-md bg-black/45 px-1.5 py-0.5 font-mono text-[8px] leading-none tracking-tight text-white/45 backdrop-blur-sm">
                cenk-profile.webp · 1000×1200
              </span>

              {/* Bottom name plate */}
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-xl">
                <div>
                  <div className="text-[15px] font-semibold text-white">
                    Cenk Emir Bat
                  </div>
                  <div className="text-xs text-[var(--muted)]">
                    Web • CRM • Digital Growth
                  </div>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-[#25D366]/15 px-2 py-1 text-[10px] font-medium text-[#4ade80]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80] shadow-[0_0_6px_1px_rgba(74,222,128,0.8)]" />
                  Online
                </span>
              </div>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
