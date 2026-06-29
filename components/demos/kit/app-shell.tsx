"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  Send,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { siteConfig } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { DemoActionButton, DemoModal, SelectField, TextField } from "./interactive";

const ease = [0.22, 1, 0.36, 1] as const;

export type SidebarItem = { id: string; icon: LucideIcon; label: string };

/* ------------------------------ Sidebar (desktop) ------------------------------ */
export function DemoSidebar({
  brand,
  items,
  active,
  onSelect,
  onPresent,
}: {
  brand: { icon: LucideIcon; name: string };
  items: SidebarItem[];
  active: string;
  onSelect: (id: string) => void;
  onPresent: () => void;
}) {
  return (
    <aside className="hidden flex-col gap-1 rounded-xl bg-[var(--d-bg-soft)] p-3 lg:flex">
      <div className="mb-2 flex items-center gap-2 px-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--d-accent)] text-[var(--d-accent-fg)]">
          <brand.icon className="h-4 w-4" />
        </span>
        <span className="text-[13px] font-bold text-[var(--d-fg)]">{brand.name}</span>
      </div>
      {items.map((it) => {
        const on = it.id === active;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onSelect(it.id)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] font-medium transition-colors",
              on
                ? "bg-[var(--d-accent)]/15 text-[var(--d-accent)]"
                : "text-[var(--d-muted)] hover:bg-[var(--d-surface-2)] hover:text-[var(--d-fg)]",
            )}
          >
            <it.icon className="h-4 w-4" />
            {it.label}
          </button>
        );
      })}
      <div className="mt-3 border-t border-[var(--d-border)] pt-3">
        <button
          type="button"
          onClick={onPresent}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--d-accent)] px-2.5 py-2 text-[12px] font-semibold text-[var(--d-accent-fg)] transition-transform hover:scale-[1.02]"
        >
          <Play className="h-3.5 w-3.5" />
          Sunum Modu
        </button>
      </div>
    </aside>
  );
}

/* ------------------------------ Sidebar (mobile) ------------------------------ */
export function DemoMobileNav({
  items,
  active,
  onSelect,
  onPresent,
}: {
  items: SidebarItem[];
  active: string;
  onSelect: (id: string) => void;
  onPresent: () => void;
}) {
  return (
    <div className="mb-3 flex items-center gap-2 lg:hidden">
      <div className="-mx-1 flex-1 overflow-x-auto px-1">
        <div className="flex w-max gap-1.5">
          {items.map((it) => {
            const on = it.id === active;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => onSelect(it.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition-colors",
                  on
                    ? "bg-[var(--d-accent)] text-[var(--d-accent-fg)]"
                    : "border border-[var(--d-border)] text-[var(--d-muted)]",
                )}
              >
                <it.icon className="h-3.5 w-3.5" />
                {it.label}
              </button>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        onClick={onPresent}
        aria-label="Sunum Modu"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--d-accent)] px-3 py-1.5 text-[11.5px] font-semibold text-[var(--d-accent-fg)]"
      >
        <Play className="h-3.5 w-3.5" />
        Sunum
      </button>
    </div>
  );
}

