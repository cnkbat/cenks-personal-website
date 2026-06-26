"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Coffee,
  Instagram,
  MapPin,
  Phone,
  Quote,
  Star,
  Sun,
  UtensilsCrossed,
} from "lucide-react";
import {
  ADDRESS,
  DemoRibbon,
  ease,
  INSTAGRAM,
  MAPS,
  MENU,
  MENU_HREF,
  MobileCtaBar,
  PaperTexture,
  PHONE_DISPLAY,
  PHONE_TEL,
  PuruzeFooter,
  PuruzeHeader,
  Reveal,
  serif,
} from "@/components/puruze/shared";

/* ------------------------------ reviews (demo) -------------------------- */
const REVIEWS = [
  {
    name: "Elif K.",
    text: "Kuzguncuk'a her gelişimde uğramadan dönmüyorum. Kahvaltısı bol, çayı bitmiyor, ortam çok sıcak.",
  },
  {
    name: "Mert A.",
    text: "Cheesecake'i şehirde yediğim en iyilerden. Personel güler yüzlü, kahve gerçekten kaliteli.",
  },
  {
    name: "Deniz Y.",
    text: "Köpeğimle rahatça oturabildiğim, huzurlu bir mahalle kafesi. Hafta sonu kahvaltısı bir başka.",
  },
  {
    name: "Selin T.",
    text: "Samimi, nostaljik ve şık. Sabah güneşinde filtre kahve içmek için ideal bir köşe.",
  },
];

const GALLERY = [
  { src: "/puruze/puruze-interior.webp", alt: "Püruze Caffe sıcak iç mekan" },
  { src: "/puruze/puruze-breakfast.webp", alt: "Zengin serpme kahvaltı" },
  { src: "/puruze/puruze-coffee.webp", alt: "Özenle hazırlanan kahve" },
  { src: "/puruze/puruze-dessert.webp", alt: "Ev yapımı tatlılar" },
  { src: "/puruze/puruze-exterior.webp", alt: "Kuzguncuk sokağında kafe dış görünüm" },
  { src: "/puruze/puruze-pet.webp", alt: "Pet-friendly rahat köşe" },
];

