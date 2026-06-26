"use client";

import { useState } from "react";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Coffee,
  Croissant,
  CupSoda,
  Instagram,
  MapPin,
  Menu as MenuIcon,
  Phone,
  Sandwich,
  Sun,
  X,
  type LucideIcon,
} from "lucide-react";

export const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-serif",
});

export const ease = [0.22, 1, 0.36, 1] as const;

/* ----------------------------- contact info ----------------------------- */
export const PHONE_DISPLAY = "0216 310 15 35";
export const PHONE_TEL = "+902163101535";
export const INSTAGRAM = "https://instagram.com/puruzecaffe";
export const MAPS =
  "https://www.google.com/maps/search/?api=1&query=P%C3%BCruze%20Caffe%20Kuzguncuk%20%C4%B0cadiye%20Caddesi";
export const ADDRESS = "İcadiye Caddesi, Kuzguncuk, Üsküdar / İstanbul";
export const MENU_HREF = "/puruze-caffe/menu";
export const HOME_HREF = "/puruze-caffe";

/* ------------------------------ menu (demo) ----------------------------- */
export type MenuItem = { name: string; desc: string; price: string };
export type MenuGroup = {
  id: string;
  label: string;
  icon: LucideIcon;
  items: MenuItem[];
};

export const MENU: MenuGroup[] = [
  {
    id: "kahvalti",
    label: "Kahvaltı",
    icon: Sun,
    items: [
      {
        name: "Püruze Serpme Kahvaltı (2 Kişilik)",
        desc: "Yöresel peynirler, zeytinler, ev reçelleri, bal-kaymak, sıcak ekmek ve demli çay",
        price: "₺640",
      },
      {
        name: "Köy Kahvaltı Tabağı",
        desc: "Tek kişilik zengin kahvaltı tabağı, çay dahil",
        price: "₺320",
      },
      {
        name: "Menemen",
        desc: "Tereyağında domates, biber ve köy yumurtası",
        price: "₺180",
      },
      {
        name: "Bal-Kaymak & Simit",
        desc: "Taze simit, tereyağı, süzme bal ve kaymak",
        price: "₺160",
      },
    ],
  },
  {
    id: "kahve",
    label: "Kahve",
    icon: Coffee,
    items: [
      { name: "Türk Kahvesi", desc: "Közde, yanında lokum ile", price: "₺90" },
      {
        name: "Filtre Kahve",
        desc: "Günün çekirdeği, taze demleme",
        price: "₺110",
      },
      {
        name: "Latte / Cappuccino",
        desc: "Özenle hazırlanan espresso ve buharda süt",
        price: "₺135",
      },
      {
        name: "Flat White",
        desc: "Yoğun espresso, ipeksi mikro köpük",
        price: "₺140",
      },
    ],
  },
  {
    id: "tatli",
    label: "Tatlılar",
    icon: Croissant,
    items: [
      {
        name: "San Sebastian Cheesecake",
        desc: "Fırınlanmış, akışkan dokulu özel reçete",
        price: "₺195",
      },
      {
        name: "Ev Yapımı Cheesecake",
        desc: "Frambuazlı veya çikolatalı",
        price: "₺175",
      },
      {
        name: "Günün Pastası",
        desc: "Vitrinimizden taze dilim pasta",
        price: "₺165",
      },
      {
        name: "Cookie & Brownie",
        desc: "Sıcak servis, yanında dondurma opsiyonlu",
        price: "₺120",
      },
    ],
  },
  {
    id: "soguk",
    label: "Soğuk İçecekler",
    icon: CupSoda,
    items: [
      { name: "Iced Latte", desc: "Buzlu, çift shot espresso", price: "₺140" },
      {
        name: "Limonata",
        desc: "Taze sıkım, naneli ev yapımı",
        price: "₺120",
      },
      {
        name: "Soğuk Demleme (Cold Brew)",
        desc: "16 saat demlenmiş, yumuşak içim",
        price: "₺150",
      },
      {
        name: "Ev Yapımı Ice Tea",
        desc: "Şeftali veya orman meyveli",
        price: "₺115",
      },
    ],
  },
  {
    id: "yemek",
    label: "Hafif Yemekler",
    icon: Sandwich,
    items: [
      {
        name: "Köy Omleti",
        desc: "Kaşar, mantar ve taze otlar ile",
        price: "₺190",
      },
      {
        name: "Avokadolu Tost",
        desc: "Ekşi mayalı ekmek, avokado, yumurta",
        price: "₺210",
      },
      { name: "Kaşarlı Tost", desc: "Bol kaşar, çıtır ekmek", price: "₺140" },
      {
        name: "Mevsim Salata",
        desc: "Taze yeşillikler, ceviz, nar ekşili sos",
        price: "₺175",
      },
    ],
  },
];

/* ------------------------------- Reveal --------------------------------- */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------- DemoRibbon ------------------------------- */
export function DemoRibbon() {
  return (
    <div className="relative z-30 bg-[#2A1E16] px-4 py-2 text-center text-[12px] text-[#EADBC8]">
      <span className="opacity-90">
        Bu bir demo çalışmasıdır · Tasarım:{" "}
        <span className="font-semibold text-white">Cenk Emir Bat</span>
      </span>
      <Link
        href="/#demos"
        className="ml-3 inline-flex items-center gap-1 rounded-full border border-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white transition-colors hover:bg-white/10"
      >
        <ArrowLeft className="h-3 w-3" />
        Portföye dön
      </Link>
    </div>
  );
}

