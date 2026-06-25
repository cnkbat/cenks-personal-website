"use client";

import {
  CalendarCheck,
  Gem,
  MessageSquare,
  Search,
  TrendingUp,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionHeading } from "@/components/ui/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";

const icons: LucideIcon[] = [
  Gem,
  TrendingUp,
  CalendarCheck,
  Search,
  MessageSquare,
  Workflow,
];

export function BusinessValue() {
  const { t } = useLanguage();

  return (
    <section className="section-pad relative px-4">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t.value.title} subtitle={t.value.subtitle} />

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.value.items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <StaggerItem key={i}>
                <div className="card-glow glass-card group h-full rounded-3xl p-7">
                  <div className="relative flex h-13 w-13 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(124,92,255,0.22),rgba(34,211,238,0.12))] text-[var(--accent-2)] transition-all duration-500 group-hover:-translate-y-1 group-hover:text-white">
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_30%,rgba(124,92,255,0.5),transparent_70%)] opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100"
                    />
                    <Icon className="relative h-6 w-6" strokeWidth={1.6} />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--muted)]">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
