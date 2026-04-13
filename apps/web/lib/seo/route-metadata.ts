import type { Metadata } from "next";

interface BuildRouteMetadataInput {
  canonical?: string;
  description: string;
  noIndex?: boolean;
  openGraphType?: "article" | "website";
  publishedTime?: string | null;
  socialFallbackPath?: string;
  socialImage?: string | null;
  socialImageAlt?: string;
  title: string;
  updatedTime?: string | null;
}

const nonIndexRobots = {
  follow: false,
  index: false,
} as const;

const defaultSocialImagePath = "/opengraph-image";

function normalizeCanonicalPath(canonical: string) {
  const pathname = new URL(canonical, "https://scalzostudio.com").pathname;

  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function resolveSocialImage({
  socialFallbackPath,
  socialImage,
}: Pick<
  BuildRouteMetadataInput,
  "socialFallbackPath" | "socialImage"
>): string {
  const candidate = socialImage?.trim() || socialFallbackPath?.trim();

  return candidate && candidate.length > 0 ? candidate : defaultSocialImagePath;
}

export function buildRouteMetadata({
  canonical,
  description,
  noIndex = false,
  openGraphType = "website",
  publishedTime,
  socialFallbackPath,
  socialImage,
  socialImageAlt,
  title,
  updatedTime,
}: BuildRouteMetadataInput): Metadata {
  const normalizedCanonical = canonical
    ? normalizeCanonicalPath(canonical)
    : undefined;
  const resolvedSocialImage = resolveSocialImage({
    socialFallbackPath,
    socialImage,
  });
  const openGraph = {
    description,
    images: [
      {
        alt: socialImageAlt ?? `${title} | Scalzo Studio`,
        url: resolvedSocialImage,
      },
    ],
    siteName: "Scalzo Studio",
    title,
    type: openGraphType,
    url: normalizedCanonical,
  } satisfies NonNullable<Metadata["openGraph"]>;

  if (openGraphType === "article") {
    Object.assign(openGraph, {
      modifiedTime: updatedTime ?? undefined,
      publishedTime: publishedTime ?? undefined,
    });
  }

  return {
    alternates: normalizedCanonical
      ? {
          canonical: normalizedCanonical,
        }
      : undefined,
    description,
    openGraph,
    robots: noIndex ? nonIndexRobots : undefined,
    title,
    twitter: {
      card: "summary_large_image",
      description,
      images: [resolvedSocialImage],
      title,
    },
  };
}

export function buildNotFoundRouteMetadata(): Metadata {
  return {
    description: "This page could not be found.",
    robots: nonIndexRobots,
    title: "Not found | Scalzo Studio",
  };
}
