import { demoOgImage } from "@/lib/demos/og";
import { demoThemes } from "@/lib/demos/themes";

export const dynamic = "force-static";
export const alt = "EstateOS — Emlak Yönetim Platformu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return demoOgImage({
    name: "EstateOS",
    sector: "Emlak Yönetim Platformu",
    theme: demoThemes.estate,
  });
}
