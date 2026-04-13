import { legalControllerDetails } from "@/constants/legal/content";

import { buildAbsoluteUrl, buildOrganizationIdentity, siteSeo } from "./site";

interface BuildArticleSchemaInput {
  description: string;
  image?: string | null;
  modifiedTime?: string | null;
  publishedTime?: string | null;
  slug: string;
  title: string;
}

interface BuildCreativeWorkSchemaInput {
  description: string;
  image?: string | null;
  modifiedTime?: string | null;
  publishedTime?: string | null;
  services?: readonly string[];
  slug: string;
  title: string;
}

function stripUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}

function resolveImage(image?: string | null) {
  return image ? [buildAbsoluteUrl(image)] : undefined;
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    ...buildOrganizationIdentity(),
  };
}

export function buildArticleSchema({
  description,
  image,
  modifiedTime,
  publishedTime,
  slug,
  title,
}: BuildArticleSchemaInput) {
  const url = buildAbsoluteUrl(`/insights/${slug}`);

  return stripUndefined({
    "@context": "https://schema.org",
    "@type": "Article",
    author: {
      "@type": "Person",
      name: legalControllerDetails.name,
    },
    dateModified: modifiedTime ?? publishedTime ?? undefined,
    datePublished: publishedTime ?? undefined,
    description,
    headline: title,
    image: resolveImage(image),
    mainEntityOfPage: url,
    publisher: {
      "@id": siteSeo.organizationId,
    },
    url,
  });
}

export function buildCreativeWorkSchema({
  description,
  image,
  modifiedTime,
  publishedTime,
  services,
  slug,
  title,
}: BuildCreativeWorkSchemaInput) {
  const url = buildAbsoluteUrl(`/work/${slug}`);

  return stripUndefined({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    creator: {
      "@id": siteSeo.organizationId,
    },
    dateModified: modifiedTime ?? publishedTime ?? undefined,
    datePublished: publishedTime ?? undefined,
    description,
    image: resolveImage(image),
    keywords: services?.length ? services.join(", ") : undefined,
    mainEntityOfPage: url,
    name: title,
    publisher: {
      "@id": siteSeo.organizationId,
    },
    url,
  });
}
