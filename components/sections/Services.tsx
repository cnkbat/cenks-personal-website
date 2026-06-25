"use client";

import { motion } from "framer-motion";
import {
  Bot,
  CalendarClock,
  Globe,
  LineChart,
  Share2,
  Users,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionHeading } from "@/components/ui/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";

const icons: LucideIcon[] = [
  Globe,
  Users,
  CalendarClock,
  LineChart,
  Share2,
  Bot,
];

export function Services() {
  const { t } = useLanguage();

  return (
    <section id="services" className="section-pad relative px-4">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={t.nav.services}
          title={t.services.title}
          subtitle={t.services.subtitle}
        />

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="card-glow glass-card group relative h-full overflow-hidden rounded-3xl p-7"
                >
                  {/* soft top light */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-60"
                  />
                  {/* corner glow */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.3),transparent_70%)] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="flex items-start justify-between">
                    <div className="relative flex h-13 w-13 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition-transform duration-500 group-hover:-translate-y-1">
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_30%,rgba(34,211,238,0.45),transparent_70%)] opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100"
                      />
                      <Icon className="relative h-6 w-6" strokeWidth={1.6} />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-white/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white/70" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--muted)]">
                    {item.description}
                  </p>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
