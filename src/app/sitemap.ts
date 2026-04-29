import type { MetadataRoute } from "next";

import { DEFAULT_LOCALE, LOCALES } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://openzap.app";

  return LOCALES.map((locale) => {
    const path = locale === DEFAULT_LOCALE ? "" : `/${locale}`;

    return {
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: locale === DEFAULT_LOCALE ? 1 : 0.9,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [
            l,
            `${siteUrl}${l === DEFAULT_LOCALE ? "" : `/${l}`}`,
          ]),
        ),
      },
    };
  });
}
