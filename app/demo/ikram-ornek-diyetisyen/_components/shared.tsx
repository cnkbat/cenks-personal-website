"use client";

import { useEffect, useRef, useState } from "react";
import { Fraunces } from "next/font/google";
import { motion, useInView, animate, useReducedMotion } from "framer-motion";

/* ------------------------------------------------------------------ *
 * Fonts — Fraunces (soft, characterful display serif) + latin-ext for
 * full Turkish glyph coverage (ç ş ğ ı İ ö ü). Body stays on Geist Sans
 * (loaded globally by the root layout).
 * ------------------------------------------------------------------ */
export const display = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

export const displayFamily = "var(--font-display), Georgia, 'Times New Roman', serif";

export const ease = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ *
 * Brand contact — real business details (client-ready)
 * ------------------------------------------------------------------ */
export const BRAND = {
  name: "Dyt. İkram Örnek",
  role: "Diyetisyen",
  tagline: "Yasaksız. Sürdürülebilir. Bilimsel Beslenme.",
  phoneDisplay: "0538 841 64 27",
  phoneTel: "+905388416427",
  whatsappNumber: "905388416427",
  email: "dyt.ikramornek@gmail.com",
  instagram: "https://instagram.com/dyt.ikramornek",
  instagramHandle: "@dyt.ikramornek",
  addressShort: "Bahçelievler, İstanbul",
  addressLong: "Bahçelievler, İstanbul",
  maps: "https://share.google/k2WDHMVHRuPGTnHcv",
  appointment: "https://forms.gle/VJtRSymBbWXxhMpJ6",
} as const;

export function waLink(message: string) {
  return `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const WA_DEFAULT = waLink(
  "Merhaba İkram Hanım, beslenme danışmanlığı hakkında bilgi almak istiyorum."
);

/* ------------------------------------------------------------------ *
 * Reveal — scroll-triggered fade + rise. The rise (y transform) is
 * disabled for users with prefers-reduced-motion via <MotionConfig
 * reducedMotion="user"> at the site root.
 * ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

/* ------------------------------------------------------------------ *
 * AnimatedNumber — counts up when scrolled into view
 * ------------------------------------------------------------------ */
export function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
  duration = 1.8,
  className,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    // reduced motion: duration 0 jumps straight to the final value (no count-up),
    // still via animate's async onUpdate so no synchronous setState in the effect.
    const controls = animate(0, value, {
      duration: reduce ? 0 : duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {Math.round(val).toLocaleString("tr-TR")}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Eyebrow — small uppercase label with a leaf tick
 * ------------------------------------------------------------------ */
export function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--olive)] ${className}`}
    >
      <LeafMark className="h-3.5 w-3.5 text-[var(--sage)]" />
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Pill — soft rounded label
 * ------------------------------------------------------------------ */
export function Pill({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--cream)]/70 px-4 py-1.5 text-[13px] font-medium text-[var(--olive)] backdrop-blur-sm ${className}`}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * SectionHeading — eyebrow + display title + optional lead
 * ------------------------------------------------------------------ */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  className = "",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  const alignCls =
    align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  return (
    <div className={`flex max-w-2xl flex-col ${alignCls} ${className}`}>
      {eyebrow && (
        <Reveal>
          <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2
          className="text-balance text-[2rem] leading-[1.08] tracking-[-0.01em] text-[var(--ink)] sm:text-[2.6rem] md:text-[3.1rem]"
          style={{ fontFamily: displayFamily, fontWeight: 500 }}
        >
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.1}>
          <p className="mt-5 text-pretty text-[15px] leading-relaxed text-[var(--muted)] sm:text-[17px]">
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Botanical + arch motifs — the site's signature visual language
 * ------------------------------------------------------------------ */
export function LeafMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 21c0-6 0-9 3.5-12.5C18 6 21 5 21 5s-.5 3.2-3 5.7C15 14 12 15 12 21Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M12 21c0-5-1-7.5-4-10.5C5.5 8 3 7 3 7s.4 2.7 2.5 5C8 14.5 11 15.5 12 21Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path d="M12 21V9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/** A slim decorative botanical sprig, absolutely positioned by the caller. */
export function Sprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 220" fill="none" className={className} aria-hidden>
      <path
        d="M60 214C60 150 58 90 60 8"
        stroke="var(--sage)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.6"
      />
      {Array.from({ length: 7 }).map((_, i) => {
        const y = 30 + i * 26;
        return (
          <g key={i} opacity="0.55">
            <path
              d={`M60 ${y}c-22-6-34-2-40-14 14-6 30-4 40 14Z`}
              fill="var(--sage)"
              opacity="0.5"
            />
            <path
              d={`M60 ${y + 12}c22-6 34-2 40-14-14-6-30-4-40 14Z`}
              fill="var(--sage)"
              opacity="0.42"
            />
          </g>
        );
      })}
    </svg>
  );
}

/** A soft, blurred sage “blob” glow for ambient depth. */
export function Blob({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
    />
  );
}

/** Fine grain overlay to keep flat cream areas from feeling digital. */
export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] mix-blend-multiply"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

/* ------------------------------------------------------------------ *
 * ArchImage — the recurring apothecary-arch framed image. Falls back to
 * an elegant botanical gradient when the source is absent.
 * ------------------------------------------------------------------ */
export function ArchImage({
  src,
  alt,
  className = "",
  radius = "arch",
  children,
}: {
  src?: string;
  alt: string;
  className?: string;
  radius?: "arch" | "soft";
  children?: React.ReactNode;
}) {
  const rounded =
    radius === "arch"
      ? "rounded-t-[999px] rounded-b-[26px]"
      : "rounded-[26px]";
  return (
    <div
      className={`relative overflow-hidden border border-[var(--line)] bg-[var(--cream)] ${rounded} ${className}`}
    >
      {src ? (
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, rgba(157,176,136,0.35), transparent 55%), linear-gradient(180deg, #F3EFE7, #E7E1D2)",
          }}
          role="img"
          aria-label={alt}
        >
          <LeafMark className="h-12 w-12 text-[var(--sage)]/50" />
        </div>
      )}
      {children}
    </div>
  );
}
