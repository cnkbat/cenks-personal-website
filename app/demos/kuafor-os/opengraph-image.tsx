import { demoOgImage } from "@/lib/demos/og";
import { demoThemes } from "@/lib/demos/themes";

export const dynamic = "force-static";
export const alt = "Kuaför OS — Berber & Kuaför Yönetim Sistemi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return demoOgImage({
    name: "Kuaför OS",
    sector: "Berber & Kuaför Yönetim Sistemi",
    theme: demoThemes.kuafor,
  });
}
