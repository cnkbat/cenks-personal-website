import type { Metadata } from "next";
import { siteConfig } from "@/lib/i18n/dictionaries";
import { IkramSite } from "./_components/IkramSite";

const PATH = "/demo/ikram-ornek-diyetisyen";
const TITLE = "Dyt. İkram Örnek | Bahçelievler Diyetisyen";
const DESCRIPTION =
  "Bahçelievler’de yüz yüze ve Türkiye geneli online beslenme danışmanlığı. Yasaksız, sürdürülebilir ve bilimsel beslenme yaklaşımı.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "Bahçelievler diyetisyen",
    "online diyetisyen",
    "beslenme danışmanlığı",
    "İkram Örnek",
    "PCOS beslenmesi",
    "insülin direnci beslenme",
    "sporcu beslenmesi",
    "gebelik beslenmesi",
    "kilo kontrolü",
    "sürdürülebilir beslenme",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: PATH,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Dyt. İkram Örnek",
    images: [
      {
        url: "/ikram/hero-botanical.webp",
        width: 1024,
        height: 1536,
        alt: "Dyt. İkram Örnek — Sürdürülebilir Beslenme",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/ikram/hero-botanical.webp"],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "MedicalBusiness"],
  name: "Dyt. İkram Örnek — Beslenme ve Diyet Danışmanlığı",
  description: DESCRIPTION,
  url: `${siteConfig.url}${PATH}`,
  image: `${siteConfig.url}/ikram/hero-botanical.webp`,
  telephone: "+905388416427",
  email: "dyt.ikramornek@gmail.com",
  priceRange: "₺₺",
  slogan: "Yasaksız. Sürdürülebilir. Bilimsel Beslenme.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bahçelievler",
    addressRegion: "İstanbul",
    addressCountry: "TR",
  },
  areaServed: [
    { "@type": "Place", name: "Bahçelievler, İstanbul" },
    { "@type": "Country", name: "Türkiye" },
  ],
  sameAs: ["https://instagram.com/dyt.ikramornek"],
  knowsAbout: [
    "Kilo kontrolü",
    "Yağ kaybı",
    "PCOS ve insülin direnci beslenmesi",
    "Gebelik ve emzirme dönemi beslenmesi",
    "Sporcu beslenmesi",
    "Yeme davranışı ve duygusal yeme",
  ],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Online Beslenme Danışmanlığı" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Yüz Yüze Beslenme Danışmanlığı" } },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IkramSite />
    </>
  );
}
