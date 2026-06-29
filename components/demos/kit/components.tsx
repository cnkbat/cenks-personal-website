"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MessageCircle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { siteConfig } from "@/lib/i18n/dictionaries";
import { type DemoTheme, themeVars } from "@/lib/demos/themes";
import { DemoToastProvider } from "./interactive";
import { cn } from "@/lib/utils";

export const demoSerif = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-demo-serif",
});

const ease = [0.22, 1, 0.36, 1] as const;
const SERIF = "[font-family:var(--font-demo-serif),Georgia,serif]";

/* ----------------------------- Reveal ----------------------------- */
export function DemoReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------- Button ----------------------------- */
type BtnVariant = "solid" | "outline" | "whatsapp" | "ghost";

const btnBase =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 active:scale-[0.97]";
const btnVariants: Record<BtnVariant, string> = {
  solid:
    "bg-[var(--d-accent)] text-[var(--d-accent-fg)] hover:brightness-105 hover:-translate-y-0.5 shadow-[0_14px_40px_-14px_var(--d-ring)]",
  outline:
    "border border-[var(--d-border)] bg-[var(--d-surface)] text-[var(--d-fg)] hover:border-[var(--d-accent)]/50",
  whatsapp:
    "bg-[#25D366] text-[#06210f] hover:bg-[#22c35e] hover:-translate-y-0.5 shadow-[0_14px_40px_-14px_rgba(37,211,102,0.6)]",
  ghost: "text-[var(--d-muted)] hover:text-[var(--d-fg)]",
};

export function DemoButton({
  children,
  href,
  variant = "solid",
  external,
  className,
}: {
  children: ReactNode;
  href: string;
  variant?: BtnVariant;
  external?: boolean;
  className?: string;
}) {
  const cls = cn(btnBase, "h-12 px-6", btnVariants[variant], className);
  const isHash = href.startsWith("#");
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  if (isHash) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/* --------------------------- Shell / chrome --------------------------- */
function TopBar({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--d-border)] bg-[var(--d-bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/#demos"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--d-muted)] transition-colors hover:text-[var(--d-fg)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Portföye dön
        </Link>
        <span className="truncate text-[13px] font-semibold text-[var(--d-fg)]">
          {name}
        </span>
        <a
          href={siteConfig.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 py-1.5 text-[12px] font-semibold text-[#06210f] transition-transform hover:scale-[1.03]"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
    </header>
  );
}

function DemoFooter({ name, sector }: { name: string; sector: string }) {
  return (
    <footer className="border-t border-[var(--d-border)] bg-[var(--d-bg-soft)] px-4 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <div className="text-lg font-semibold text-[var(--d-fg)]">{name}</div>
        <p className="max-w-md text-sm text-[var(--d-muted)]">{sector}</p>
        <p className="mt-2 text-[12px] text-[var(--d-faint)]">
          Bu bir demo çalışmasıdır · Tasarım &amp; geliştirme:{" "}
          <Link
            href="/#demos"
            className="font-medium text-[var(--d-accent)] hover:underline"
          >
            Cenk Emir Bat
          </Link>
        </p>
      </div>
    </footer>
  );
}

function StickyWhatsApp() {
  return (
    <a
      href={siteConfig.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 left-1/2 z-40 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#06210f] shadow-[0_18px_50px_-15px_rgba(0,0,0,0.6)] transition-transform hover:scale-[1.03]"
    >
      <MessageCircle className="h-4 w-4" />
      WhatsApp ile Görüşelim
    </a>
  );
}

/**
 * Standalone, self-themed page shell for a sector demo. Renders the
 * back-to-portfolio top bar, the themed body, the footer credit and the mobile
 * sticky WhatsApp CTA. Pass `serif` to render display headings in Playfair.
 */
export function DemoShell({
  theme,
  name,
  sector,
  serif = false,
  children,
}: {
  theme: DemoTheme;
  name: string;
  sector: string;
  serif?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      style={themeVars(theme)}
      className={cn(
        "min-h-screen bg-[var(--d-bg)] text-[var(--d-fg)] antialiased",
        serif && demoSerif.variable,
      )}
    >
      <DemoToastProvider>
        <TopBar name={name} />
        <main>{children}</main>
        <DemoFooter name={name} sector={sector} />
        <StickyWhatsApp />
        <div className="h-20" />
      </DemoToastProvider>
    </div>
  );
}

/* ------------------------------- Hero ------------------------------- */
export function DemoHero({
  sector,
  name,
  promise,
  image,
  serif = false,
  panelHref = "#panel",
  badge,
}: {
  sector: string;
  name: string;
  promise: string;
  image?: string;
  serif?: boolean;
  panelHref?: string;
  badge?: string;
}) {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 h-[28rem] w-[28rem] rounded-full blur-[120px]"
        style={{ background: "var(--d-ring)" }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <DemoReveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--d-border)] bg-[var(--d-surface)] px-3 py-1 text-[12px] font-medium text-[var(--d-accent)]">
            <Sparkles className="h-3.5 w-3.5" />
            {badge ?? sector}
          </div>
          <h1
            className={cn(
              "mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-[var(--d-fg)] sm:text-5xl lg:text-6xl",
              serif && SERIF,
            )}
          >
            {name}
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-[var(--d-muted)]">
            {promise}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <DemoButton href={panelHref} variant="solid">
              Demo Paneli Gör
              <ArrowRight className="h-4 w-4" />
            </DemoButton>
            <DemoButton href={siteConfig.whatsapp} variant="whatsapp" external>
              <MessageCircle className="h-4 w-4" />
              WhatsApp ile Görüşelim
            </DemoButton>
          </div>
        </DemoReveal>

        {image && (
          <DemoReveal delay={0.12}>
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-4 -z-10 rounded-[2rem] blur-2xl"
                style={{ background: "var(--d-ring)" }}
              />
              <img
                src={image}
                alt={sector}
                width={1536}
                height={1024}
                decoding="async"
                className="aspect-[4/3] w-full rounded-[1.6rem] border border-[var(--d-border)] object-cover shadow-[0_50px_120px_-50px_rgba(0,0,0,0.6)]"
              />
            </div>
          </DemoReveal>
        )}
      </div>
    </section>
  );
}

/* ----------------------------- Section ----------------------------- */
export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  soft = false,
  serif = false,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: string;
  soft?: boolean;
  serif?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 px-4 py-16 sm:py-20",
        soft && "bg-[var(--d-bg-soft)]",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">
        {(eyebrow || title) && (
          <DemoReveal className="mb-10 max-w-2xl">
            {eyebrow && (
              <div className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--d-accent)]">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2
                className={cn(
                  "mt-3 text-balance text-3xl font-bold tracking-tight text-[var(--d-fg)] sm:text-4xl",
                  serif && SERIF,
                )}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-pretty text-[15px] leading-relaxed text-[var(--d-muted)]">
                {subtitle}
              </p>
            )}
          </DemoReveal>
        )}
        {children}
      </div>
    </section>
  );
}

