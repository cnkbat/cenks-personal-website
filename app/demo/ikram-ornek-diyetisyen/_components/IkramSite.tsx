"use client";

import { useState, type CSSProperties } from "react";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  Baby,
  Building2,
  CalendarCheck,
  Check,
  Clock,
  Dumbbell,
  Flame,
  Flower2,
  Handshake,
  Instagram,
  Laptop,
  Leaf,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  Quote,
  Sparkles,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import {
  ABOUT_CREDENTIALS,
  BLOG,
  FAQ,
  FOOTER_LEGAL,
  HERO_BULLETS,
  PROCESS,
  RECIPES,
  RESULTS,
  SERVICES,
  STATS,
  TESTIMONIALS,
} from "./data";
import {
  AnimatedNumber,
  ArchImage,
  Blob,
  BRAND,
  Eyebrow,
  Grain,
  LeafMark,
  Pill,
  Reveal,
  SectionHeading,
  Sprig,
  WA_DEFAULT,
  display,
  displayFamily,
  ease,
  waLink,
} from "./shared";
import { FloatingWhatsApp, MobileCtaBar, Navbar, WhatsAppIcon } from "./Navbar";

const SERVICE_ICONS: Record<string, LucideIcon> = {
  laptop: Laptop,
  handshake: Handshake,
  flower: Flower2,
  baby: Baby,
  dumbbell: Dumbbell,
  building: Building2,
};

const paletteVars = {
  "--bg": "#FAF9F6",
  "--cream": "#F3EFE7",
  "--cream-2": "#ECE5D8",
  "--sage": "#7E956B",
  "--sage-2": "#9DB088",
  "--olive": "#4F6245",
  "--olive-deep": "#39482F",
  "--ink": "#1F1F1D",
  "--muted": "#5F615B",
  "--line": "rgba(79,98,69,0.16)",
  fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
} as CSSProperties;

/* =================================================================== *
 * HERO
 * =================================================================== */
