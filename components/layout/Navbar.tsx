"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#home", label: t.nav.home },
    { href: "#services", label: t.nav.services },
    { href: "#demos", label: t.nav.demos },
    { href: "#packages", label: t.nav.packages },
    { href: "#about", label: t.nav.about },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3"
      >
        <nav
          className={cn(
            "flex w-full items-center justify-between rounded-2xl px-4 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-5",
            scrolled
              ? "glass-strong max-w-5xl py-2 shadow-[0_24px_70px_-32px_rgba(0,0,0,0.95)]"
              : "max-w-6xl border border-transparent bg-transparent py-2.5",
          )}
        >
          <a
            href="#home"
            className="group flex items-center gap-2.5"
            aria-label="Cenk Emir Bat — home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#7c5cff,#22d3ee)] text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(124,92,255,0.8)]">
              CB
            </span>
            <span className="hidden text-[15px] font-semibold tracking-tight text-white sm:block">
              Cenk Emir Bat
            </span>
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm text-[var(--muted)] transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <a
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366] transition-colors hover:bg-[#25D366]/25 sm:flex"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-[18px] w-[18px]" />
            </a>
            <a href="#contact" className="hidden sm:block">
              <Button variant="gradient" size="sm">
                {t.nav.cta}
              </Button>
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white lg:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong absolute inset-x-4 top-20 rounded-2xl p-3"
            >
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-[15px] font-medium text-[var(--muted)] transition-colors hover:bg-white/5 hover:text-white"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-2 flex gap-2 p-1">
                <a href="#contact" onClick={() => setOpen(false)} className="flex-1">
                  <Button variant="gradient" className="w-full">
                    {t.nav.cta}
                  </Button>
                </a>
                <a
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="whatsapp" className="w-full">
                    {t.nav.whatsapp}
                  </Button>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
