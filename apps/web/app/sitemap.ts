import type { MetadataRoute } from "next";

import { getInsightSitemapEntries } from "@/actions/insights/get-insight-sitemap-entries";
import { getServiceSitemapEntries } from "@/actions/services/get-service-sitemap-entries";
import { getWorkSitemapEntries } from "@/actions/work/get-work-sitemap-entries";
import { getStaticMarketingSitemapRoutes } from "@/lib/seo/sitemap";
import { buildAbsoluteUrl } from "@/lib/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [serviceEntries, insightEntries, workEntries] = await Promise.all([
    getServiceSitemapEntries(),
    getInsightSitemapEntries(),
    getWorkSitemapEntries(),
  ]);

  return [
    ...getStaticMarketingSitemapRoutes().map((entry) => ({
      lastModified: entry.lastModified,
      url: buildAbsoluteUrl(entry.pathname),
    })),
    ...serviceEntries.map((entry) => ({
      lastModified: entry.lastModified,
      url: buildAbsoluteUrl(`/services/${entry.slug}`),
    })),
    ...insightEntries.map((entry) => ({
      lastModified: entry.lastModified,
      url: buildAbsoluteUrl(`/insights/${entry.slug}`),
    })),
    ...workEntries.map((entry) => ({
      lastModified: entry.lastModified,
      url: buildAbsoluteUrl(`/work/${entry.slug}`),
    })),
  ];
}
