"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionHeading } from "@/components/ui/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Packages() {
  const { t } = useLanguage();

  return (
    <section id="packages" className="section-pad relative px-4">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={t.nav.packages}
          title={t.packages.title}
          subtitle={t.packages.subtitle}
        />

        <StaggerGroup className="mt-16 grid grid-cols-1 items-center gap-6 lg:grid-cols-3">
          {t.packages.items.map((pkg, i) => {
            const highlighted = pkg.highlighted;
            return (
              <StaggerItem key={i} className="h-full">
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "relative flex h-full flex-col rounded-3xl p-8",
                    highlighted
                      ? "ring-gradient glass-card glow-ring bg-[linear-gradient(180deg,rgba(124,92,255,0.16),rgba(13,15,28,0.55))] lg:scale-[1.04]"
                      : "card-glow glass-card",
                  )}
                >
                  {highlighted && (
                    <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[linear-gradient(110deg,#7c5cff,#22d3ee)] px-3.5 py-1 text-xs font-semibold text-white shadow-[0_8px_24px_-6px_rgba(124,92,255,0.8)]">
                      <Sparkles className="h-3 w-3" />
                      {t.packages.popular}
                    </span>
                  )}

                  <h3 className="text-xl font-semibold text-white">{pkg.name}</h3>
                  <p className="mt-1.5 text-sm text-[var(--muted)]">
                    {pkg.tagline}
                  </p>

                  <div className="mt-5 flex items-end gap-1.5">
                    <span className="text-3xl font-semibold tracking-tight text-white">
                      {pkg.price}
                    </span>
                    <span className="mb-1 text-sm text-[var(--muted)]">
                      / {pkg.period}
                    </span>
                  </div>

                  <div className="my-6 h-px w-full bg-white/10" />

                  <ul className="flex-1 space-y-3">
                    {pkg.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-sm text-white/80"
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                            highlighted
                              ? "bg-[var(--accent)]/25 text-[var(--accent-2)]"
                              : "bg-white/10 text-white/70",
                          )}
                        >
                          <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a href="#contact" className="mt-7 block">
                    <Button
                      variant={highlighted ? "gradient" : "glass"}
                      className="w-full"
                    >
                      {t.packages.cta}
                    </Button>
                  </a>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        <p className="mx-auto mt-8 max-w-xl text-center text-sm text-[var(--muted)]">
          {t.packages.note}
        </p>
      </div>
    </section>
  );
}
