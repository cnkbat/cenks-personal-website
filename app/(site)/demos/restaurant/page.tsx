import type { Metadata } from "next";
import { DemoDetail } from "@/components/sections/DemoDetail";

export const metadata: Metadata = {
  title: "Restaurant Website",
  description:
    "Restoran ve kafeler için dijital menü, online rezervasyon ve sipariş yönlendirmeli web sitesi demosu.",
};

export default function Page() {
  return <DemoDetail slug="restaurant" />;
}
