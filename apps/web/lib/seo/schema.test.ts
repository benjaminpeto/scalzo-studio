import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env/public", () => ({
  publicEnv: {
    siteUrl: "https://scalzostudio.com",
  },
  publicFeatureFlags: {
    analyticsEnabled: false,
    calBookingEnabled: false,
    hcaptchaEnabled: false,
  },
}));

import {
  buildArticleSchema,
  buildCreativeWorkSchema,
  buildOrganizationSchema,
} from "./schema";

describe("SEO schema helpers", () => {
  it("builds a minimal organization schema without placeholder sameAs links", () => {
    expect(buildOrganizationSchema()).toEqual({
      "@context": "https://schema.org",
      "@id": "https://scalzostudio.com/#organization",
      "@type": "Organization",
      address: {
        "@type": "PostalAddress",
        addressCountry: "ES",
        addressLocality: "Tetir",
        postalCode: "35613",
        streetAddress: "Calle Tetir 59B",
      },
      email: "mailto:ariana@scalzostudio.com",
      name: "Scalzo Studio",
      url: "https://scalzostudio.com",
    });
    expect(buildOrganizationSchema()).not.toHaveProperty("sameAs");
  });

  it("builds article schema linked back to the shared organization", () => {
    expect(
      buildArticleSchema({
        description: "Article summary",
        image: "/insight-cover.jpg",
        modifiedTime: "2026-04-02T09:00:00.000Z",
        publishedTime: "2026-04-01T09:00:00.000Z",
        slug: "editorial-systems",
        title: "Editorial Systems",
      }),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "Article",
      author: {
        "@type": "Person",
        name: "Ariana Carmen Scalzo Dees",
      },
      dateModified: "2026-04-02T09:00:00.000Z",
      datePublished: "2026-04-01T09:00:00.000Z",
      description: "Article summary",
      headline: "Editorial Systems",
      image: ["https://scalzostudio.com/insight-cover.jpg"],
      mainEntityOfPage: "https://scalzostudio.com/insights/editorial-systems",
      publisher: {
        "@id": "https://scalzostudio.com/#organization",
      },
      url: "https://scalzostudio.com/insights/editorial-systems",
    });
  });

  it("builds creative work schema with service keywords when present", () => {
    expect(
      buildCreativeWorkSchema({
        description: "Case study summary",
        image: "/work-cover.jpg",
        modifiedTime: "2026-04-02T09:00:00.000Z",
        publishedTime: "2026-04-01T09:00:00.000Z",
        services: ["Brand", "Web"],
        slug: "featured-1",
        title: "Featured Case Study",
      }),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      creator: {
        "@id": "https://scalzostudio.com/#organization",
      },
      dateModified: "2026-04-02T09:00:00.000Z",
      datePublished: "2026-04-01T09:00:00.000Z",
      description: "Case study summary",
      image: ["https://scalzostudio.com/work-cover.jpg"],
      keywords: "Brand, Web",
      mainEntityOfPage: "https://scalzostudio.com/work/featured-1",
      name: "Featured Case Study",
      publisher: {
        "@id": "https://scalzostudio.com/#organization",
      },
      url: "https://scalzostudio.com/work/featured-1",
    });
  });
});
