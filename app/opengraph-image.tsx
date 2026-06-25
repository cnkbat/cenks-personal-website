import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "Cenk Emir Bat — Premium Dijital Çözümler";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(900px 500px at 20% -10%, #1b1840 0%, transparent 60%), radial-gradient(800px 500px at 100% 110%, #0c2b33 0%, transparent 55%), #060711",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #7c5cff, #22d3ee)",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            CB
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>
            Cenk Emir Bat
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -1.5,
              maxWidth: 920,
              background: "linear-gradient(100deg, #ffffff, #c9c7ff, #7c5cff)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            İşletmeniz için premium dijital çözümler.
          </div>
          <div style={{ fontSize: 30, color: "#9aa1b4", maxWidth: 820 }}>
            Web Sitesi · CRM · Online Randevu · Dijital Büyüme
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            color: "#9aa1b4",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#22d3ee",
            }}
          />
          cenk-emir-bat.vercel.app
        </div>
      </div>
    ),
    { ...size },
  );
}