export function PuruzeSite() {
  return (
    <div
      className={`${serif.variable} relative min-h-screen bg-[#FBF6EE] text-[#2A1E16] antialiased`}
      style={{ fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif" }}
    >
      <PaperTexture />
      <DemoRibbon />
      <PuruzeHeader onHome />

      <main id="top" className="relative z-10">
        {/* ------------------------------ HERO ------------------------------ */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/puruze/puruze-hero.webp"
              alt="Püruze Caffe sıcak atmosfer"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A1E16]/90 via-[#2A1E16]/55 to-[#2A1E16]/35" />
          </div>

          <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-20 pt-28 sm:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease }}
              className="max-w-2xl"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[12px] font-medium uppercase tracking-[0.2em] text-[#F3E7D6] backdrop-blur-sm">
                <MapPin className="h-3.5 w-3.5" />
                Kuzguncuk · Üsküdar
              </span>
              <h1
                className="mt-5 text-balance text-4xl font-semibold leading-[1.08] text-[#FBF6EE] sm:text-5xl md:text-6xl"
                style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
              >
                Kuzguncuk’un kalbinde sıcak bir kahve molası
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-[#EADBC8] sm:text-lg">
                Bol kahvaltı, özenle demlenen kahveler, ev yapımı tatlılar ve
                mahalleye özgü o samimi sıcaklık. Püruze Caffe’de her an huzurlu.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={MENU_HREF}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B85C38] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03]"
                >
                  <UtensilsCrossed className="h-4 w-4" />
                  Menüyü İncele
                </Link>
                <a
                  href={MAPS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <MapPin className="h-4 w-4" />
                  Yol Tarifi Al
                </a>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <Phone className="h-4 w-4" />
                  Rezervasyon / Ara
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ----------------------------- STORY ------------------------------ */}
        <section id="hikaye" className="relative px-4 py-20 sm:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-30px_rgba(42,30,22,0.5)]">
                <img
                  src="/puruze/puruze-exterior.webp"
                  alt="Kuzguncuk sokağında Püruze Caffe"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <span className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#B85C38]">
                Hikayemiz
              </span>
              <h2
                className="mt-3 text-3xl font-semibold leading-tight text-[#2A1E16] sm:text-4xl"
                style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
              >
                Mahallenin ruhunu taşıyan bir köşe
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-[#5b4a3d]">
                Püruze Caffe, Kuzguncuk’un o eşsiz mahalle ruhunu ve{" "}
                <span className="font-medium text-[#2A1E16]">Ekmek Teknesi</span>{" "}
                mirasını bugüne taşıyor. Tarihî sokaklarda, komşuluğun ve sıcak
                sohbetlerin hâlâ yaşadığı bir buluşma noktası.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-[#5b4a3d]">
                Sabahları taze demlenen çay ve bol kahvaltıyla, öğleden sonra
                ise özenli kahveler ve ev yapımı tatlılarla; her saat farklı,
                her an samimi. Burada acele yok — sadece keyif var.
              </p>
              <div className="mt-7 flex flex-wrap gap-3 text-sm">
                {["Ev yapımı", "Mahalle sıcaklığı", "Pet-friendly", "Taze & yerel"].map(
                  (chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-[#2A1E16]/12 bg-white/60 px-3.5 py-1.5 font-medium text-[#5b4a3d]"
                    >
                      {chip}
                    </span>
                  ),
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ----------------- WEEKEND BREAKFAST NOTICE CARD ------------------ */}
        <section className="px-4 pb-4">
          <Reveal>
            <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[#2A1E16] text-[#FBF6EE] shadow-[0_30px_70px_-35px_rgba(42,30,22,0.7)]">
              <div className="grid gap-px sm:grid-cols-[1.1fr_1fr] sm:gap-0">
                <div className="p-8 sm:p-10">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#B85C38]/20 px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-[#E9A77F]">
                    <Clock className="h-3.5 w-3.5" />
                    Hafta Sonu Düzeni
                  </span>
                  <h2
                    className="mt-4 text-2xl font-semibold sm:text-3xl"
                    style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
                  >
                    Kahvaltı &amp; sonrası saatlerimiz
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-[#EADBC8]/80">
                    Hafta sonu yoğunluğunda herkese en iyi deneyimi sunabilmek
                    için servis düzenimiz saatlere göre değişir.
                  </p>
                </div>
                <div className="grid grid-cols-1 divide-y divide-white/10 border-t border-white/10 sm:border-l sm:border-t-0">
                  <div className="flex items-center gap-4 p-6 sm:p-7">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E9A77F]/15 text-[#E9A77F]">
                      <Sun className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">
                        09:00 – 14:00
                      </div>
                      <div className="text-sm text-[#EADBC8]/80">
                        Yalnızca kahvaltı menüsü
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-6 sm:p-7">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E9A77F]/15 text-[#E9A77F]">
                      <Coffee className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">
                        14:00 sonrası
                      </div>
                      <div className="text-sm text-[#EADBC8]/80">
                        Kahve, tatlı &amp; içecek menüsü
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* --------------------------- MENU TEASER -------------------------- */}
        <section id="menu" className="px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal className="text-center">
              <span className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#B85C38]">
                Menü
              </span>
              <h2
                className="mt-3 text-3xl font-semibold text-[#2A1E16] sm:text-4xl"
                style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
              >
                Soframızdan seçkiler
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[15px] text-[#5b4a3d]">
                Kahvaltıdan tatlıya, sabahtan akşama gününüze eşlik edecek
                lezzetler. Tüm seçenekleri menü sayfamızda inceleyin.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
              {MENU.map((g, i) => {
                const Icon = g.icon;
                return (
                  <Reveal key={g.id} delay={(i % 5) * 0.05}>
                    <Link
                      href={`${MENU_HREF}#${g.id}`}
                      className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-[#2A1E16]/10 bg-white/70 p-5 text-center shadow-[0_10px_30px_-22px_rgba(42,30,22,0.6)] transition-all hover:-translate-y-1 hover:border-[#B85C38]/40 hover:shadow-[0_18px_40px_-24px_rgba(42,30,22,0.55)]"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B85C38]/12 text-[#B85C38] transition-colors group-hover:bg-[#B85C38] group-hover:text-white">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="text-[15px] font-semibold text-[#2A1E16]">
                        {g.label}
                      </span>
                      <span className="text-[12px] text-[#8a7868]">
                        {g.items.length} seçenek
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <Link
                href={MENU_HREF}
                className="inline-flex items-center gap-2 rounded-full bg-[#2A1E16] px-7 py-3.5 text-sm font-semibold text-[#FBF6EE] shadow-sm transition-transform hover:scale-[1.03]"
              >
                Tüm Menüyü Gör
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-4 text-[12px] italic text-[#8a7868]">
                * Görseller ve fiyatlar demo amaçlı örnek içeriktir.
              </p>
            </div>
          </div>
        </section>

        {/* ----------------------------- GALLERY ---------------------------- */}
        <section id="galeri" className="px-4 pb-20 sm:pb-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="text-center">
              <span className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#B85C38]">
                Galeri
              </span>
              <h2
                className="mt-3 text-3xl font-semibold text-[#2A1E16] sm:text-4xl"
                style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
              >
                Püruze’den kareler
              </h2>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {GALLERY.map((g, i) => (
                <Reveal
                  key={g.src}
                  delay={(i % 4) * 0.06}
                  className={
                    i === 0 || i === 5 ? "col-span-2 row-span-1 md:row-span-2" : ""
                  }
                >
                  <div className="group h-full overflow-hidden rounded-2xl shadow-[0_18px_40px_-28px_rgba(42,30,22,0.6)]">
                    <img
                      src={g.src}
                      alt={g.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------- SOCIAL PROOF ------------------------- */}
        <section id="yorumlar" className="bg-[#F2E8D8] px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="text-center">
              <span className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#B85C38]">
                Misafirlerimiz
              </span>
              <h2
                className="mt-3 text-3xl font-semibold text-[#2A1E16] sm:text-4xl"
                style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
              >
                Püruze’de bir his bırakanlar
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {REVIEWS.map((r, i) => (
                <Reveal key={r.name} delay={(i % 4) * 0.06}>
                  <figure className="flex h-full flex-col rounded-2xl border border-[#2A1E16]/10 bg-[#FBF6EE] p-6 shadow-[0_14px_36px_-26px_rgba(42,30,22,0.55)]">
                    <Quote className="h-6 w-6 text-[#B85C38]/40" />
                    <div className="mt-2 flex gap-0.5 text-[#E0A24E]">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                    <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-[#4a3a2e]">
                      “{r.text}”
                    </blockquote>
                    <figcaption className="mt-4 text-sm font-semibold text-[#2A1E16]">
                      {r.name}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
            <p className="mt-6 text-center text-[12px] italic text-[#8a7868]">
              * Genel misafir izlenimlerinden esinlenen örnek yorumlardır.
            </p>
          </div>
        </section>

        {/* ----------------------------- LOCATION --------------------------- */}
        <section id="iletisim" className="px-4 py-20 sm:py-28">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
            <Reveal>
              <span className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#B85C38]">
                İletişim &amp; Konum
              </span>
              <h2
                className="mt-3 text-3xl font-semibold text-[#2A1E16] sm:text-4xl"
                style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
              >
                Kuzguncuk’ta sizi bekliyoruz
              </h2>

              <ul className="mt-7 space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B85C38]/12 text-[#B85C38]">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-[#2A1E16]">Adres</div>
                    <div className="text-sm text-[#5b4a3d]">{ADDRESS}</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B85C38]/12 text-[#B85C38]">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-[#2A1E16]">Telefon</div>
                    <a
                      href={`tel:${PHONE_TEL}`}
                      className="text-sm text-[#5b4a3d] hover:text-[#B85C38]"
                    >
                      {PHONE_DISPLAY}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B85C38]/12 text-[#B85C38]">
                    <Instagram className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-[#2A1E16]">Instagram</div>
                    <a
                      href={INSTAGRAM}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#5b4a3d] hover:text-[#B85C38]"
                    >
                      @puruzecaffe
                    </a>
                  </div>
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={MAPS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#B85C38] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.03]"
                >
                  <MapPin className="h-4 w-4" />
                  Yol Tarifi Al
                </a>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[#2A1E16]/15 bg-white/60 px-5 py-3 text-sm font-semibold text-[#2A1E16] transition-colors hover:bg-white"
                >
                  <Phone className="h-4 w-4" />
                  Ara
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="h-full min-h-[320px] overflow-hidden rounded-[2rem] border border-[#2A1E16]/10 shadow-[0_30px_60px_-34px_rgba(42,30,22,0.5)]">
                <iframe
                  title="Püruze Caffe konum haritası"
                  src="https://www.google.com/maps?q=Kuzguncuk%20%C4%B0cadiye%20Caddesi%20%C3%9Csk%C3%BCdar&output=embed"
                  className="h-full min-h-[320px] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>
          </div>
        </section>

        <PuruzeFooter />
      </main>

      <MobileCtaBar />
    </div>
  );
}
