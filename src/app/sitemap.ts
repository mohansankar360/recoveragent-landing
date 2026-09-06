import type { MetadataRoute } from "next";
import { SITE_SECTIONS } from "@/lib/site-sections";
import { SITE_USE_CASES } from "@/lib/site-use-cases";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...SITE_USE_CASES.map((useCase) => ({
      url: `${siteUrl}/${useCase.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: useCase.sitemapPriority,
    })),
    ...SITE_SECTIONS.map((section) => ({
      url: `${siteUrl}/${section.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: section.sitemapPriority,
    })),
  ];
}