/* --------------------------- Problem / Solution --------------------------- */
export function ProblemSection({
  eyebrow = "Sorun",
  title,
  items,
  soft,
}: {
  eyebrow?: string;
  title: string;
  items: string[];
  soft?: boolean;
}) {
  return (
    <Section eyebrow={eyebrow} title={title} soft={soft}>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((it, i) => (
          <DemoReveal key={it} delay={i * 0.05}>
            <div className="flex h-full gap-3 rounded-2xl border border-[var(--d-border)] bg-[var(--d-surface)] p-5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-sm font-bold text-rose-500">
                !
              </span>
              <p className="text-[15px] leading-relaxed text-[var(--d-muted)]">
                {it}
              </p>
            </div>
          </DemoReveal>
        ))}
      </div>
    </Section>
  );
}

export function SolutionSection({
  eyebrow = "Çözüm",
  title,
  subtitle,
  items,
  soft,
  serif,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  items: { icon: LucideIcon; title: string; text: string }[];
  soft?: boolean;
  serif?: boolean;
}) {
  return (
    <Section eyebrow={eyebrow} title={title} subtitle={subtitle} soft={soft} serif={serif}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <DemoReveal key={it.title} delay={i * 0.05}>
            <div className="h-full rounded-2xl border border-[var(--d-border)] bg-[var(--d-surface)] p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--d-accent)]/15 text-[var(--d-accent)]">
                <it.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-[15px] font-semibold text-[var(--d-fg)]">
                {it.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--d-muted)]">
                {it.text}
              </p>
            </div>
          </DemoReveal>
        ))}
      </div>
    </Section>
  );
}

/* ----------------------------- Stage (mockup) ----------------------------- */
export function DemoStage({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] blur-3xl"
        style={{ background: "var(--d-ring)" }}
      />
      <DemoReveal>{children}</DemoReveal>
    </div>
  );
}

/* ------------------------------ Features ------------------------------ */
export function FeatureGrid({
  features,
}: {
  features: { icon: LucideIcon; title: string; text: string }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((f, i) => (
        <DemoReveal key={f.title} delay={(i % 3) * 0.05}>
          <div className="group h-full rounded-2xl border border-[var(--d-border)] bg-[var(--d-surface)] p-6 transition-colors hover:border-[var(--d-accent)]/40">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--d-accent)]/15 text-[var(--d-accent)] transition-transform group-hover:-translate-y-0.5">
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-[15px] font-semibold text-[var(--d-fg)]">
              {f.title}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--d-muted)]">
              {f.text}
            </p>
          </div>
        </DemoReveal>
      ))}
    </div>
  );
}

