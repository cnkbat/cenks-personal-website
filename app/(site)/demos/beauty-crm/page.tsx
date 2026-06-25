import type { Metadata } from "next";
import { DemoDetail } from "@/components/sections/DemoDetail";

export const metadata: Metadata = {
  title: "Beauty Clinic CRM",
  description:
    "Güzellik kliniği için müşteri, randevu ve satış takibini tek panelde toplayan özel CRM demosu.",
};

export default function Page() {
  return <DemoDetail slug="beauty-crm" />;
}
