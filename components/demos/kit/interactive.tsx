"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { Check, Search, X, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

/* localStorage-backed state (SSR-safe: renders `initial`, hydrates from storage after mount). */
export function usePersistentState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial);
  const loaded = useRef(false);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) setState(JSON.parse(raw) as T);
    } catch {}
    loaded.current = true;
  }, [key]);
  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState] as const;
}

/** WhatsApp link with a pre-filled Turkish message naming the demo. */
export function demoWhatsAppLink(demoName: string) {
  const msg = `Merhaba, web sitenizdeki ${demoName} demosunu gördüm. İşletmem için benzer bir sistem hakkında bilgi almak istiyorum.`;
  return `${siteConfig.whatsapp}?text=${encodeURIComponent(msg)}`;
}

const ease = [0.22, 1, 0.36, 1] as const;

/* ------------------------------ Toasts ------------------------------ */
type ToastTone = "default" | "success" | "warn" | "danger";
type ToastInput = string | { title: string; desc?: string; tone?: ToastTone; icon?: LucideIcon };
type Toast = { id: number; title: string; desc?: string; tone: ToastTone; icon?: LucideIcon };

const toneText: Record<ToastTone, string> = {
  default: "text-[var(--d-accent)]",
  success: "text-[var(--d-pos)]",
  warn: "text-[var(--d-warn)]",
  danger: "text-[var(--d-neg)]",
};

const ToastCtx = createContext<(t: ToastInput) => void>(() => {});

/** Imperative toast trigger available to any component inside a DemoShell. */
export function useDemoToast() {
  return useContext(ToastCtx);
}

export function DemoToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const push = useCallback((input: ToastInput) => {
    const base = typeof input === "string" ? { title: input } : input;
    const id = (idRef.current += 1);
    const toast: Toast = { id, tone: "default", ...base };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-24 right-4 z-[60] flex w-[min(20rem,calc(100vw-2rem))] flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = t.icon ?? Check;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 40, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.96 }}
                transition={{ duration: 0.32, ease }}
                className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-[var(--d-border)] bg-[var(--d-surface)] p-3 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)]"
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--d-surface-2)]",
                    toneText[t.tone],
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-[var(--d-fg)]">{t.title}</div>
                  {t.desc && (
                    <div className="mt-0.5 text-[12px] leading-snug text-[var(--d-muted)]">
                      {t.desc}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

/* ------------------------------ Modal ------------------------------ */
export function DemoModal({
  open,
  onClose,
  title,
  children,
  footer,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center"
        >
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.3, ease }}
            className={cn(
              "relative w-full overflow-hidden rounded-3xl border border-[var(--d-border)] bg-[var(--d-surface)] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.7)]",
              maxWidth,
            )}
          >
            <div className="flex items-center justify-between border-b border-[var(--d-border)] px-5 py-4">
              <div className="text-[15px] font-semibold text-[var(--d-fg)]">{title}</div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Kapat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--d-muted)] transition-colors hover:bg-[var(--d-surface-2)] hover:text-[var(--d-fg)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 py-4">{children}</div>
            {footer && (
              <div className="flex justify-end gap-2 border-t border-[var(--d-border)] px-5 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* --------------------------- Confirm dialog --------------------------- */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Onayla",
  cancelLabel = "Vazgeç",
  tone = "danger",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "accent";
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <DemoModal
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="max-w-sm"
      footer={
        <>
          <DemoActionButton variant="ghost" onClick={onClose}>
            {cancelLabel}
          </DemoActionButton>
          <DemoActionButton
            variant={tone === "danger" ? "danger" : "solid"}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </DemoActionButton>
        </>
      }
    >
      <p className="text-[14px] leading-relaxed text-[var(--d-muted)]">{message}</p>
    </DemoModal>
  );
}

/* ------------------------------ Buttons ------------------------------ */
type BtnVariant = "solid" | "ghost" | "danger" | "soft";
const actionBtn: Record<BtnVariant, string> = {
  solid: "bg-[var(--d-accent)] text-[var(--d-accent-fg)] hover:brightness-105",
  soft: "bg-[var(--d-surface-2)] text-[var(--d-fg)] border border-[var(--d-border)] hover:border-[var(--d-accent)]/50",
  ghost: "text-[var(--d-muted)] hover:bg-[var(--d-surface-2)] hover:text-[var(--d-fg)]",
  danger: "bg-[var(--d-neg)]/15 text-[var(--d-neg)] hover:bg-[var(--d-neg)]/25",
};

export function DemoActionButton({
  children,
  onClick,
  variant = "soft",
  type = "button",
  className,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: BtnVariant;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition-all active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
        actionBtn[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function IconButton({
  icon: Icon,
  label,
  onClick,
  tone = "default",
  className,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  tone?: "default" | "success" | "danger";
  className?: string;
}) {
  const tones = {
    default: "text-[var(--d-muted)] hover:bg-[var(--d-surface-2)] hover:text-[var(--d-fg)]",
    success: "text-[var(--d-pos)] hover:bg-[var(--d-pos)]/15",
    danger: "text-[var(--d-neg)] hover:bg-[var(--d-neg)]/15",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
        tones[tone],
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

/* ------------------------------- Tabs ------------------------------- */
export function Tabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { id: string; label: ReactNode }[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex flex-wrap gap-1 rounded-full border border-[var(--d-border)] bg-[var(--d-surface-2)] p-1",
        className,
      )}
    >
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={cn(
              "relative rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors",
              active ? "text-[var(--d-accent-fg)]" : "text-[var(--d-muted)] hover:text-[var(--d-fg)]",
            )}
          >
            {active && (
              <motion.span
                layoutId="demo-tab-pill"
                className="absolute inset-0 -z-10 rounded-full bg-[var(--d-accent)]"
                transition={{ duration: 0.3, ease }}
              />
            )}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------- Animated number --------------------------- */
export function DemoCounter({
  value,
  format,
  className,
}: {
  value: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration: 0.6,
      ease,
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value]);

  return <span className={className}>{format ? format(display) : Math.round(display).toString()}</span>;
}

/* ------------------------------ Skeleton ------------------------------ */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-[var(--d-surface-2)]", className)} />;
}

/* ------------------------------ Inputs ------------------------------ */
export function SearchInput({
  value,
  onChange,
  placeholder = "Ara…",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--d-faint)]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-[var(--d-border)] bg-[var(--d-surface-2)] py-2 pl-9 pr-3 text-[13px] text-[var(--d-fg)] outline-none transition-colors placeholder:text-[var(--d-faint)] focus:border-[var(--d-accent)]/60"
      />
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-[var(--d-muted)]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5 text-[14px] text-[var(--d-fg)] outline-none transition-colors placeholder:text-[var(--d-faint)] focus:border-[var(--d-accent)]/60"
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-[var(--d-muted)]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5 text-[14px] text-[var(--d-fg)] outline-none transition-colors focus:border-[var(--d-accent)]/60"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ------------------------- Filter chips ------------------------- */
export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        checked ? "bg-[var(--d-accent)]" : "border border-[var(--d-border)] bg-[var(--d-surface-2)]",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
          checked ? "left-[1.375rem]" : "left-0.5",
        )}
      />
    </button>
  );
}

export function FilterChips({
  options,
  value,
  onChange,
  className,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={cn(
              "rounded-full px-3 py-1 text-[11.5px] font-semibold transition-colors",
              active
                ? "bg-[var(--d-accent)] text-[var(--d-accent-fg)]"
                : "border border-[var(--d-border)] text-[var(--d-muted)] hover:text-[var(--d-fg)]",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
