import { ImageResponse } from "next/og";
import type { DemoTheme } from "./themes";

/**
 * Branded, code-rendered Open Graph image (1200×630) for a sector demo.
 * Each demo's `opengraph-image.tsx` calls this with its name + sector + theme,
 * so link previews are crisp, on-brand and per-sector colored (no AI text).
 */
export function demoOgImage({
  name,
  sector,
  theme,
}: {
  name: string;
  sector: string;
  theme: DemoTheme;
}) {
  const { bg, fg, muted, accent, accent2, accentFg, ring } = theme;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: `radial-gradient(900px 520px at 12% -12%, ${ring}, transparent 60%), radial-gradient(820px 540px at 106% 116%, ${ring}, transparent 55%), ${bg}`,
          color: fg,
          fontFamily: "sans-serif",
        }}
      >
        {/* brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${accent}, ${accent2})`,
              color: accentFg,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            CB
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: fg }}>Cenk Emir Bat</div>
            <div style={{ fontSize: 18, color: muted }}>{sector}</div>
          </div>
        </div>

        {/* title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 92,
              fontWeight: 800,
              letterSpacing: -2.5,
              lineHeight: 1.02,
              color: fg,
            }}
          >
            {name}
          </div>
          <div style={{ fontSize: 30, color: muted, maxWidth: 920 }}>
            Sektöre özel dijital işletme sistemi · canlı panel demosu
          </div>
        </div>

        {/* footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 22px",
              borderRadius: 999,
              background: `${accent}26`,
              color: accent,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 999, background: accent }} />
            Demoyu Aç
          </div>
          <div style={{ fontSize: 24, color: muted }}>cenk-emir-bat.vercel.app</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
