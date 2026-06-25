"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Gem,
  Lock,
  MessageCircle,
  Smartphone,
  Sparkles,
  TrendingUp,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Mockup } from "@/components/sections/Mockups";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;
const benefitIcons: LucideIcon[] = [Gem, TrendingUp, Workflow, Smartphone];

export function DemoDetail({ slug }: { slug: string }) {
  const { t } = useLanguage();
  const demo = t.demos.items.find((d) => d.slug === slug);

  if (!demo) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-24">
        <div className="text-center">
          <p className="text-[var(--muted)]">404</p>
          <Link
            href="/"
            className="mt-3 inline-flex items-center gap-2 text-white hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.demoPages.backHome}
          </Link>
        </div>
      </div>
    );
  }

  const ready = demo.status === "ready";

  return (
    <div className="relative px-4 pt-28 pb-32">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <Link
            href="/#demos"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.demoPages.backHome}
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease }}
          className="mt-8 max-w-3xl"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-widest text-[var(--accent-2)]">
              {demo.type}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                ready
                  ? "border border-[#25D366]/30 bg-[#25D366]/15 text-[#4ade80]"
                  : "border border-white/15 bg-white/10 text-white/70",
              )}
            >
              {ready ? (
                <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
              ) : (
                <Lock className="h-2.5 w-2.5" />
              )}
              {ready ? t.demos.ready : t.demos.soon}
            </span>
          </div>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl sm:leading-[1.05]">
            {demo.name}
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-[var(--muted)]">
            {demo.solution}
          </p>
        </motion.div>

        {/* Large product preview placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease }}
          className="relative mt-12"
        >
          <div
            aria-hidden
            className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(ellipse_60%_60%_at_50%_30%,rgba(124,92,255,0.3),transparent_70%)] blur-2xl"
          />
          <div className="glass-card shadow-premium relative overflow-hidden rounded-[2rem] p-5 sm:p-10">
            <div aria-hidden className="absolute inset-0 grid-bg-dots opacity-40" />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-[var(--accent-2)]" />
              {t.demoPages.previewLabel}
            </span>
            <div className="relative mx-auto max-w-2xl py-2">
              <Mockup slug={demo.slug} className="rounded-2xl" />
            </div>
          </div>
        </motion.div>

        {/* Problem + Solution */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease }}
            className="glass-card rounded-3xl p-7"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#ff5f57]/10 text-[#ff8a84]">
              <span className="text-lg leading-none">!</span>
            </div>
            <h2 className="mt-4 text-xs font-semibold uppercase tracking-wide text-white/40">
              {t.demos.problemLabel}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--muted)]">
              {demo.problem}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.08, ease }}
            className="glass-card ring-gradient rounded-3xl p-7"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[var(--accent)]/15 text-[var(--accent-2)]">
              <Check className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-xs font-semibold uppercase tracking-wide text-white/40">
              {t.demos.solutionLabel}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--muted)]">
              {demo.solution}
            </p>
          </motion.div>
        </div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="mt-5 glass-card rounded-3xl p-7"
        >
          <h2 className="text-xs font-semibold uppercase tracking-wide text-white/40">
            {t.demos.featuresLabel}
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {demo.features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-white/85"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[var(--accent-2)]">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Benefits */}
        <div className="mt-16">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease }}
            className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
          >
            {t.demoPages.benefitsTitle}
          </motion.h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.demoPages.benefits.map((b, i) => {
              const Icon = benefitIcons[i % benefitIcons.length];
              return (
                <motion.div
                  key={b}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease }}
                  className="card-glow glass-card group h-full rounded-3xl p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(124,92,255,0.22),rgba(34,211,238,0.12))] text-[var(--accent-2)] transition-transform duration-500 group-hover:-translate-y-1">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                  <p className="mt-4 text-[15px] font-medium leading-snug text-white/90">
                    {b}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
          className="relative mt-16 overflow-hidden rounded-[2rem] border border-white/10 px-6 py-12 text-center"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(130deg,rgba(124,92,255,0.2),rgba(34,211,238,0.08))]"
          />
          <div aria-hidden className="absolute inset-0 grid-bg opacity-50" />
          <div className="relative mx-auto max-w-xl">
            <Sparkles className="mx-auto h-7 w-7 text-[var(--accent-2)]" />
            <h3 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {ready ? demo.name : t.demoPages.comingSoon}
            </h3>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-[var(--muted)]">
              {t.demoPages.comingSoonDesc}
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="whatsapp" size="lg">
                  <MessageCircle className="h-5 w-5" />
                  {t.demoPages.contactCta}
                </Button>
              </a>
              <Link href="/#demos">
                <Button variant="glass" size="lg">
                  {t.demoPages.backHome}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sticky contact button */}
      <motion.a
        href={siteConfig.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease }}
        className="glass-strong fixed bottom-5 left-1/2 z-40 inline-flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_-15px_rgba(0,0,0,0.9)] transition-transform hover:-translate-x-1/2 hover:scale-[1.03]"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366]">
          <MessageCircle className="h-3 w-3 text-[#06210f]" />
        </span>
        {t.demoPages.stickyCta}
      </motion.a>
    </div>
  );
}
