"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Menu as MenuIcon, Phone, X } from "lucide-react";
import { BRAND, WA_DEFAULT, displayFamily } from "./shared";
import { NAV_LINKS } from "./data";

/* WhatsApp glyph (lucide has no brand icon) */
export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
    </svg>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [{ href: "#top", label: "Ana Sayfa" }, ...NAV_LINKS];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-[var(--line)] bg-[var(--bg)]/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="relative z-50 mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        {/* Logo */}
        <a href="#top" className="group flex items-center gap-3" aria-label="Ana sayfa">
          <span
            aria-hidden
            className="grid h-10 w-10 place-items-center rounded-full bg-[var(--olive)] text-[15px] font-semibold text-[var(--bg)] shadow-[0_10px_24px_-12px_rgba(79,98,69,0.8)] transition-transform group-hover:scale-105"
            style={{ fontFamily: displayFamily }}
          >
            İÖ
          </span>
          <span className="flex flex-col leading-none">
            <span
              className="text-[17px] font-semibold text-[var(--ink)]"
              style={{ fontFamily: displayFamily }}
            >
              Dyt. İkram Örnek
            </span>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.32em] text-[var(--olive)]">
              Diyetisyen
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="relative text-[14px] font-medium text-[var(--muted)] transition-colors hover:text-[var(--olive)]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <a
            href={WA_DEFAULT}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp’tan yaz"
            className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] bg-[var(--cream)] text-[#25806b] transition-all hover:scale-105 hover:border-[#25806b]/40"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
          <a
            href={BRAND.appointment}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--olive)] px-5 py-2.5 text-[14px] font-semibold text-[var(--bg)] shadow-[0_14px_30px_-16px_rgba(79,98,69,0.9)] transition-all hover:scale-[1.03] hover:bg-[var(--olive-deep)]"
          >
            <CalendarCheck className="h-4 w-4" />
            Randevu Al
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--cream)]/70 text-[var(--ink)] backdrop-blur lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu — full-screen opaque overlay (sits below the bar, above the page + sticky bar) */}
      {open && (
        <div className="fixed inset-0 z-40 flex flex-col bg-[var(--bg)] lg:hidden">
          <div className="h-[68px] shrink-0" aria-hidden />
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 pb-10 pt-2">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3.5 text-[18px] font-medium text-[var(--ink)] transition-colors hover:bg-[var(--cream)]"
                style={{ fontFamily: displayFamily, fontWeight: 500 }}
              >
                {l.label}
              </a>
            ))}
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              <a
                href={WA_DEFAULT}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#25806b]/30 bg-[#25806b]/10 px-4 py-3 text-[14px] font-semibold text-[#1f6d5b]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={BRAND.appointment}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--olive)] px-4 py-3 text-[14px] font-semibold text-[var(--bg)]"
              >
                <CalendarCheck className="h-4 w-4" />
                Randevu Al
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

/* Floating WhatsApp (desktop) */
export function FloatingWhatsApp() {
  return (
    <a
      href={WA_DEFAULT}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp’tan yaz"
      className="group fixed bottom-6 right-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_18px_40px_-12px_rgba(37,211,102,0.7)] transition-transform hover:scale-110 md:grid"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 blur-md transition-opacity group-hover:opacity-90" aria-hidden />
      <WhatsAppIcon className="relative h-7 w-7" />
    </a>
  );
}

/* Mobile sticky CTA bar */
export function MobileCtaBar() {
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-[var(--line)] bg-[var(--bg)]/95 p-2.5 backdrop-blur-xl md:hidden">
        <a
          href={WA_DEFAULT}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-3 py-3 text-[14px] font-semibold text-white"
        >
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp’tan Yaz
        </a>
        <a
          href={`tel:${BRAND.phoneTel}`}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--olive)] px-3 py-3 text-[14px] font-semibold text-[var(--bg)]"
        >
          <Phone className="h-4 w-4" />
          Ara
        </a>
      </div>
      <div className="h-20 md:hidden" aria-hidden />
    </>
  );
}