/* -------------------------------- header -------------------------------- */
function NavItem({
  href,
  label,
  onClick,
  className,
}: {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  // internal page routes use <Link>; in-page hash anchors use <a>
  if (href.startsWith("/")) {
    return (
      <Link href={href} onClick={onClick} className={className}>
        {label}
      </Link>
    );
  }
  return (
    <a href={href} onClick={onClick} className={className}>
      {label}
    </a>
  );
}

function Logo() {
  return (
    <>
      <span
        className="text-xl font-bold tracking-tight text-[#2A1E16]"
        style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
      >
        Püruze
      </span>
      <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#B85C38]">
        Caffe
      </span>
    </>
  );
}

/**
 * @param onHome  true on the main demo page (logo + section links stay in-page);
 *                false on sub-pages (links point back to /puruze-caffe#...).
 */
export function PuruzeHeader({ onHome = false }: { onHome?: boolean }) {
  const [navOpen, setNavOpen] = useState(false);
  const base = onHome ? "" : HOME_HREF;
  const logoHref = onHome ? "#top" : HOME_HREF;

  const navLinks = [
    { href: `${base}#hikaye`, label: "Hikaye" },
    { href: MENU_HREF, label: "Menü" },
    { href: `${base}#galeri`, label: "Galeri" },
    { href: `${base}#yorumlar`, label: "Yorumlar" },
    { href: `${base}#iletisim`, label: "İletişim" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[#2A1E16]/10 bg-[#FBF6EE]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        {onHome ? (
          <a href={logoHref} className="flex items-baseline gap-2">
            <Logo />
          </a>
        ) : (
          <Link href={logoHref} className="flex items-baseline gap-2">
            <Logo />
          </Link>
        )}

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <NavItem
              key={l.label}
              href={l.href}
              label={l.label}
              className="text-sm font-medium text-[#5b4a3d] transition-colors hover:text-[#B85C38]"
            />
          ))}
        </nav>

        <a
          href={`tel:${PHONE_TEL}`}
          className="hidden items-center gap-2 rounded-full bg-[#B85C38] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.03] md:inline-flex"
        >
          <Phone className="h-4 w-4" />
          Rezervasyon / Ara
        </a>

        <button
          aria-label="Menüyü aç/kapat"
          onClick={() => setNavOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2A1E16]/15 text-[#2A1E16] md:hidden"
        >
          {navOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {navOpen && (
        <div className="border-t border-[#2A1E16]/10 bg-[#FBF6EE] px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <NavItem
                key={l.label}
                href={l.href}
                label={l.label}
                onClick={() => setNavOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-[#5b4a3d] hover:bg-[#2A1E16]/5"
              />
            ))}
            <a
              href={`tel:${PHONE_TEL}`}
              onClick={() => setNavOpen(false)}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#B85C38] px-3 py-2.5 text-sm font-semibold text-white"
            >
              <Phone className="h-4 w-4" />
              Rezervasyon / Ara
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

/* -------------------------------- footer -------------------------------- */
export function PuruzeFooter() {
  return (
    <footer className="border-t border-[#2A1E16]/10 bg-[#2A1E16] px-4 py-12 text-[#EADBC8]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <div className="flex items-baseline gap-2">
          <span
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
          >
            Püruze
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#E9A77F]">
            Caffe
          </span>
        </div>
        <p className="max-w-md text-sm text-[#EADBC8]/70">
          Kuzguncuk’ta kahvaltı, kahve ve tatlı keyfi için sıcak ve samimi bir
          mahalle kafesi.
        </p>
        <div className="flex flex-col flex-wrap items-center justify-center gap-3 text-sm sm:flex-row sm:gap-5">
          <a href={MAPS} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            {ADDRESS}
          </a>
          <a href={`tel:${PHONE_TEL}`} className="hover:text-white">
            {PHONE_DISPLAY}
          </a>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-white"
          >
            <Instagram className="h-4 w-4" />
            @puruzecaffe
          </a>
        </div>
        <div className="mt-2 border-t border-white/10 pt-6 text-[12px] text-[#EADBC8]/50">
          © {2026} Püruze Caffe · Tüm hakları saklıdır. · Tasarım &amp; geliştirme:{" "}
          <Link href="/#demos" className="font-medium text-[#E9A77F] hover:text-white">
            Cenk Emir Bat
          </Link>{" "}
          (demo)
        </div>
      </div>
    </footer>
  );
}

/* --------------------------- mobile sticky bar -------------------------- */
export function MobileCtaBar() {
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#2A1E16]/10 bg-[#FBF6EE]/95 backdrop-blur-md md:hidden">
        <div className="grid grid-cols-3">
          <a
            href={`tel:${PHONE_TEL}`}
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-[#2A1E16]"
          >
            <Phone className="h-5 w-5 text-[#B85C38]" />
            Ara
          </a>
          <a
            href={MAPS}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 border-x border-[#2A1E16]/10 py-2.5 text-[11px] font-medium text-[#2A1E16]"
          >
            <MapPin className="h-5 w-5 text-[#B85C38]" />
            Yol Tarifi
          </a>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-[#2A1E16]"
          >
            <Instagram className="h-5 w-5 text-[#B85C38]" />
            Instagram
          </a>
        </div>
      </div>
      {/* spacer so the sticky bar doesn't cover content on mobile */}
      <div className="h-16 md:hidden" />
    </>
  );
}

/* ------------------------------ paper bg -------------------------------- */
export function PaperTexture() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.04] mix-blend-multiply"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}
