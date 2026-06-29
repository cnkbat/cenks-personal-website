import type { Metadata } from "next";
import { RestaurantSite } from "@/components/demos/restaurant/RestaurantSite";

export const metadata: Metadata = {
  title: "RestaurantOS — Restoran & Kafe Yönetim Sistemi",
  description:
    "Restoran ve kafeler için dijital menü, QR sipariş, online rezervasyon ve masa yönetimini tek panelde toplayan işletme sistemi demosu.",
  alternates: { canonical: "/demos/restaurant-os" },
};

export default function Page() {
  return <RestaurantSite />;
}
