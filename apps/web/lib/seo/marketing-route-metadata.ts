import type { Metadata } from "next";

import { buildRouteMetadata } from "./route-metadata";

const marketingRouteMetadataEntries = {
  about: {
    canonical: "/about",
    description:
      "About Scalzo Studio: a Canary Islands-based editorial design studio focused on clearer positioning, stronger digital surfaces, and calmer commercial decisions.",
    title: "About | Scalzo Studio",
  },
  contact: {
    canonical: "/contact",
    description:
      "Contact Scalzo Studio to request a quote or book a discovery call for positioning, design systems, and digital rollout work.",
    title: "Contact | Scalzo Studio",
  },
  contactThankYou: {
    canonical: "/contact/thank-you",
    description:
      "Thanks for contacting Scalzo Studio. Review the next steps or book a discovery call while your quote request is being reviewed.",
    noIndex: true,
    title: "Thanks | Scalzo Studio",
  },
  cookies: {
    canonical: "/cookies",
    description:
      "Cookie notice for Scalzo Studio covering essential session cookies, conditional future analytics or anti-spam storage, and the current consent-first EU launch posture.",
    title: "Cookies | Scalzo Studio",
  },
  home: {
    canonical: "/",
    description:
      "Editorial product, brand, and content design for growing businesses in the Canary Islands and beyond.",
    title: "Scalzo Studio",
  },
  insights: {
    canonical: "/insights",
    description:
      "Editorial notes on positioning, page structure, design systems, and the visual signals that make service businesses easier to trust.",
    title: "Insights | Scalzo Studio",
  },
  newsletterConfirmed: {
    canonical: "/newsletter/confirmed",
    description:
      "Newsletter confirmation state for Scalzo Studio editorial updates.",
    noIndex: true,
    title: "Newsletter confirmation | Scalzo Studio",
  },
  privacy: {
    canonical: "/privacy",
    description:
      "Privacy notice for Scalzo Studio covering contact requests, admin authentication, conditional future processors, and the current essential-only EU launch posture.",
    title: "Privacy | Scalzo Studio",
  },
  services: {
    canonical: "/services",
    description:
      "Outcome-focused strategy, design, and rollout services for businesses that need clearer positioning and stronger page confidence.",
    title: "Services | Scalzo Studio",
  },
  work: {
    canonical: "/work",
    description:
      "Published case studies showing how clearer positioning, stronger design direction, and calmer digital systems improve commercial outcomes.",
    title: "Work | Scalzo Studio",
  },
} as const;

export type MarketingRouteMetadataKey =
  keyof typeof marketingRouteMetadataEntries;

export const marketingRouteMetadataEntriesByKey =
  marketingRouteMetadataEntries satisfies Record<
    string,
    Parameters<typeof buildRouteMetadata>[0]
  >;

export const marketingRouteMetadata = Object.fromEntries(
  Object.entries(marketingRouteMetadataEntries).map(([key, value]) => [
    key,
    buildRouteMetadata(value),
  ]),
) as Record<MarketingRouteMetadataKey, Metadata>;

export function getMarketingRouteMetadata(
  locale: string,
  key: MarketingRouteMetadataKey,
): Metadata {
  const entry = marketingRouteMetadataEntries[key];
  return buildRouteMetadata({ ...entry, locale });
}
