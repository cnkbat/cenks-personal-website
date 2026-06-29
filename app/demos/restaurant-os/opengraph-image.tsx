import { demoOgImage } from "@/lib/demos/og";
import { demoThemes } from "@/lib/demos/themes";

export const dynamic = "force-static";
export const alt = "RestaurantOS — Restoran & Kafe Yönetim Sistemi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return demoOgImage({
    name: "RestaurantOS",
    sector: "Restoran & Kafe Yönetim Sistemi",
    theme: demoThemes.restaurant,
  });
}