function Hero() {
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
  };

  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-40">
      {/* ambient */}
      <Blob className="left-[-8%] top-[8%] h-[26rem] w-[26rem] bg-[var(--sage)]/25" />
      <Blob className="right-[-6%] top-[30%] h-[22rem] w-[22rem] bg-[var(--cream-2)]" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-24">
        {/* copy */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="relative z-10">
          <motion.div variants={item}>
            <Pill>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--sage)]" />
              Bahçelievler Diyetisyen
            </Pill>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-[2.75rem] leading-[1.02] tracking-[-0.02em] text-[var(--ink)] sm:text-[3.6rem] lg:text-[4.1rem]"
            style={{ fontFamily: displayFamily, fontWeight: 500 }}
          >
            Yasaksız.
            <br />
            <span className="relative inline-block text-[var(--olive)]">
              Sürdürülebilir.
              <svg
                className="absolute -bottom-2 left-0 h-3 w-full"
                viewBox="0 0 320 12"
                preserveAspectRatio="none"
                aria-hidden
              >
                <motion.path
                  d="M3 8C55 3 120 11 175 6C230 1 285 9 317 5"
                  stroke="var(--sage-2)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.1, delay: 0.9, ease }}
                />
              </svg>
            </span>
            <br />
            Bilimsel Beslenme.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-md text-pretty text-[16px] leading-relaxed text-[var(--muted)] sm:text-[18px]"
          >
            Kişiye özel beslenme planları ile sağlıklı yaşam hedeflerinize birlikte
            ulaşalım.
          </motion.p>

          <motion.ul variants={item} className="mt-7 flex flex-col gap-2.5">
            {HERO_BULLETS.map((b) => (
              <li key={b} className="flex items-center gap-3 text-[15px] text-[var(--ink)]">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--sage)]/15 text-[var(--olive)]">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                {b}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={WA_DEFAULT}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_18px_38px_-16px_rgba(37,211,102,0.75)] transition-transform hover:scale-[1.03]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp’tan Yaz
            </a>
            <a
              href={BRAND.appointment}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--olive)]/25 bg-[var(--bg)] px-6 py-3.5 text-[15px] font-semibold text-[var(--olive)] transition-colors hover:bg-[var(--cream)]"
            >
              <CalendarCheck className="h-5 w-5" />
              Randevu Al
            </a>
          </motion.div>
        </motion.div>

        {/* visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease }}
          className="relative mx-auto w-full max-w-md lg:mx-0"
        >
          <Sprig className="absolute -left-10 top-6 z-0 hidden h-56 w-28 opacity-70 sm:block" />
          <div className="relative z-10">
            <ArchImage
              src="/ikram/hero-botanical.webp"
              alt="Sürdürülebilir ve doğal beslenmeyi simgeleyen zarif botanik kompozisyon"
              className="aspect-[3/4] w-full shadow-[0_50px_90px_-45px_rgba(57,72,47,0.55)]"
            />
            {/* monogram badge */}
            <div className="absolute left-5 top-5 z-20 grid h-14 w-14 place-items-center rounded-full border border-white/60 bg-[var(--bg)]/85 text-[18px] font-semibold text-[var(--olive)] shadow-lg backdrop-blur"
              style={{ fontFamily: displayFamily }}
            >
              İÖ
            </div>
            {/* floating card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1, ease }}
              className="absolute -bottom-6 -right-3 z-20 w-[15rem] rounded-2xl border border-[var(--line)] bg-[var(--bg)]/92 p-4 shadow-[0_30px_60px_-30px_rgba(57,72,47,0.6)] backdrop-blur-md sm:-right-8"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--sage)]/15 text-[var(--olive)]">
                  <Leaf className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <p
                    className="text-[15px] font-semibold text-[var(--ink)]"
                    style={{ fontFamily: displayFamily }}
                  >
                    Sürdürülebilir Beslenme
                  </p>
                  <p className="text-[13px] text-[var(--olive)]">Mutlu Yaşam</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =================================================================== *
 * STATS
 * =================================================================== */
function Stats() {
  return (
    <section className="relative px-4 sm:px-6">
      <Reveal className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[26px] border border-[var(--line)] bg-[var(--line)] shadow-[0_30px_70px_-45px_rgba(57,72,47,0.4)] lg:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1.5 bg-[var(--bg)] px-4 py-8 text-center sm:py-10"
            >
              <div
                className="text-[2.1rem] leading-none text-[var(--olive)] sm:text-[2.6rem]"
                style={{ fontFamily: displayFamily, fontWeight: 500 }}
              >
                {s.text ? (
                  s.text
                ) : (
                  <>
                    {s.prefix}
                    <AnimatedNumber value={s.value ?? 0} suffix={s.suffix} />
                  </>
                )}
              </div>
              <div className="text-[12.5px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* =================================================================== *
 * ABOUT
 * =================================================================== */
function About() {
  return (
    <section id="hakkimda" className="relative px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* image + quote */}
        <Reveal className="relative order-1">
          <Sprig className="absolute -right-6 -top-8 z-0 hidden h-52 w-24 rotate-12 opacity-60 md:block" />
          <ArchImage
            src="/ikram/about-flatlay.webp"
            alt="Bir diyetisyenin masası: defter, bitki çayı, taze yeşillikler ve mezura"
            className="relative z-10 aspect-[4/5] w-full max-w-md shadow-[0_46px_90px_-48px_rgba(57,72,47,0.55)] lg:ml-0"
          />
          <div className="absolute -bottom-6 left-4 z-20 max-w-xs rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-5 shadow-[0_30px_60px_-32px_rgba(57,72,47,0.55)] sm:left-8">
            <Quote className="h-6 w-6 text-[var(--sage)]" />
            <p
              className="mt-2 text-[15px] italic leading-relaxed text-[var(--ink)]"
              style={{ fontFamily: displayFamily }}
            >
              “Amacım; bedeninizle barışık, enerjik ve mutlu bir yaşam sürmeniz için
              size rehberlik etmek.”
            </p>
          </div>
        </Reveal>

        {/* text */}
        <div className="order-2">
          <Reveal>
            <Eyebrow className="mb-4">Ben Kimim?</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              className="text-balance text-[2rem] leading-[1.1] tracking-[-0.01em] text-[var(--ink)] sm:text-[2.6rem]"
              style={{ fontFamily: displayFamily, fontWeight: 500 }}
            >
              Merhaba, ben <span className="text-[var(--olive)]">Dyt. İkram Örnek</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-pretty text-[15.5px] leading-relaxed text-[var(--muted)] sm:text-[16.5px]">
              Beslenmenin sadece kilo vermek olmadığına; hayat kalitesini artırmak,
              bedenle daha sağlıklı bir ilişki kurmak ve sürdürülebilir alışkanlıklar
              kazanmak olduğuna inanıyorum. Kişiye özel, uygulanabilir ve bilimsel
              temelli beslenme planlarıyla danışanlarımın sürecine eşlik ediyorum.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {ABOUT_CREDENTIALS.map((c, i) => (
                <li
                  key={c}
                  className={`flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--cream)]/50 px-4 py-3 text-[14px] font-medium text-[var(--ink)] ${
                    i === ABOUT_CREDENTIALS.length - 1 && ABOUT_CREDENTIALS.length % 2 === 1
                      ? "sm:col-span-2"
                      : ""
                  }`}
                >
                  <LeafMark className="mt-0.5 h-4 w-4 shrink-0 text-[var(--sage)]" />
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* =================================================================== *
 * RESULTS
 * =================================================================== */
function Results() {
  return (
    <section id="sonuclar" className="relative bg-[var(--cream)] px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Danışan Deneyimleri"
          title="Gerçek Kişiler, Gerçek Sonuçlar"
          lead="Sürdürülebilir alışkanlıklarla elde edilen örnek değişimler. Her süreç kişiye özeldir."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-5">
          {RESULTS.map((r, i) => (
            <Reveal key={r.time + r.note} delay={i * 0.06}>
              <div className="group h-full overflow-hidden rounded-t-[64px] rounded-b-[22px] border border-[var(--line)] bg-[var(--bg)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_36px_70px_-40px_rgba(57,72,47,0.5)]">
                {/* soft “result” area (no faces) */}
                <div className="relative flex h-28 items-center justify-center bg-[radial-gradient(120%_90%_at_50%_0%,rgba(157,176,136,0.4),transparent_60%),linear-gradient(180deg,#EAEFE3,#F3EFE7)] sm:h-32">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--bg)] text-[var(--olive)] shadow-[0_14px_28px_-14px_rgba(57,72,47,0.6)]">
                    <TrendingDown className="h-6 w-6" strokeWidth={2} />
                  </span>
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[var(--bg)]/85 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--olive)]">
                    Danışan Sonucu
                  </span>
                </div>
                <div className="px-4 py-5 text-center">
                  <div
                    className="text-[1.9rem] leading-none text-[var(--olive)]"
                    style={{ fontFamily: displayFamily, fontWeight: 600 }}
                  >
                    {r.result}
                  </div>
                  <p className="mt-1.5 text-[13px] text-[var(--muted)]">{r.note}</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] px-3 py-1 text-[12px] font-medium text-[var(--ink)]">
                    <Clock className="h-3.5 w-3.5 text-[var(--sage)]" />
                    {r.time}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-[12.5px] leading-relaxed text-[var(--muted)]">
          * Sonuçlar bireyseldir ve kişiden kişiye değişiklik gösterebilir. Sağlıklı ve
          kalıcı değişim, kişiye özel bir süreçle mümkündür.
        </p>
      </div>
    </section>
  );
}

/* =================================================================== *
 * SERVICES
 * =================================================================== */
function Services() {
  return (
    <section id="hizmetler" className="relative px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Hizmetler"
          title="Size Özel Programlar"
          lead="İhtiyacınıza ve hedefinize göre şekillenen, sürdürülebilir beslenme çözümleri."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = SERVICE_ICONS[s.icon] ?? Leaf;
            return (
              <Reveal key={s.title} delay={(i % 3) * 0.08}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-[var(--line)] bg-[var(--bg)] p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--sage)]/40 hover:shadow-[0_40px_80px_-46px_rgba(57,72,47,0.55)]">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--sage)]/8 transition-transform duration-500 group-hover:scale-150" aria-hidden />
                  <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-[var(--sage)]/12 text-[var(--olive)]">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <h3
                    className="relative mt-5 text-[1.3rem] text-[var(--ink)]"
                    style={{ fontFamily: displayFamily, fontWeight: 500 }}
                  >
                    {s.title}
                  </h3>
                  <p className="relative mt-2.5 flex-1 text-[14.5px] leading-relaxed text-[var(--muted)]">
                    {s.text}
                  </p>
                  <a
                    href={waLink(`Merhaba, ${s.title} hakkında bilgi almak istiyorum.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--olive)] transition-colors hover:text-[var(--sage)]"
                  >
                    Detaylar
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =================================================================== *
 * PROCESS
 * =================================================================== */
function Process() {
  return (
    <section id="surec" className="relative overflow-hidden bg-[var(--olive-deep)] px-4 py-24 text-[var(--cream)] sm:px-6 md:py-32">
      <Blob className="left-[10%] top-[20%] h-72 w-72 bg-[var(--sage)]/25" />
      <Blob className="right-[6%] bottom-[10%] h-64 w-64 bg-[var(--olive)]/40" />

      <div className="relative mx-auto max-w-4xl">
        <div className="flex max-w-2xl flex-col items-center text-center mx-auto">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--sage-2)]">
              <LeafMark className="h-3.5 w-3.5" />
              Süreç
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              className="mt-4 text-balance text-[2rem] leading-[1.1] text-[var(--bg)] sm:text-[2.7rem]"
              style={{ fontFamily: displayFamily, fontWeight: 500 }}
            >
              Sürecimiz Nasıl İşliyor?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-[15px] leading-relaxed text-[var(--cream)]/70 sm:text-[16px]">
              İlk mesajınızdan kalıcı sonuçlara kadar, her adımda yanınızdayım.
            </p>
          </Reveal>
        </div>

        <ol className="relative mx-auto mt-14 max-w-2xl space-y-2">
          {/* vertical line */}
          <span className="absolute left-[27px] top-4 bottom-4 w-px bg-[var(--cream)]/15 sm:left-[31px]" aria-hidden />
          {PROCESS.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 0.08} className="relative flex gap-5 rounded-3xl p-3 transition-colors hover:bg-white/[0.04] sm:gap-6">
              <span
                className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[var(--sage-2)]/40 bg-[var(--olive-deep)] text-[1.35rem] text-[var(--sage-2)] sm:h-16 sm:w-16"
                style={{ fontFamily: displayFamily, fontWeight: 600 }}
              >
                {i + 1}
              </span>
              <div className="pt-2.5 sm:pt-3.5">
                <h3
                  className="text-[1.25rem] text-[var(--bg)] sm:text-[1.4rem]"
                  style={{ fontFamily: displayFamily, fontWeight: 500 }}
                >
                  {step.title}
                </h3>
                <p className="mt-1.5 max-w-lg text-[14.5px] leading-relaxed text-[var(--cream)]/70">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* =================================================================== *
 * RECIPES
 * =================================================================== */
function Recipes() {
  return (
    <section id="tarifler" className="relative px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
          <SectionHeading
            align="left"
            eyebrow="Mutfaktan"
            title="Sağlıklı Tarifler"
            lead="Pratik, doyurucu ve yasaksız. Günlük hayata kolayca eklenebilen lezzetler."
            className="max-w-xl"
          />
          <Reveal>
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full border border-[var(--line)] px-5 py-2.5 text-[14px] font-semibold text-[var(--olive)] transition-colors hover:bg-[var(--cream)] sm:inline-flex"
            >
              <Instagram className="h-4 w-4" />
              Instagram’da Daha Fazlası
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {RECIPES.map((r, i) => (
            <Reveal key={r.title} delay={(i % 4) * 0.07}>
              <article className="group flex h-full flex-col overflow-hidden rounded-t-[56px] rounded-b-[22px] border border-[var(--line)] bg-[var(--bg)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-46px_rgba(57,72,47,0.5)]">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={r.img}
                    alt={r.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--muted)]">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[var(--sage)]" />
                      {r.time}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 text-[var(--sage)]" />
                      {r.kcal}
                    </span>
                  </div>
                  <h3
                    className="mt-3 text-[1.2rem] leading-snug text-[var(--ink)]"
                    style={{ fontFamily: displayFamily, fontWeight: 500 }}
                  >
                    {r.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-[var(--muted)]">
                    {r.desc}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================================================================== *
 * BLOG
 * =================================================================== */
function Blog() {
  return (
    <section id="blog" className="relative bg-[var(--cream)] px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Blog"
          title="Güncel Yazılar"
          lead="Beslenme, alışkanlıklar ve sağlıklı yaşam üzerine bilimsel ama sade içerikler."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BLOG.map((p, i) => (
            <Reveal key={p.title} delay={(i % 4) * 0.07}>
              <article className="group flex h-full flex-col rounded-[26px] border border-[var(--line)] bg-[var(--bg)] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-46px_rgba(57,72,47,0.5)]">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--sage)]/12 px-3 py-1 text-[11.5px] font-semibold text-[var(--olive)]">
                  <Leaf className="h-3 w-3" />
                  {p.category}
                </span>
                <h3
                  className="mt-4 text-[1.22rem] leading-snug text-[var(--ink)] transition-colors group-hover:text-[var(--olive)]"
                  style={{ fontFamily: displayFamily, fontWeight: 500 }}
                >
                  {p.title}
                </h3>
                <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-[var(--muted)]">
                  {p.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4 text-[12px] text-[var(--muted)]">
                  <span>{p.date}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {p.read}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================================================================== *
 * TESTIMONIALS
 * =================================================================== */
function Testimonials() {
  return (
    <section id="yorumlar" className="relative px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Sizden Gelenler" title="Danışanlarımın Yorumları" />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-[26px] border border-[var(--line)] bg-[var(--cream)]/50 p-7">
                <Quote className="h-8 w-8 text-[var(--sage)]/60" />
                <blockquote
                  className="mt-4 flex-1 text-[16px] italic leading-relaxed text-[var(--ink)]"
                  style={{ fontFamily: displayFamily }}
                >
                  “{t.text}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--line)] pt-5">
                  <span
                    className="grid h-11 w-11 place-items-center rounded-full bg-[var(--olive)] text-[15px] font-semibold text-[var(--bg)]"
                    style={{ fontFamily: displayFamily }}
                  >
                    {t.name.charAt(0)}
                  </span>
                  <div className="leading-tight">
                    <div className="text-[14.5px] font-semibold text-[var(--ink)]">{t.name}</div>
                    <div className="text-[12.5px] text-[var(--olive)]">Danışan</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================================================================== *
 * FAQ
 * =================================================================== */
function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="sss" className="relative bg-[var(--cream)] px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <Eyebrow className="mb-4">S.S.S.</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              className="text-balance text-[2rem] leading-[1.1] text-[var(--ink)] sm:text-[2.6rem]"
              style={{ fontFamily: displayFamily, fontWeight: 500 }}
            >
              Sık Sorulan Sorular
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-[15px] leading-relaxed text-[var(--muted)]">
              Aklınıza takılan başka bir soru mu var? WhatsApp üzerinden yazabilir,
              dilediğiniz her şeyi sorabilirsiniz.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <a
              href={WA_DEFAULT}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_16px_34px_-16px_rgba(37,211,102,0.7)] transition-transform hover:scale-[1.03]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Soru Sor
            </a>
          </Reveal>
        </div>

        <div className="flex flex-col gap-3">
          {FAQ.map((f, i) => {
            const open = openIdx === i;
            return (
              <Reveal key={f.q} delay={i * 0.04}>
                <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg)]">
                  <button
                    type="button"
                    onClick={() => setOpenIdx(open ? null : i)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  >
                    <span
                      className="text-[15.5px] font-medium text-[var(--ink)] sm:text-[16.5px]"
                      style={{ fontFamily: displayFamily, fontWeight: 500 }}
                    >
                      {f.q}
                    </span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--sage)]/12 text-[var(--olive)]">
                      {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <motion.div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-hidden={!open}
                    initial={false}
                    animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.4, ease }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-[14.5px] leading-relaxed text-[var(--muted)]">
                      {f.a}
                    </p>
                  </motion.div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =================================================================== *
 * FINAL CTA
 * =================================================================== */
function FinalCta() {
  return (
    <section id="randevu" className="relative px-4 py-24 sm:px-6 md:py-32">
      <Reveal className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[36px] border border-[var(--line)] px-6 py-16 text-center sm:px-12 md:py-24">
          <img
            src="/ikram/cta-atmosphere.webp"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--olive-deep)]/92 via-[var(--olive)]/85 to-[var(--olive-deep)]/92" aria-hidden />
          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--bg)] backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              İlk Adım
            </span>
            <h2
              className="mt-6 text-balance text-[2.1rem] leading-[1.08] text-[var(--bg)] sm:text-[3rem]"
              style={{ fontFamily: displayFamily, fontWeight: 500 }}
            >
              Hazırsanız birlikte başlayalım!
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-[15.5px] leading-relaxed text-[var(--cream)]/85 sm:text-[17px]">
              Daha sağlıklı, daha enerjik ve sürdürülebilir bir yaşam için ilk adımı
              bugün atın.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href={WA_DEFAULT}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_20px_42px_-16px_rgba(0,0,0,0.5)] transition-transform hover:scale-[1.03]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp’tan Yaz
              </a>
              <a
                href={BRAND.appointment}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--bg)] px-6 py-3.5 text-[15px] font-semibold text-[var(--olive)] transition-transform hover:scale-[1.03]"
              >
                <CalendarCheck className="h-5 w-5" />
                Online Randevu Al
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* =================================================================== *
 * CONTACT + FOOTER
 * =================================================================== */
function Footer() {
  const contacts = [
    { icon: MapPin, label: "Adres", value: BRAND.addressLong, href: BRAND.maps },
    { icon: Phone, label: "Telefon", value: BRAND.phoneDisplay, href: `tel:${BRAND.phoneTel}` },
    { icon: Mail, label: "E-posta", value: BRAND.email, href: `mailto:${BRAND.email}` },
    { icon: Instagram, label: "Instagram", value: BRAND.instagramHandle, href: BRAND.instagram },
  ];

  return (
    <footer id="iletisim" className="relative overflow-hidden bg-[var(--olive-deep)] text-[var(--cream)]">
      <Blob className="left-[-4%] top-[-10%] h-72 w-72 bg-[var(--olive)]/50" />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
        {/* contact cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contacts.map((c) => (
            <Reveal key={c.label}>
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex h-full items-start gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:bg-white/[0.08]"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--sage-2)]/20 text-[var(--sage-2)]">
                  <c.icon className="h-5 w-5" />
                </span>
                <span className="leading-tight">
                  <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--cream)]/50">
                    {c.label}
                  </span>
                  <span className="mt-1 block text-[14.5px] font-medium text-[var(--bg)]">
                    {c.value}
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        {/* brand row */}
        <div className="mt-16 flex flex-col items-center gap-6 border-t border-white/10 pt-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <span
              className="grid h-14 w-14 place-items-center rounded-full bg-[var(--sage-2)]/20 text-[19px] font-semibold text-[var(--sage-2)]"
              style={{ fontFamily: displayFamily }}
            >
              İÖ
            </span>
            <div>
              <div
                className="text-[1.5rem] text-[var(--bg)]"
                style={{ fontFamily: displayFamily, fontWeight: 500 }}
              >
                Dyt. İkram Örnek
              </div>
              <div className="mt-1 text-[13px] italic text-[var(--sage-2)]">
                {BRAND.tagline}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-[var(--cream)]/60">
            {FOOTER_LEGAL.map((l) => (
              <a key={l} href="#" className="transition-colors hover:text-[var(--bg)]">
                {l}
              </a>
            ))}
          </div>

          <p className="mt-2 text-[12px] text-[var(--cream)]/45">
            © 2026 Dyt. İkram Örnek · Bahçelievler, İstanbul · Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* =================================================================== *
 * ROOT
 * =================================================================== */
export function IkramSite() {
  return (
    <div
      data-ikram
      className={`${display.variable} relative min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--ink)] antialiased`}
      style={paletteVars}
    >
      <style>{`[data-ikram] a:focus-visible,[data-ikram] button:focus-visible{outline:2px solid var(--olive);outline-offset:2px;box-shadow:0 0 0 4px rgba(250,249,246,0.5)}`}</style>
      <MotionConfig reducedMotion="user">
        <Grain />
        <Navbar />
        <main className="relative z-10">
          <Hero />
          <Stats />
          <About />
          <Results />
          <Services />
          <Process />
          <Recipes />
          <Blog />
          <Testimonials />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
        <FloatingWhatsApp />
        <MobileCtaBar />
      </MotionConfig>
    </div>
  );
}
