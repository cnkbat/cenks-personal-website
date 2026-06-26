"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import {
  DemoRibbon,
  MAPS,
  MENU,
  MobileCtaBar,
  PaperTexture,
  PHONE_TEL,
  PuruzeFooter,
  PuruzeHeader,
  Reveal,
  serif,
} from "@/components/puruze/shared";

export function PuruzeMenu() {
  return (
    <div
      className={`${serif.variable} relative min-h-screen bg-[#FBF6EE] text-[#2A1E16] antialiased`}
      style={{ fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif" }}
    >
      <PaperTexture />
      <DemoRibbon />
      <PuruzeHeader />

      <main className="relative z-10">
        {/* intro */}
        <section className="px-4 pt-12 pb-6 text-center sm:pt-16">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/puruze-caffe"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#8a7868] transition-colors hover:text-[#B85C38]"
            >
              <ArrowLeft className="h-4 w-4" />
              Ana sayfaya dön
            </Link>
            <span className="mt-6 block text-[12px] font-semibold uppercase tracking-[0.25em] text-[#B85C38]">
              Menü
            </span>
            <h1
              className="mt-3 text-4xl font-semibold text-[#2A1E16] sm:text-5xl"
              style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
            >
              Püruze Caffe Menüsü
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#5b4a3d]">
              Kahvaltıdan kahveye, tatlıdan hafif yemeklere; gün boyu size eşlik
              edecek lezzetlerimiz.
            </p>
          </div>
        </section>

        {/* sticky category nav (horizontal scroll on mobile) */}
        <div className="sticky top-[56px] z-20 border-y border-[#2A1E16]/10 bg-[#FBF6EE]/90 backdrop-blur-md">
          <div className="mx-auto max-w-4xl overflow-x-auto px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max items-center justify-start gap-2 sm:justify-center">
              {MENU.map((g) => {
                const Icon = g.icon;
                return (
                  <a
                    key={g.id}
                    href={`#${g.id}`}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#2A1E16]/12 bg-white/70 px-4 py-2 text-sm font-medium text-[#5b4a3d] transition-colors hover:border-[#B85C38]/40 hover:text-[#B85C38]"
                  >
                    <Icon className="h-4 w-4" />
                    {g.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* menu sections */}
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          {MENU.map((g) => {
            const Icon = g.icon;
            return (
              <section key={g.id} id={g.id} className="scroll-mt-32 py-8 first:pt-2">
                <Reveal>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B85C38]/12 text-[#B85C38]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h2
                      className="text-2xl font-semibold text-[#2A1E16] sm:text-3xl"
                      style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
                    >
                      {g.label}
                    </h2>
                  </div>
                </Reveal>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {g.items.map((it, i) => (
                    <Reveal key={it.name} delay={(i % 2) * 0.05}>
                      <div className="h-full rounded-2xl border border-[#2A1E16]/10 bg-white/70 p-5 shadow-[0_10px_30px_-22px_rgba(42,30,22,0.6)] transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(42,30,22,0.55)]">
                        <div className="flex items-baseline justify-between gap-4">
                          <h3 className="text-[15px] font-semibold text-[#2A1E16]">
                            {it.name}
                          </h3>
                          <span className="shrink-0 text-[15px] font-semibold text-[#B85C38]">
                            {it.price}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#5b4a3d]">
                          {it.desc}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </section>
            );
          })}

          <p className="mt-4 text-center text-[12px] italic text-[#8a7868]">
            * Görseller ve fiyatlar demo amaçlı örnek içeriktir.
          </p>

          {/* CTA */}
          <Reveal>
            <div className="mt-10 overflow-hidden rounded-[2rem] bg-[#2A1E16] px-6 py-10 text-center text-[#FBF6EE]">
              <h2
                className="text-2xl font-semibold sm:text-3xl"
                style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
              >
                Sizi Kuzguncuk’ta ağırlamaktan mutluluk duyarız
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-[#EADBC8]/80">
                Yer ayırtmak veya bilgi almak için bize ulaşın.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B85C38] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                >
                  <Phone className="h-4 w-4" />
                  Rezervasyon / Ara
                </a>
                <a
                  href={MAPS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                >
                  <MapPin className="h-4 w-4" />
                  Yol Tarifi Al
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <PuruzeFooter />
      </main>

      <MobileCtaBar />
    </div>
  );
}
