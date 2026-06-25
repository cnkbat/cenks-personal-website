import type { Metadata } from "next";
import { DemoDetail } from "@/components/sections/DemoDetail";

export const metadata: Metadata = {
  title: "Real Estate Platform",
  description:
    "Emlak ofisleri için filtrelenebilir ilan vitrini ve portföy yönetim platformu demosu.",
};

export default function Page() {
  return <DemoDetail slug="real-estate" />;
}
