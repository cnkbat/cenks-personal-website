import type { Metadata } from "next";
import { BeautySite } from "@/components/demos/beauty/BeautySite";

export const metadata: Metadata = {
  title: "Beauty Center CRM — Güzellik & Estetik CRM",
  description:
    "Güzellik ve estetik merkezleri için müşteri, randevu, paket ve seans takibini tek panelde toplayan CRM demosu.",
  alternates: { canonical: "/demos/beauty-center-crm" },
};

export default function Page() {
  return <BeautySite />;
}
