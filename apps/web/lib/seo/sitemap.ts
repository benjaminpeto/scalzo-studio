import { marketingRouteMetadataEntriesByKey } from "./marketing-route-metadata";

interface SitemapRouteEntry {
  lastModified?: string;
  pathname: string;
}

export function getStaticMarketingSitemapRoutes(): SitemapRouteEntry[] {
  return Object.values(marketingRouteMetadataEntriesByKey)
    .filter(
      (entry) => entry.canonical && !("noIndex" in entry && entry.noIndex),
    )
    .map((entry) => ({
      pathname: entry.canonical!,
    }));
}
