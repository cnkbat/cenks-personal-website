import { demoOgImage } from "@/lib/demos/og";
import { demoThemes } from "@/lib/demos/themes";

export const dynamic = "force-static";
export const alt = "Beauty Center CRM — Güzellik & Estetik Merkezi CRM";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return demoOgImage({
    name: "Beauty Center CRM",
    sector: "Güzellik & Estetik Merkezi CRM",
    theme: demoThemes.beauty,
  });
}
