"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Lock } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionHeading } from "@/components/ui/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { Mockup } from "@/components/sections/Mockups";
import { cn } from "@/lib/utils";

export function Demos() {
  const { t } = useLanguage();

  return (
    <section id="demos" className="section-pad relative px-4">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={t.nav.demos}
          title={t.demos.title}
          subtitle={t.demos.subtitle}
        />

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {t.demos.items.map((demo) => {
            const ready = demo.status === "ready";
            return (
              <StaggerItem key={demo.slug} className="h-full">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="card-glow flex h-full flex-col rounded-2xl border border-white/10 bg-[var(--color-surface)]/50 p-4"
                >
                  <div className="relative">
                    <Mockup slug={demo.slug} />
                    <span
                      className={cn(
                        "absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md",
                        ready
                          ? "border border-[#25D366]/30 bg-[#25D366]/15 text-[#4ade80]"
                          : "border border-white/15 bg-white/10 text-white/70",
                      )}
                    >
                      {ready ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80] shadow-[0_0_6px_1px_rgba(74,222,128,0.8)]" />
                      ) : (
                        <Lock className="h-2.5 w-2.5" />
                      )}
                      {ready ? t.demos.ready : t.demos.soon}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-1 flex-col">
                    <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--accent-2)]">
                      {demo.type}
                    </p>
                    <h3 className="mt-1.5 text-lg font-semibold text-white">
                      {demo.name}
                    </h3>

                    <dl className="mt-3 space-y-2.5 text-sm">
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-white/40">
                          {t.demos.problemLabel}
                        </dt>
                        <dd className="mt-0.5 text-[var(--muted)]">
                          {demo.problem}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-white/40">
                          {t.demos.solutionLabel}
                        </dt>
                        <dd className="mt-0.5 text-[var(--muted)]">
                          {demo.solution}
                        </dd>
                      </div>
                    </dl>

                    <ul className="mt-3 grid grid-cols-1 gap-1.5">
                      {demo.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-[13px] text-white/70"
                        >
                          <Check className="h-3.5 w-3.5 shrink-0 text-[var(--accent-2)]" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/demos/${demo.slug}`}
                      className={cn(
                        "group mt-5 inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
                        ready
                          ? "border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
                          : "border-white/10 bg-transparent text-white/60 hover:bg-white/5",
                      )}
                    >
                      {t.demos.open}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
