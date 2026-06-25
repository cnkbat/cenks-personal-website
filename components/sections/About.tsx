"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/reveal";

export function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="section-pad relative px-4">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Reveal>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium tracking-wide text-[var(--muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_2px_rgba(124,92,255,0.7)]" />
              {t.about.subtitle}
            </span>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {t.about.title}
            </h2>
          </Reveal>

          <div className="mt-6 space-y-4">
            {t.about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p
                  className={
                    i === 0
                      ? "text-lg font-medium text-white"
                      : "text-base leading-relaxed text-[var(--muted)]"
                  }
                >
                  {p}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {t.about.highlights.map((h) => (
                <div
                  key={h.label}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                >
                  <div className="text-lg font-semibold text-white">
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

        {/* Portrait / monogram card */}
        <Reveal delay={0.1}>
          <div className="relative mx-auto max-w-sm">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,rgba(124,92,255,0.35),transparent_60%)] blur-2xl"
            />
            <motion.div
              whileHover={{ rotate: -1, scale: 1.01 }}
              transition={{ duration: 0.4 }}
              className="glass relative aspect-[4/5] overflow-hidden rounded-[1.75rem] p-1"
            >
              <div className="flex h-full w-full flex-col items-center justify-center rounded-[1.5rem] bg-[linear-gradient(160deg,#0d1020,#111425)]">
                <div className="absolute inset-0 grid-bg opacity-40" />
                <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#7c5cff,#22d3ee)] text-4xl font-bold text-white shadow-[0_20px_60px_-15px_rgba(124,92,255,0.8)]">
                  CB
                </div>
                <div className="relative mt-6 text-center">
                  <div className="text-lg font-semibold text-white">
                    Cenk Emir Bat
                  </div>
                  <div className="mt-1 text-sm text-[var(--muted)]">
                    Web • CRM • Digital Growth
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
