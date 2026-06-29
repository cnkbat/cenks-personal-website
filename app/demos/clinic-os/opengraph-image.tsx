import { demoOgImage } from "@/lib/demos/og";
import { demoThemes } from "@/lib/demos/themes";

export const dynamic = "force-static";
export const alt = "ClinicOS — Klinik & Hasta Yönetim Sistemi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return demoOgImage({
    name: "ClinicOS",
    sector: "Klinik & Hasta Yönetim Sistemi",
    theme: demoThemes.clinic,
  });
}
