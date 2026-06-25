import type { Metadata } from "next";
import { DemoDetail } from "@/components/sections/DemoDetail";

export const metadata: Metadata = {
  title: "Barber Website",
  description:
    "Berber ve kuaförler için online randevu alan modern web sitesi demosu.",
};

export default function Page() {
  return <DemoDetail slug="barber" />;
}
