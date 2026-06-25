"use client";

import { useMemo } from "react";

/**
 * Site-wide ambient background: deep gradient base, animated blobs and a
 * faint grid. Rendered once, fixed behind all content.
 */
export function SiteBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[var(--bg)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(124,92,255,0.18),transparent_60%)]" />
      <div className="absolute inset-0 grid-bg opacity-60" />

      <div
        className="blob"
        style={{
          top: "-10%",
          left: "-5%",
          width: "44vw",
          height: "44vw",
          background:
            "radial-gradient(circle at 30% 30%, rgba(124,92,255,0.55), transparent 70%)",
        }}
      />
      <div
        className="blob"
        style={{
          top: "20%",
          right: "-10%",
          width: "40vw",
          height: "40vw",
          background:
            "radial-gradient(circle at 50% 50%, rgba(34,211,238,0.35), transparent 70%)",
          animationDelay: "-6s",
        }}
      />
      <div
        className="blob"
        style={{
          bottom: "-15%",
          left: "20%",
          width: "38vw",
          height: "38vw",
          background:
            "radial-gradient(circle at 50% 50%, rgba(232,121,249,0.28), transparent 70%)",
          animationDelay: "-12s",
        }}
      />
    </div>
  );
}

/**
 * Floating particle field — subtle drifting dots, used inside the hero.
 */
export function Particles({ count = 18 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // Deterministic pseudo-random spread (no Math.random for SSR safety).
        const seed = (i * 9301 + 49297) % 233280;
        const rand = seed / 233280;
        const seed2 = (i * 4096 + 150889) % 714025;
        const rand2 = seed2 / 714025;
        return {
          left: `${Math.round(rand * 100)}%`,
          size: 1.5 + rand2 * 2.5,
          duration: 9 + rand * 12,
          delay: -rand2 * 12,
          bottom: `${Math.round(rand2 * 40)}%`,
        };
      }),
    [count],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
