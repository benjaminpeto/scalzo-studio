import { describe, expect, it } from "vitest";

import {
  buildNotFoundRouteMetadata,
  buildRouteMetadata,
} from "./route-metadata";

describe("buildRouteMetadata", () => {
  it("normalizes canonicals to path-only values without trailing slashes", () => {
    const metadata = buildRouteMetadata({
      canonical: "https://scalzostudio.com/services/strategy-sprints/?ref=nav",
      description: "Route description",
      title: "Route title",
    });

    expect(metadata).toMatchObject({
      alternates: {
        canonical: "/services/strategy-sprints",
      },
      description: "Route description",
      openGraph: {
        description: "Route description",
        images: [
          {
            alt: "Route title | Scalzo Studio",
            url: "/opengraph-image",
          },
        ],
        siteName: "Scalzo Studio",
        title: "Route title",
        type: "website",
        url: "/services/strategy-sprints",
      },
      title: "Route title",
      twitter: {
        card: "summary_large_image",
        description: "Route description",
        images: ["/opengraph-image"],
        title: "Route title",
      },
    });
    expect(metadata.robots).toBeUndefined();
  });

  it("adds non-index robots when requested", () => {
    const metadata = buildRouteMetadata({
      canonical: "/insights?tag=strategy",
      description: "Preview route",
      noIndex: true,
      title: "Preview title",
    });

    expect(metadata.alternates?.canonical).toBe("/insights");
    expect(metadata.robots).toEqual({
      follow: false,
      index: false,
    });
  });

  it("prefers explicit social images and article metadata when provided", () => {
    const metadata = buildRouteMetadata({
      canonical: "/insights/editorial-systems",
      description: "Article summary",
      openGraphType: "article",
      publishedTime: "2026-04-01T09:00:00.000Z",
      socialFallbackPath: "/insights/editorial-systems/opengraph-image",
      socialImage: "https://cdn.example.com/editorial.jpg",
      socialImageAlt: "Article cover",
      title: "Editorial Systems",
      updatedTime: "2026-04-02T09:00:00.000Z",
    });

    expect(metadata.openGraph).toEqual({
      description: "Article summary",
      images: [
        {
          alt: "Article cover",
          url: "https://cdn.example.com/editorial.jpg",
        },
      ],
      modifiedTime: "2026-04-02T09:00:00.000Z",
      publishedTime: "2026-04-01T09:00:00.000Z",
      siteName: "Scalzo Studio",
      title: "Editorial Systems",
      type: "article",
      url: "/insights/editorial-systems",
    });
    expect(metadata.twitter).toEqual({
      card: "summary_large_image",
      description: "Article summary",
      images: ["https://cdn.example.com/editorial.jpg"],
      title: "Editorial Systems",
    });
  });
});

describe("buildNotFoundRouteMetadata", () => {
  it("returns a minimal non-indexable metadata shape without a canonical", () => {
    expect(buildNotFoundRouteMetadata()).toEqual({
      description: "This page could not be found.",
      robots: {
        follow: false,
        index: false,
      },
      title: "Not found | Scalzo Studio",
    });
  });
});
