import type { CSSProperties } from "react";

/**
 * Each sector demo is a standalone, self-themed page (mirrors the Püruze
 * pattern). A theme is expressed purely as CSS custom properties so the shared
 * demo kit (components/demos/kit) can render any sector palette without
 * per-sector copies. Apply with `style={themeVars(theme)}` on the page shell;
 * kit components read the vars via Tailwind arbitrary values, e.g.
 * `bg-[var(--d-bg)]`, `text-[var(--d-fg)]`, `border-[var(--d-border)]`.
 */
export type DemoTheme = {
  scheme: "dark" | "light";
  bg: string; // page background
  bgSoft: string; // alternating section background
  surface: string; // primary card background
  surface2: string; // nested panel background
  border: string; // hairline borders
  fg: string; // primary text
  muted: string; // secondary text
  faint: string; // tertiary text / captions
  accent: string; // primary brand accent
  accent2: string; // secondary accent (gradients, hovers)
  accentFg: string; // text/icon color on top of accent fills
  ring: string; // glow color (rgba) for ambient lights
  pos: string; // positive/success text (tuned per scheme for contrast)
  warn: string; // warning text
  neg: string; // negative/danger text
};

export const demoThemes = {
  // Kuaför OS — premium masculine salon: graphite / black / warm gold
  kuafor: {
    scheme: "dark",
    bg: "#0b0c0f",
    bgSoft: "#101216",
    surface: "#16181e",
    surface2: "#1c1f26",
    border: "rgba(255,255,255,0.08)",
    fg: "#f5f5f6",
    muted: "#a6a8b0",
    faint: "#71747d",
    accent: "#d4af37",
    accent2: "#e9cd6b",
    accentFg: "#1a1505",
    ring: "rgba(212,175,55,0.30)",
    pos: "#34d399",
    warn: "#fbbf24",
    neg: "#fb7185",
  },
  // Beauty Center CRM — luxury beige / cream / soft gold spa
  beauty: {
    scheme: "light",
    bg: "#faf5ee",
    bgSoft: "#f3e9dc",
    surface: "#ffffff",
    surface2: "#fbf5ec",
    border: "rgba(63,46,30,0.12)",
    fg: "#2c2118",
    muted: "#6f5f4f",
    faint: "#9b8a76",
    accent: "#c19a5b",
    accent2: "#d9b87e",
    accentFg: "#ffffff",
    ring: "rgba(193,154,91,0.28)",
    pos: "#059669",
    warn: "#b45309",
    neg: "#be123c",
  },
  // ClinicOS — clean medical SaaS: white / blue / soft gray
  clinic: {
    scheme: "light",
    bg: "#f5f8fc",
    bgSoft: "#eaf1f9",
    surface: "#ffffff",
    surface2: "#f3f7fc",
    border: "rgba(18,43,72,0.10)",
    fg: "#0f2236",
    muted: "#566472",
    faint: "#8a97a5",
    accent: "#2f7fe6",
    accent2: "#5aa0f2",
    accentFg: "#ffffff",
    ring: "rgba(47,127,230,0.22)",
    pos: "#059669",
    warn: "#b45309",
    neg: "#be123c",
  },
  // EstateOS — premium real estate: dark navy / white / subtle gold
  estate: {
    scheme: "dark",
    bg: "#0a1120",
    bgSoft: "#0e172b",
    surface: "#121d34",
    surface2: "#17233f",
    border: "rgba(255,255,255,0.09)",
    fg: "#eef2fb",
    muted: "#9fb0cb",
    faint: "#6f819e",
    accent: "#d8b25c",
    accent2: "#ecca7e",
    accentFg: "#14100a",
    ring: "rgba(216,178,92,0.26)",
    pos: "#34d399",
    warn: "#fbbf24",
    neg: "#fb7185",
  },
  // RestaurantOS — warm, premium: dark background, amber/gold food lighting
  restaurant: {
    scheme: "dark",
    bg: "#110c09",
    bgSoft: "#1a120c",
    surface: "#1f1610",
    surface2: "#261b13",
    border: "rgba(255,255,255,0.08)",
    fg: "#f6efe6",
    muted: "#c3ac98",
    faint: "#8f7c6a",
    accent: "#e8a23d",
    accent2: "#f4c069",
    accentFg: "#1a1006",
    ring: "rgba(232,162,61,0.30)",
    pos: "#34d399",
    warn: "#fbbf24",
    neg: "#fb7185",
  },
} satisfies Record<string, DemoTheme>;

export type DemoThemeKey = keyof typeof demoThemes;

export function themeVars(theme: DemoTheme): CSSProperties {
  return {
    "--d-bg": theme.bg,
    "--d-bg-soft": theme.bgSoft,
    "--d-surface": theme.surface,
    "--d-surface-2": theme.surface2,
    "--d-border": theme.border,
    "--d-fg": theme.fg,
    "--d-muted": theme.muted,
    "--d-faint": theme.faint,
    "--d-accent": theme.accent,
    "--d-accent-2": theme.accent2,
    "--d-accent-fg": theme.accentFg,
    "--d-ring": theme.ring,
    "--d-pos": theme.pos,
    "--d-warn": theme.warn,
    "--d-neg": theme.neg,
  } as CSSProperties;
}
