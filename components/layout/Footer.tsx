"use client";

import { Instagram, Linkedin, Mail, MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { siteConfig } from "@/lib/i18n/dictionaries";

export function Footer() {
  const { t } = useLanguage();

  const nav = [
    { href: "#services", label: t.nav.services },
    { href: "#demos", label: t.nav.demos },
    { href: "#packages", label: t.nav.packages },
    { href: "#about", label: t.nav.about },
    { href: "#contact", label: t.nav.contact },
  ];

  const socials = [
    { href: siteConfig.whatsapp, label: "WhatsApp", icon: MessageCircle },
    { href: siteConfig.instagram, label: "Instagram", icon: Instagram },
    { href: siteConfig.linkedin, label: "LinkedIn", icon: Linkedin },
    { href: `mailto:${siteConfig.email}`, label: "Email", icon: Mail },
  ];

  return (
    <footer className="relative border-t border-white/10 px-4 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/cenk-profile.webp"
              alt="Cenk Emir Bat"
              width={36}
              height={36}
              className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/15"
            />
            <span className="text-[15px] font-semibold tracking-tight text-white">
              Cenk Emir Bat
            </span>
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">{t.footer.tagline}</p>
        </div>

        <div className="flex gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
              {t.footer.nav}
            </p>
            <ul className="mt-4 space-y-2.5">
              {nav.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-[var(--muted)] transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
              {t.footer.social}
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-[var(--muted)] transition-colors hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                    {s.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
        <span>
          © {new Date().getFullYear()} Cenk Emir Bat. {t.footer.rights}
        </span>
        <span>{t.footer.tagline}</span>
      </div>
    </footer>
  );
}