/* ------------------------------ Scenario ------------------------------ */
export function Scenario({
  persona,
  steps,
}: {
  persona: string;
  steps: { time: string; text: string }[];
}) {
  return (
    <div className="rounded-3xl border border-[var(--d-border)] bg-[var(--d-surface)] p-6 sm:p-9">
      <p className="text-[15px] font-medium text-[var(--d-fg)]">{persona}</p>
      <ol className="mt-7 space-y-6">
        {steps.map((s, i) => (
          <DemoReveal key={i} delay={i * 0.05}>
            <li className="relative flex gap-4 pl-2">
              <div className="flex flex-col items-center">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--d-accent)]/15 text-[12px] font-bold text-[var(--d-accent)]">
                  {i + 1}
                </span>
                {i < steps.length - 1 && (
                  <span className="mt-1 w-px flex-1 bg-[var(--d-border)]" />
                )}
              </div>
              <div className="pb-1">
                <div className="text-[12px] font-semibold uppercase tracking-wide text-[var(--d-accent)]">
                  {s.time}
                </div>
                <p className="mt-1 text-[15px] leading-relaxed text-[var(--d-muted)]">
                  {s.text}
                </p>
              </div>
            </li>
          </DemoReveal>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------ Pricing ------------------------------ */
export type DemoPlan = {
  name: string;
  tagline: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
};

export function PricingCards({ plans }: { plans: DemoPlan[] }) {
  return (
    <div className="grid items-stretch gap-5 lg:grid-cols-3">
      {plans.map((p, i) => (
        <DemoReveal key={p.name} delay={i * 0.06} className="h-full">
          <div
            className={cn(
              "relative flex h-full flex-col rounded-3xl border p-7",
              p.highlighted
                ? "border-[var(--d-accent)]/50 bg-[var(--d-surface)] shadow-[0_30px_80px_-40px_var(--d-ring)] lg:scale-[1.03]"
                : "border-[var(--d-border)] bg-[var(--d-surface)]",
            )}
          >
            {p.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--d-accent)] px-3 py-1 text-[11px] font-semibold text-[var(--d-accent-fg)]">
                En Çok Tercih Edilen
              </span>
            )}
            <h3 className="text-lg font-semibold text-[var(--d-fg)]">{p.name}</h3>
            <p className="mt-1 text-[13px] text-[var(--d-muted)]">{p.tagline}</p>
            <div className="mt-5 flex items-end gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-[var(--d-fg)]">
                {p.price}
              </span>
              {p.period && (
                <span className="mb-1 text-[13px] text-[var(--d-faint)]">
                  {p.period}
                </span>
              )}
            </div>
            <ul className="mt-6 flex-1 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] text-[var(--d-muted)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--d-accent)]" />
                  {f}
                </li>
              ))}
            </ul>
            <DemoButton
              href={siteConfig.whatsapp}
              external
              variant={p.highlighted ? "solid" : "outline"}
              className="mt-7 w-full"
            >
              Teklif Al
            </DemoButton>
          </div>
        </DemoReveal>
      ))}
    </div>
  );
}

/* ------------------------------ Final CTA ------------------------------ */
export function FinalCTA({
  title = "Bu sistemin benzerini işletmeniz için hazırlayabilirim.",
  text = "İşletmenize özel bir demo ve net bir teklif için birkaç dakikalık bir görüşme yeterli.",
  serif = false,
}: {
  title?: string;
  text?: string;
  serif?: boolean;
}) {
  return (
    <section className="px-4 py-20">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-[var(--d-border)] bg-[var(--d-surface)] px-6 py-14 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 50% 0%, var(--d-ring), transparent 70%)",
          }}
        />
        <Sparkles className="mx-auto h-8 w-8 text-[var(--d-accent)]" />
        <h2
          className={cn(
            "mx-auto mt-5 max-w-2xl text-balance text-2xl font-bold tracking-tight text-[var(--d-fg)] sm:text-3xl",
            serif && SERIF,
          )}
        >
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-[var(--d-muted)]">
          {text}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <DemoButton href={siteConfig.whatsapp} variant="whatsapp" external>
            <MessageCircle className="h-4 w-4" />
            WhatsApp ile Görüşelim
          </DemoButton>
          <DemoButton href="/#demos" variant="outline">
            Diğer Demoları Gör
          </DemoButton>
        </div>
      </div>
    </section>
  );
}
