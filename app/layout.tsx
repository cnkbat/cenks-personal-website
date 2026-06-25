import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { siteConfig } from "@/lib/i18n/dictionaries";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Cenk Emir Bat — İşletmeniz için Premium Dijital Çözümler",
    template: "%s — Cenk Emir Bat",
  },
  description:
    "İşletmenizi dijitalde daha profesyonel, daha hızlı ve daha görünür hale getiriyorum. Modern web siteleri, CRM, online randevu sistemleri ve dijital büyüme çözümleri.",
  keywords: [
    "web sitesi",
    "CRM",
    "online randevu sistemi",
    "dijital çözümler",
    "Google SEO",
    "işletme otomasyonu",
    "Cenk Emir Bat",
    "dijital büyüme",
    "website",
    "appointment system",
  ],
  authors: [{ name: "Cenk Emir Bat" }],
  creator: "Cenk Emir Bat",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    alternateLocale: "en_US",
    url: siteConfig.url,
    title: "Cenk Emir Bat — İşletmeniz için Premium Dijital Çözümler",
    description:
      "Modern web siteleri, CRM, online randevu sistemleri ve dijital büyüme çözümleriyle işletmenizi bir üst seviyeye taşıyorum.",
    siteName: "Cenk Emir Bat",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cenk Emir Bat — Premium Dijital Çözümler",
    description:
      "İşletmeniz için modern web siteleri, CRM ve dijital büyüme çözümleri.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    "tiktok-developers-site-verification": "hdqx7r1Ek28viAqxrQrRkbu6Gi2sN4Z3",
  },
};

export const viewport: Viewport = {
  themeColor: "#060711",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
