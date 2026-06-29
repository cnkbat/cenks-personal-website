"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionHeading } from "@/components/ui/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type Status = "live" | "ready" | "new";

const badgeStyles: Record<Status, string> = {
  live: "border border-[#25D366]/30 bg-[#25D366]/15 text-[#4ade80]",
  ready: "border border-[var(--accent-2)]/30 bg-[var(--accent-2)]/15 text-[var(--accent-2)]",
  new: "border border-[var(--accent-3)]/30 bg-[var(--accent-3)]/15 text-[var(--accent-3)]",
};

function StatusBadge({ status, label }: { status: Status; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md",
        badgeStyles[status],
      )}
    >
      {status === "live" ? (
        <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80] shadow-[0_0_6px_1px_rgba(74,222,128,0.8)]" />
      ) : status === "new" ? (
        <Sparkles className="h-3 w-3" />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-2)]" />
      )}
      {label}
    </span>
  );
}

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

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {t.demos.items.map((demo) => (
            <StaggerItem key={demo.slug} className="h-full">
              <Link href={demo.href} className="group block h-full">
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="card-glow glass-card flex h-full flex-col overflow-hidden rounded-3xl"
                >
                  {/* Preview */}
                  <div className="relative">
                    <img
                      src={demo.image}
                      alt={demo.name}
                      width={1536}
                      height={1024}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[16/10] w-full object-cover"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,7,17,0.55),transparent_55%)]"
                    />
                    <span className="absolute right-3 top-3">
                      <StatusBadge status={demo.status} label={t.demos.badges[demo.status]} />
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--accent-2)]">
                      {demo.type}
                    </p>
                    <h3 className="mt-1.5 text-lg font-semibold text-white">
                      {demo.name}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--muted)]">
                      {demo.value}
                    </p>

                    <ul className="mt-4 grid grid-cols-1 gap-1.5">
                      {demo.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-[13px] text-white/75"
                        >
                          <Check className="h-3.5 w-3.5 shrink-0 text-[var(--accent-2)]" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <span className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-all group-hover:border-white/30 group-hover:bg-white/10">
                      {t.demos.open}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
