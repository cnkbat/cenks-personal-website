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

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.value.items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <StaggerItem key={item.title}>
                <div className="card-glow group h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(135deg,rgba(124,92,255,0.18),rgba(34,211,238,0.1))] text-[var(--accent-2)] transition-transform duration-300 group-hover:-translate-y-0.5">
                    <Icon className="h-6 w-6" strokeWidth={1.6} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
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
