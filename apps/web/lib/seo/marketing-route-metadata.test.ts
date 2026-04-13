import { describe, expect, it } from "vitest";

import {
  marketingRouteMetadata,
  marketingRouteMetadataEntriesByKey,
} from "./marketing-route-metadata";

describe("marketingRouteMetadata", () => {
  it("covers the static public marketing route inventory with non-empty metadata", () => {
    const routeKeys = Object.keys(marketingRouteMetadataEntriesByKey);

    expect(routeKeys).toEqual([
      "about",
      "contact",
      "contactThankYou",
      "cookies",
      "home",
      "insights",
      "newsletterConfirmed",
      "privacy",
      "services",
      "work",
    ]);

    routeKeys.forEach((routeKey) => {
      const metadata =
        marketingRouteMetadata[
          routeKey as keyof typeof marketingRouteMetadataEntriesByKey
        ];
      const title = metadata.title;
      const description = metadata.description;
      const canonical = metadata.alternates?.canonical;
      const openGraphImages = Array.isArray(metadata.openGraph?.images)
        ? metadata.openGraph.images
        : [];
      const socialImage = openGraphImages[0];

      expect(typeof title).toBe("string");
      expect(title).not.toHaveLength(0);
      expect(description).toBeTruthy();
      expect(canonical).toBe(
        marketingRouteMetadataEntriesByKey[
          routeKey as keyof typeof marketingRouteMetadataEntriesByKey
        ].canonical,
      );
      expect(socialImage).toEqual({
        alt: `${title} | Scalzo Studio`,
        url: "/opengraph-image",
      });
      expect(metadata.twitter?.images).toEqual(["/opengraph-image"]);
    });
  });

  it("keeps newsletter confirmation non-indexable", () => {
    expect(marketingRouteMetadata.newsletterConfirmed.robots).toEqual({
      follow: false,
      index: false,
    });
  });

  it("keeps the contact thank-you page non-indexable", () => {
    expect(marketingRouteMetadata.contactThankYou.robots).toEqual({
      follow: false,
      index: false,
    });
  });
});
