import type { Metadata } from "next";

interface BuildRouteMetadataInput {
  canonical?: string;
  description: string;
  noIndex?: boolean;
  title: string;
}

const nonIndexRobots = {
  follow: false,
  index: false,
} as const;

function normalizeCanonicalPath(canonical: string) {
  const pathname = new URL(canonical, "https://scalzostudio.com").pathname;

  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export function buildRouteMetadata({
  canonical,
  description,
  noIndex = false,
  title,
}: BuildRouteMetadataInput): Metadata {
  return {
    alternates: canonical
      ? {
          canonical: normalizeCanonicalPath(canonical),
        }
      : undefined,
    description,
    robots: noIndex ? nonIndexRobots : undefined,
    title,
  };
}

export function buildNotFoundRouteMetadata(): Metadata {
  return buildRouteMetadata({
    description: "This page could not be found.",
    noIndex: true,
    title: "Not found | Scalzo Studio",
  });
}
