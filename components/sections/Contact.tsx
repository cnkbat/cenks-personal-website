"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Copy,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionHeading } from "@/components/ui/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/i18n/dictionaries";

function CopyButton({ value, label }: { value: string; label: string }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button
      onClick={onCopy}
      aria-label={`${t.contact.copy} ${label}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-[var(--muted)] transition-colors hover:text-white"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-[#4ade80]" />
          {t.contact.copied}
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          {t.contact.copy}
        </>
      )}
    </button>
  );
}

export function Contact() {
  const { t } = useLanguage();

  const cards = [
    {
      label: t.contact.phone,
      value: siteConfig.phoneDisplay,
      icon: Phone,
      href: `tel:${siteConfig.phone}`,
      copy: siteConfig.phone,
    },
    {
      label: t.contact.whatsapp,
      value: siteConfig.phoneDisplay,
      icon: MessageCircle,
      href: siteConfig.whatsapp,
      external: true,
      copy: siteConfig.phone,
    },
    {
      label: t.contact.email,
      value: siteConfig.email,
      icon: Mail,
      href: `mailto:${siteConfig.email}`,
      copy: siteConfig.email,
    },
    {
      label: t.contact.instagram,
      value: "@cnkbat",
      icon: Instagram,
      href: siteConfig.instagram,
      external: true,
      copy: siteConfig.instagram,
    },
    {
      label: t.contact.linkedin,
      value: "cenkemirbat123",
      icon: Linkedin,
      href: siteConfig.linkedin,
      external: true,
      copy: siteConfig.linkedin,
    },
    {
      label: t.contact.website,
      value: "cenk-emir-bat.vercel.app",
      icon: Globe,
      href: siteConfig.url,
      external: true,
      copy: siteConfig.url,
    },
  ];

  return (
    <section id="contact" className="section-pad relative px-4">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={t.nav.contact}
          title={t.contact.title}
          subtitle={t.contact.subtitle}
        />

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <StaggerItem key={i}>
                <div className="card-glow glass-card group flex h-full items-center justify-between gap-3 rounded-3xl p-5">
                  <a
                    href={c.href}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noopener noreferrer" : undefined}
                    className="flex min-w-0 flex-1 items-center gap-3.5"
                  >
                    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(124,92,255,0.2),rgba(34,211,238,0.12))] text-white transition-transform duration-500 group-hover:-translate-y-0.5">
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_30%,rgba(124,92,255,0.5),transparent_70%)] opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100"
                      />
                      <Icon className="relative h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-medium uppercase tracking-wide text-white/40">
                        {c.label}
                      </span>
                      <span className="block truncate text-sm font-medium text-white">
                        {c.value}
                      </span>
                    </span>
                  </a>
                  {c.copy && <CopyButton value={c.copy} label={c.label} />}
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        {/* Big CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-16 overflow-hidden rounded-3xl border border-white/10 px-6 py-14 text-center"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(130deg,rgba(124,92,255,0.18),rgba(34,211,238,0.08))]"
          />
          <div
            aria-hidden
            className="absolute inset-0 grid-bg opacity-50"
          />
          <div className="relative mx-auto max-w-2xl">
            <h3 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
              {t.contact.ctaTitle}
            </h3>
            <p className="mx-auto mt-4 max-w-lg text-base text-[var(--muted)]">
              {t.contact.ctaSubtitle}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="whatsapp" size="lg">
                  <MessageCircle className="h-5 w-5" />
                  {t.contact.ctaButton}
                </Button>
              </a>
              <a href={`tel:${siteConfig.phone}`}>
                <Button variant="glass" size="lg">
                  <Phone className="h-4 w-4" />
                  {siteConfig.phoneDisplay}
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
