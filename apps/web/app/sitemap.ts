import type { MetadataRoute } from "next";

import { getInsightSitemapEntries } from "@/actions/insights/get-insight-sitemap-entries";
import { getServiceSitemapEntries } from "@/actions/services/get-service-sitemap-entries";
import { getWorkSitemapEntries } from "@/actions/work/get-work-sitemap-entries";
import { getStaticMarketingSitemapRoutes } from "@/lib/seo/sitemap";
import { buildAbsoluteUrl } from "@/lib/seo/site";
import { locales } from "@/lib/i18n/routing";

function localizePath(pathname: string, locale: string): string {
  if (locale === "en") return pathname;
  return pathname === "/" ? "/es" : `/es${pathname}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [serviceEntries, insightEntries, workEntries] = await Promise.all([
    getServiceSitemapEntries(),
    getInsightSitemapEntries(),
    getWorkSitemapEntries(),
  ]);

  return [
    ...getStaticMarketingSitemapRoutes().flatMap((entry) =>
      locales.map((locale) => ({
        lastModified: entry.lastModified,
        url: buildAbsoluteUrl(localizePath(entry.pathname, locale)),
      })),
    ),
    ...serviceEntries.flatMap((entry) =>
      locales.map((locale) => ({
        lastModified: entry.lastModified,
        url: buildAbsoluteUrl(localizePath(`/services/${entry.slug}`, locale)),
      })),
    ),
    ...insightEntries.flatMap((entry) =>
      locales.map((locale) => ({
        lastModified: entry.lastModified,
        url: buildAbsoluteUrl(localizePath(`/insights/${entry.slug}`, locale)),
      })),
    ),
    ...workEntries.flatMap((entry) =>
      locales.map((locale) => ({
        lastModified: entry.lastModified,
        url: buildAbsoluteUrl(localizePath(`/work/${entry.slug}`, locale)),
      })),
    ),
  ];
}
