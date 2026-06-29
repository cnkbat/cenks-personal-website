import type { Metadata } from "next";
import { KuaforSite } from "@/components/demos/kuafor/KuaforSite";

export const metadata: Metadata = {
  title: "Kuaför OS — Berber & Kuaför Yönetim Sistemi",
  description:
    "Berber ve kuaförler için randevu, personel, müşteri ve gelir yönetimini tek panelde toplayan dijital işletme sistemi demosu.",
  alternates: { canonical: "/demos/kuafor-os" },
};

export default function Page() {
  return <KuaforSite />;
}
