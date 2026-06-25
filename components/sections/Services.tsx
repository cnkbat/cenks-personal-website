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

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <StaggerItem key={item.title}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="card-glow group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-[var(--color-surface)]/40 p-6"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.25),transparent_70%)] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white">
                      <Icon className="h-6 w-6" strokeWidth={1.6} />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-white/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white/60" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
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
