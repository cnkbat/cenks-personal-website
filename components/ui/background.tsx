"use client";

import { useMemo } from "react";

/**
 * Site-wide ambient background: deep gradient base, layered radial lights,
 * animated blobs and a faint grid. Rendered once, fixed behind all content.
 * Tuned to add depth and life without ever distracting from the content.
 */
export function SiteBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[var(--bg)]" />

      {/* Soft purple ambient glow from the top */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-15%,rgba(124,92,255,0.22),transparent_60%)]" />
      {/* Blue gradient lighting from the lower right */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_85%_100%,rgba(34,211,238,0.14),transparent_60%)]" />
      {/* Magenta accent from the lower left */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_8%_90%,rgba(232,121,249,0.1),transparent_60%)]" />

      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-70" />

      {/* Animated floating blobs */}
      <div
        className="blob glow-pulse"
        style={{
          top: "-12%",
          left: "-6%",
          width: "46vw",
          height: "46vw",
          background:
            "radial-gradient(circle at 30% 30%, rgba(124,92,255,0.6), transparent 70%)",
        }}
      />
      <div
        className="blob"
        style={{
          top: "18%",
          right: "-12%",
          width: "42vw",
          height: "42vw",
          background:
            "radial-gradient(circle at 50% 50%, rgba(34,211,238,0.4), transparent 70%)",
          animationDelay: "-7s",
        }}
      />
      <div
        className="blob"
        style={{
          top: "120%",
          left: "16%",
          width: "40vw",
          height: "40vw",
          background:
            "radial-gradient(circle at 50% 50%, rgba(232,121,249,0.3), transparent 70%)",
          animationDelay: "-13s",
        }}
      />
      <div
        className="blob"
        style={{
          top: "60%",
          left: "40%",
          width: "34vw",
          height: "34vw",
          background:
            "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.28), transparent 70%)",
          animationDelay: "-4s",
        }}
      />

      {/* Subtle vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_55%,rgba(0,0,0,0.45))]" />
    </div>
  );
}

/**
 * Floating particle field — subtle drifting dots, used inside the hero.
 */
export function Particles({ count = 22 }: { count?: number }) {
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
          bottom: `${Math.round(rand2 * 45)}%`,
          bright: i % 4 === 0,
        };
      }),
    [count],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
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
            background: p.bright
              ? "rgba(167,196,255,0.85)"
              : "rgba(190,198,255,0.6)",
            boxShadow: p.bright ? "0 0 6px 1px rgba(124,92,255,0.5)" : "none",
          }}
        />
      ))}
    </div>
  );
}
