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
      title: "Route title",
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
