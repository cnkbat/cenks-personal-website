"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/ui/background";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { HeroShowcase } from "@/components/sections/HeroShowcase";
import { siteConfig } from "@/lib/i18n/dictionaries";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-4 pt-32 pb-20 lg:pt-28"
    >
      <Particles count={22} />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        {/* Left — copy */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium tracking-wide text-white/80 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent-2)]" />
              {t.hero.badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="mt-6 text-balance text-[2.6rem] font-semibold leading-[1.06] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.75rem] lg:leading-[1.04]"
          >
            <span className="gradient-text">{t.hero.title}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease }}
            className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-[var(--muted)] sm:text-lg lg:mx-0"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28, ease }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
          >
            <a href="#demos" className="w-full sm:w-auto">
              <Button variant="gradient" size="lg" className="group w-full">
                {t.hero.primary}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
            <a
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button variant="glass" size="lg" className="w-full">
                {t.hero.secondary}
              </Button>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-3 lg:mx-0"
          >
            {t.hero.stats.map((s, i) => (
              <div
                key={i}
                className="glass-card group rounded-2xl px-3 py-4 text-center transition-transform duration-300 hover:-translate-y-1"
              >
                <AnimatedNumber
                  value={s.value}
                  className="bg-gradient-to-b from-white to-white/55 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl"
                />
                <div className="mt-1.5 text-[11px] leading-tight text-[var(--muted)]">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — product showcase */}
        <div className="hidden lg:block">
          <HeroShowcase />
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-9 w-5.5 items-start justify-center rounded-full border border-white/15 p-1.5">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-white/60"
          />
        </div>
      </motion.div>
    </section>
  );
}