/* ------------------------------ Animated view swap ------------------------------ */
export function AnimatedView({ id, children }: { id: string; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.24, ease }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/* ------------------------------ Presentation mode ------------------------------ */
export type PresentationStep = {
  title: string;
  text: string;
  action: string;
  view?: string;
};

export function PresentationMode({
  open,
  steps,
  onClose,
  onStepView,
}: {
  open: boolean;
  steps: PresentationStep[];
  onClose: () => void;
  onStepView?: (view: string) => void;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (open) setI(0);
  }, [open]);

  useEffect(() => {
    if (open && steps[i]?.view) onStepView?.(steps[i].view as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, i]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") setI((v) => Math.min(steps.length - 1, v + 1));
      else if (e.key === "ArrowLeft") setI((v) => Math.max(0, v - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, steps.length, onClose]);

  const step = steps[i];
  const last = i === steps.length - 1;

  return (
    <AnimatePresence>
      {open && step && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[80] flex items-end justify-center p-4 sm:p-6"
        >
          {/* subtle top vignette so the floating card reads as a layer, dashboard stays visible */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.28))" }}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.35, ease }}
            className="pointer-events-auto relative w-full max-w-xl overflow-hidden rounded-3xl border border-[var(--d-border)] bg-[var(--d-surface)] shadow-[0_50px_120px_-30px_rgba(0,0,0,0.7)]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 opacity-70"
              style={{ background: "radial-gradient(ellipse 70% 80% at 10% 0%, var(--d-ring), transparent 60%)" }}
            />
            <div className="flex items-center justify-between px-5 pt-4">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--d-accent)]">
                <Play className="h-3.5 w-3.5" /> Sunum Modu
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-medium text-[var(--d-muted)]">
                  Adım {i + 1} / {steps.length}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Sunumu Bitir"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--d-muted)] transition-colors hover:bg-[var(--d-surface-2)] hover:text-[var(--d-fg)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* progress dots */}
            <div className="flex gap-1.5 px-5 pt-3">
              {steps.map((_, idx) => (
                <span
                  key={idx}
                  className="h-1.5 flex-1 rounded-full transition-colors"
                  style={{
                    background: idx <= i ? "var(--d-accent)" : "var(--d-border)",
                  }}
                />
              ))}
            </div>

            <div className="px-5 pb-5 pt-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease }}
                >
                  <h3 className="text-xl font-bold tracking-tight text-[var(--d-fg)] sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--d-muted)]">{step.text}</p>
                  <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-[var(--d-accent)]/25 bg-[var(--d-accent)]/10 p-3">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--d-accent)]" />
                    <p className="text-[13px] font-medium text-[var(--d-fg)]">{step.action}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-5 flex items-center justify-between gap-2">
                <DemoActionButton
                  variant="ghost"
                  onClick={() => setI((v) => Math.max(0, v - 1))}
                  disabled={i === 0}
                >
                  <ChevronLeft className="h-4 w-4" /> Geri
                </DemoActionButton>
                <div className="flex items-center gap-2">
                  <DemoActionButton variant="ghost" onClick={onClose}>
                    Sunumu Bitir
                  </DemoActionButton>
                  {last ? (
                    <DemoActionButton variant="solid" onClick={onClose}>
                      <Check className="h-4 w-4" /> Tamamla
                    </DemoActionButton>
                  ) : (
                    <DemoActionButton variant="solid" onClick={() => setI((v) => Math.min(steps.length - 1, v + 1))}>
                      İleri <ChevronRight className="h-4 w-4" />
                    </DemoActionButton>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------ Contact / demo-request modal ------------------------------ */
const SECTORS = [
  "Berber & Kuaför",
  "Güzellik & Estetik",
  "Klinik / Sağlık",
  "Emlak",
  "Restoran & Kafe",
  "Diğer",
];

export function ContactModal({
  open,
  onClose,
  defaultSector = "Diğer",
}: {
  open: boolean;
  onClose: () => void;
  defaultSector?: string;
}) {
  const [form, setForm] = useState({ name: "", business: "", phone: "", sector: defaultSector, message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setForm((f) => ({ ...f, sector: defaultSector }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <DemoModal
      open={open}
      onClose={onClose}
      title={submitted ? "Talebiniz Alındı" : "Ücretsiz Demo Talep Et"}
      footer={
        submitted ? (
          <DemoActionButton variant="solid" onClick={onClose}>
            Kapat
          </DemoActionButton>
        ) : (
          <DemoActionButton variant="solid" onClick={() => setSubmitted(true)}>
            <Send className="h-4 w-4" /> Demo Talep Et
          </DemoActionButton>
        )
      }
    >
      {submitted ? (
        <div className="flex flex-col items-center py-6 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--d-pos)]/15 text-[var(--d-pos)]"
          >
            <Check className="h-8 w-8" strokeWidth={3} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-4"
          >
            <div className="text-[15px] font-semibold text-[var(--d-fg)]">
              Talebiniz başarıyla oluşturuldu.
            </div>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--d-muted)]">
              En kısa sürede sizinle iletişime geçeceğiz.
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField label="Ad Soyad" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Adınız Soyadınız" />
            <TextField label="İşletme Adı" value={form.business} onChange={(v) => setForm((f) => ({ ...f, business: v }))} placeholder="İşletmenizin adı" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField label="Telefon" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} placeholder="05__ ___ __ __" />
            <SelectField label="Sektör" value={form.sector} onChange={(v) => setForm((f) => ({ ...f, sector: v }))} options={SECTORS} />
          </div>
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-[var(--d-muted)]">Mesaj</span>
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              rows={3}
              placeholder="İhtiyacınızı kısaca yazın…"
              className="w-full resize-none rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5 text-[14px] text-[var(--d-fg)] outline-none transition-colors placeholder:text-[var(--d-faint)] focus:border-[var(--d-accent)]/60"
            />
          </label>
        </div>
      )}
    </DemoModal>
  );
}

/* ------------------------------ Premium closing CTA ------------------------------ */
export function DemoClosingCTA({
  defaultSector = "Diğer",
  serif = false,
}: {
  defaultSector?: string;
  serif?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const checks = ["İşletmenize özel tasarım", "Mobil uyumlu", "Hızlı teslimat", "Destek ve geliştirme"];

  return (
    <section className="px-4 py-20">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-[var(--d-border)] bg-[var(--d-surface)] px-6 py-12 sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-70"
          style={{ background: "radial-gradient(ellipse 60% 70% at 50% 0%, var(--d-ring), transparent 70%)" }}
        />
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-1 text-[12px] font-medium text-[var(--d-accent)]">
          <Sparkles className="h-3.5 w-3.5" /> Size Özel Kurulum
        </div>
        <h2
          className={cn(
            "mt-4 max-w-2xl text-balance text-2xl font-bold tracking-tight text-[var(--d-fg)] sm:text-3xl",
            serif && "[font-family:var(--font-demo-serif),Georgia,serif]",
          )}
        >
          Bu sistemi işletmeniz için özelleştirebiliriz.
        </h2>
        <p className="mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-[var(--d-muted)]">
          İşletmenizin ihtiyaçlarına göre tasarlanmış modern web siteleri, CRM sistemleri ve yapay
          zekâ destekli çözümler geliştiriyoruz.
        </p>
        <ul className="mt-6 grid max-w-xl grid-cols-1 gap-2.5 sm:grid-cols-2">
          {checks.map((c) => (
            <li key={c} className="flex items-center gap-2.5 text-[14px] text-[var(--d-fg)]">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--d-pos)]/15 text-[var(--d-pos)]">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              {c}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <DemoActionButton variant="solid" onClick={() => setOpen(true)} className="h-12 px-6">
            Ücretsiz Demo Talep Et
          </DemoActionButton>
          <a
            href={siteConfig.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-[#06210f] transition-transform hover:-translate-y-0.5"
          >
            WhatsApp ile İletişime Geç
          </a>
        </div>
      </div>

      <ContactModal open={open} onClose={() => setOpen(false)} defaultSector={defaultSector} />
    </section>
  );
}
