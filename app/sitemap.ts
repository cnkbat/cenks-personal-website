import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/i18n/dictionaries";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const demoSlugs = [
    "beauty-crm",
    "barber",
    "clinic",
    "real-estate",
    "restaurant",
  ];

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...demoSlugs.map((slug) => ({
      url: `${base}/demos/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
