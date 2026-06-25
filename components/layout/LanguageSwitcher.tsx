"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { Locale } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const options: { value: Locale; label: string }[] = [
  { value: "tr", label: "TR" },
  { value: "en", label: "EN" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="relative flex items-center rounded-full border border-white/10 bg-white/[0.03] p-0.5 backdrop-blur-md">
      {options.map((opt) => {
        const active = locale === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setLocale(opt.value)}
            className={cn(
              "relative z-10 rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-colors",
              active ? "text-white" : "text-[var(--muted)] hover:text-white",
            )}
            aria-label={`Switch language to ${opt.label}`}
            aria-pressed={active}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full bg-[linear-gradient(110deg,#7c5cff,#22d3ee)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
