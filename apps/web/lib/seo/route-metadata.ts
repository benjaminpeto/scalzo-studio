import type { Metadata } from "next";

interface BuildRouteMetadataInput {
  canonical?: string;
  description: string;
  locale?: string;
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

function buildLocalizedPath(path: string, locale: string): string {
  if (locale === "en") return path;
  return path === "/" ? "/es" : `/es${path}`;
}

export function buildRouteMetadata({
  canonical,
  description,
  locale,
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

  const localizedCanonical =
    normalizedCanonical && locale
      ? buildLocalizedPath(normalizedCanonical, locale)
      : normalizedCanonical;

  const alternates = normalizedCanonical
    ? {
        canonical: localizedCanonical ?? normalizedCanonical,
        ...(locale
          ? {
              languages: {
                en: normalizedCanonical,
                es: buildLocalizedPath(normalizedCanonical, "es"),
                "x-default": normalizedCanonical,
              },
            }
          : {}),
      }
    : undefined;

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
    url: localizedCanonical ?? normalizedCanonical,
  } satisfies NonNullable<Metadata["openGraph"]>;

  if (openGraphType === "article") {
    Object.assign(openGraph, {
      modifiedTime: updatedTime ?? undefined,
      publishedTime: publishedTime ?? undefined,
    });
  }

  return {
    alternates,
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

const notFoundTextByLocale: Record<
  string,
  { description: string; title: string }
> = {
  en: {
    description: "This page could not be found.",
    title: "Not found | Scalzo Studio",
  },
  es: {
    description: "No se pudo encontrar esta página.",
    title: "No encontrado | Scalzo Studio",
  },
};

export function buildNotFoundRouteMetadata(locale = "en"): Metadata {
  const text = notFoundTextByLocale[locale] ?? notFoundTextByLocale.en;
  return {
    description: text.description,
    robots: nonIndexRobots,
    title: text.title,
  };
}
