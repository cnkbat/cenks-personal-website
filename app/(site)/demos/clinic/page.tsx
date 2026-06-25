import type { Metadata } from "next";
import { DemoDetail } from "@/components/sections/DemoDetail";

export const metadata: Metadata = {
  title: "Clinic Appointment System",
  description:
    "Klinikler için hekim takvimine entegre, otomatik onaylı online randevu sistemi demosu.",
};

export default function Page() {
  return <DemoDetail slug="clinic" />;
}
