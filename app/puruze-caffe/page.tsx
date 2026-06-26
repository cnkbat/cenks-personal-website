import type { Metadata } from "next";
import { PuruzeSite } from "@/components/puruze/PuruzeSite";

export const metadata: Metadata = {
  title: "Püruze Caffe | Kuzguncuk Kahvaltı, Kahve & Tatlı",
  description:
    "Kuzguncuk'ta kahvaltı, kahve ve tatlı keyfi için sıcak, samimi ve modern bir mahalle kafesi. Hafta sonu kahvaltı, özel kahveler, ev yapımı tatlılar ve pet-friendly bir ortam.",
  keywords: [
    "Püruze Caffe",
    "Kuzguncuk kafe",
    "Kuzguncuk kahvaltı",
    "Üsküdar kahvaltı",
    "Kuzguncuk kahve",
    "İstanbul mahalle kafesi",
    "pet friendly kafe",
    "Kuzguncuk tatlı",
  ],
  alternates: { canonical: "/puruze-caffe" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    title: "Püruze Caffe | Kuzguncuk Kahvaltı, Kahve & Tatlı",
    description:
      "Kuzguncuk'ta kahvaltı, kahve ve tatlı keyfi için sıcak, samimi ve modern bir mahalle kafesi.",
    images: ["/puruze/puruze-hero.webp"],
  },
};

export default function Page() {
  return <PuruzeSite />;
}
