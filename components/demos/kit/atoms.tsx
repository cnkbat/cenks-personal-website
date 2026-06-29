import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Presentational mockup primitives for the demo dashboards. All colors come
 * from the active demo theme via CSS vars (--d-*), so the same atom renders
 * correctly in every sector palette. Keep these free of client-only hooks.
 */

/* ------------------------------ frames ------------------------------ */

export function BrowserFrame({
  url = "app.demo",
  children,
  className,
}: {
  url?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--d-border)] bg-[var(--d-surface)] shadow-[0_40px_90px_-45px_rgba(0,0,0,0.55)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-[var(--d-border)] bg-[var(--d-bg-soft)] px-4 py-3">
        <span className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </span>
        <span className="mx-auto inline-flex items-center gap-1.5 rounded-md bg-[var(--d-surface-2)] px-3 py-1 text-[11px] font-medium text-[var(--d-faint)]">
          {url}
        </span>
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  );
}

export function PhoneFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[2.2rem] border border-[var(--d-border)] bg-[var(--d-surface)] p-2 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      <div className="overflow-hidden rounded-[1.7rem] border border-[var(--d-border)] bg-[var(--d-bg-soft)]">
        <div className="flex items-center justify-center pt-2.5">
          <span className="h-1 w-10 rounded-full bg-[var(--d-border)]" />
        </div>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------ panels ------------------------------ */

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--d-border)] bg-[var(--d-surface)] p-4",
        className,
      )}
    >
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {title && (
            <h4 className="text-[13px] font-semibold text-[var(--d-fg)]">
              {title}
            </h4>
          )}
          {action && (
            <span className="text-[11px] font-medium text-[var(--d-accent)]">
              {action}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatTile({
  label,
  value,
  delta,
  deltaUp = true,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  delta?: string;
  deltaUp?: boolean;
  icon?: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-[var(--d-border)] bg-[var(--d-surface)] p-4">
      <div className="flex items-center gap-2 text-[11px] font-medium text-[var(--d-muted)]">
        {Icon && (
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--d-accent)]/15 text-[var(--d-accent)]">
            <Icon className="h-3.5 w-3.5" />
          </span>
        )}
        {label}
      </div>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-2xl font-semibold tracking-tight text-[var(--d-fg)]">
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              "mb-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
              deltaUp
                ? "bg-[var(--d-pos)]/15 text-[var(--d-pos)]"
                : "bg-[var(--d-neg)]/15 text-[var(--d-neg)]",
            )}
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ charts ------------------------------ */

export function MiniBars({
  data,
  className,
  highlightLast = true,
}: {
  data: number[];
  className?: string;
  highlightLast?: boolean;
}) {
  const max = Math.max(...data, 1);
  return (
    <div className={cn("flex items-end gap-1.5", className)}>
      {data.map((v, i) => {
        const isLast = i === data.length - 1;
        return (
          <span
            key={i}
            className="flex-1 rounded-t-sm"
            style={{
              height: `${Math.max(8, (v / max) * 100)}%`,
              background:
                highlightLast && isLast
                  ? "var(--d-accent)"
                  : "color-mix(in srgb, var(--d-accent) 38%, transparent)",
            }}
          />
        );
      })}
    </div>
  );
}

export function Sparkline({
  data,
  className,
  width = 120,
  height = 36,
}: {
  data: number[];
  className?: string;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / span) * (height - 6) - 3;
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ");
  const id = `spk-${data.join("-").slice(0, 24)}`;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("w-full", className)}
      fill="none"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--d-accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--d-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M ${line}`}
        stroke="var(--d-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M ${line} L ${width} ${height} L 0 ${height} Z`}
        fill={`url(#${id})`}
      />
    </svg>
  );
}

export function Donut({
  value,
  size = 64,
  label,
}: {
  value: number; // 0-100
  size?: number;
  label?: string;
}) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--d-border)"
          strokeWidth="6"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--d-accent)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
        />
      </svg>
      <span className="absolute text-[12px] font-semibold text-[var(--d-fg)]">
        {label ?? `${value}%`}
      </span>
    </div>
  );
}

export function Bar({ value, className }: { value: number; className?: string }) {
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-[var(--d-border)]",
        className,
      )}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: "var(--d-accent)",
        }}
      />
    </div>
  );
}

/* ------------------------------ bits ------------------------------ */

export function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-[var(--d-accent-fg)]",
        className,
      )}
      style={{
        background: "linear-gradient(135deg,var(--d-accent),var(--d-accent-2))",
      }}
    >
      {initials}
    </span>
  );
}

type TagTone = "accent" | "soft" | "success" | "warn" | "danger";

const tagTones: Record<TagTone, string> = {
  accent: "bg-[var(--d-accent)]/15 text-[var(--d-accent)]",
  soft: "bg-[var(--d-surface-2)] text-[var(--d-muted)] border border-[var(--d-border)]",
  success: "bg-[var(--d-pos)]/15 text-[var(--d-pos)]",
  warn: "bg-[var(--d-warn)]/15 text-[var(--d-warn)]",
  danger: "bg-[var(--d-neg)]/15 text-[var(--d-neg)]",
};

export function Tag({
  children,
  tone = "soft",
  className,
}: {
  children: ReactNode;
  tone?: TagTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
        tagTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
