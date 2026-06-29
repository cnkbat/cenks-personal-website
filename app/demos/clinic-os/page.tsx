import type { Metadata } from "next";
import { ClinicSite } from "@/components/demos/clinic/ClinicSite";

export const metadata: Metadata = {
  title: "ClinicOS — Klinik Randevu & Hasta Yönetimi",
  description:
    "Klinikler için hekim takvimi, hasta kayıtları, randevu akışı ve ödeme takibini tek panelde toplayan klinik yönetim sistemi demosu.",
  alternates: { canonical: "/demos/clinic-os" },
};

export default function Page() {
  return <ClinicSite />;
}
