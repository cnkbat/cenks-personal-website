import type { Metadata } from "next";
import { EstateSite } from "@/components/demos/estate/EstateSite";

export const metadata: Metadata = {
  title: "EstateOS — Emlak Yönetim Platformu",
  description:
    "Emlak ofisleri için portföy, ilan, lead takibi, danışman görevleri ve komisyon yönetimini tek panelde toplayan dijital işletme platformu demosu.",
  alternates: { canonical: "/demos/estate-os" },
};

export default function Page() {
  return <EstateSite />;
}
