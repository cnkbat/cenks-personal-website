"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Lock,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Mockup } from "@/components/sections/Mockups";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

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
    <div className="relative px-4 pt-28 pb-24">
      <div className="mx-auto max-w-4xl">
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

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease }}
          className="mt-6"
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
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {demo.name}
          </h1>
        </motion.div>

        {/* Enlarged mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease }}
          className="glow-ring relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[var(--color-surface)]/60 p-4 sm:p-8"
        >
          <div
            aria-hidden
            className="absolute inset-0 grid-bg opacity-40"
          />
          <div className="relative mx-auto max-w-md scale-[1.15] py-6 sm:scale-[1.4] sm:py-10">
            <Mockup slug={demo.slug} />
          </div>
        </motion.div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
          >
            <h2 className="text-xs font-semibold uppercase tracking-wide text-white/40">
              {t.demos.problemLabel}
            </h2>
            <p className="mt-2 text-[var(--muted)]">{demo.problem}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26, ease }}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
          >
            <h2 className="text-xs font-semibold uppercase tracking-wide text-white/40">
              {t.demos.solutionLabel}
            </h2>
            <p className="mt-2 text-[var(--muted)]">{demo.solution}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32, ease }}
          className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6"
        >
          <h2 className="text-xs font-semibold uppercase tracking-wide text-white/40">
            {t.demos.featuresLabel}
          </h2>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {demo.features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2.5 text-sm text-white/80"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[var(--accent-2)]">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38, ease }}
          className="relative mt-10 overflow-hidden rounded-3xl border border-white/10 px-6 py-10 text-center"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(130deg,rgba(124,92,255,0.18),rgba(34,211,238,0.08))]"
          />
          <div className="relative">
            <Sparkles className="mx-auto h-6 w-6 text-[var(--accent-2)]" />
            <h3 className="mt-3 text-balance text-xl font-semibold text-white sm:text-2xl">
              {t.demoPages.comingSoon}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
              {t.demoPages.comingSoonDesc}
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
    </div>
  );
}
