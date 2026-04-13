import { legalControllerDetails } from "@/constants/legal/content";
import { publicEnv } from "@/lib/env/public";

export const siteSeo = {
  defaultSocialImagePath: "/opengraph-image",
  description:
    "Editorial product, brand, and content design for growing businesses in the Canary Islands and beyond.",
  name: "Scalzo Studio",
  organizationId: `${publicEnv.siteUrl}/#organization`,
  url: publicEnv.siteUrl,
} as const;

export function buildAbsoluteUrl(pathnameOrUrl: string) {
  return new URL(pathnameOrUrl, publicEnv.siteUrl).toString();
}

export function buildOrganizationAddress() {
  return {
    "@type": "PostalAddress",
    addressCountry: "ES",
    addressLocality: "Tetir",
    postalCode: "35613",
    streetAddress: "Calle Tetir 59B",
  } as const;
}

export function buildOrganizationIdentity() {
  return {
    "@id": siteSeo.organizationId,
    "@type": "Organization",
    address: buildOrganizationAddress(),
    email: `mailto:${legalControllerDetails.email}`,
    name: siteSeo.name,
    url: siteSeo.url,
  } as const;
}
