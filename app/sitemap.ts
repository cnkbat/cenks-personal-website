import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/i18n/dictionaries";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  // Standalone, self-themed demo routes.
  const demoPaths = [
    "/puruze-caffe",
    "/demos/kuafor-os",
    "/demos/beauty-center-crm",
    "/demos/clinic-os",
    "/demos/estate-os",
    "/demos/restaurant-os",
  ];

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...demoPaths.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
