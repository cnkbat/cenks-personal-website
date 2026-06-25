import { Hero } from "@/components/sections/Hero";
import { BusinessValue } from "@/components/sections/BusinessValue";
import { Services } from "@/components/sections/Services";
import { Demos } from "@/components/sections/Demos";
import { Packages } from "@/components/sections/Packages";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BusinessValue />
      <Services />
      <Demos />
      <Packages />
      <About />
      <Contact />
    </>
  );
}
