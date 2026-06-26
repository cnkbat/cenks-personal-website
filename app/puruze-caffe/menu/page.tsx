import type { Metadata } from "next";
import { PuruzeMenu } from "@/components/puruze/PuruzeMenu";

export const metadata: Metadata = {
  title: "Menü | Püruze Caffe — Kuzguncuk Kahvaltı, Kahve & Tatlı",
  description:
    "Püruze Caffe menüsü: zengin kahvaltı, özenle demlenen kahveler, ev yapımı tatlılar, soğuk içecekler ve hafif yemekler. Kuzguncuk, Üsküdar.",
  alternates: { canonical: "/puruze-caffe/menu" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    title: "Menü | Püruze Caffe",
    description:
      "Püruze Caffe menüsü: kahvaltı, kahve, tatlı, soğuk içecekler ve hafif yemekler.",
    images: ["/puruze/puruze-breakfast.webp"],
  },
};

export default function Page() {
  return <PuruzeMenu />;
}
