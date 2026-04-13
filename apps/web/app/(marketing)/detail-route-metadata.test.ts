import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

function buildServiceDetail(
  overrides?: Partial<{
    problem: string;
    seoDescription: string | null;
    seoTitle: string | null;
    slug: string;
    summary: string;
    title: string;
    updatedAt: string | null;
  }>,
) {
  return {
    problem: "Clarify the offer before the page starts selling.",
    seoDescription: null,
    seoTitle: null,
    slug: "strategy-sprints",
    summary: "A structured service for tighter positioning and page clarity.",
    title: "Strategy Sprints",
    updatedAt: "2026-04-01T09:00:00.000Z",
    ...overrides,
  };
}

function buildWorkDetail(
  overrides?: Partial<{
    description: string;
    image: string | null;
    outcomes: string;
    publishedAt: string | null;
    seoDescription: string | null;
    seoTitle: string | null;
    slug: string;
    title: string;
    updatedAt: string | null;
  }>,
) {
  return {
    description: "Case study description",
    image: "/work-cover.jpg",
    outcomes: "Commercial outcomes",
    publishedAt: "2026-04-01T09:00:00.000Z",
    seoDescription: null,
    seoTitle: null,
    slug: "featured-1",
    title: "Featured Case Study",
    updatedAt: "2026-04-02T09:00:00.000Z",
    ...overrides,
  };
}

function buildInsightDetail(
  overrides?: Partial<{
    content: string;
    excerpt: string;
    image: string | null;
    publishedAt: string | null;
    seoDescription: string | null;
    seoTitle: string | null;
    slug: string;
    title: string;
    updatedAt: string | null;
  }>,
) {
  return {
    content: "A longer editorial article body.",
    excerpt: "A shorter editorial summary.",
    image: "/insight-cover.jpg",
    publishedAt: "2026-04-01T09:00:00.000Z",
    seoDescription: null,
    seoTitle: null,
    slug: "editorial-systems",
    title: "Editorial Systems",
    updatedAt: "2026-04-02T09:00:00.000Z",
    ...overrides,
  };
}

async function loadServicePageModule(
  detailPageData: ReturnType<typeof buildServiceDetail> | null,
) {
  vi.doMock(
    "@/actions/services/get-resolved-service-detail-route-data",
    () => ({
      getResolvedServiceDetailRouteData: vi
        .fn()
        .mockResolvedValue(detailPageData),
    }),
  );

  return import("./services/[slug]/page");
}

async function loadWorkPageModule({
  detailPageData,
  isPreview,
}: {
  detailPageData: ReturnType<typeof buildWorkDetail> | null;
  isPreview: boolean;
}) {
  vi.doMock("@/actions/work/get-resolved-work-detail-route-data", () => ({
    getResolvedWorkDetailRouteData: vi.fn().mockResolvedValue({
      detailPageData,
      isPreview,
    }),
  }));
  vi.doMock("@/lib/env/public", () => ({
    publicEnv: {
      siteUrl: "https://scalzostudio.com",
    },
    publicFeatureFlags: {
      analyticsEnabled: false,
      calBookingEnabled: false,
      hcaptchaEnabled: false,
    },
  }));

  return import("./work/[slug]/page");
}

async function loadInsightPageModule({
  detailPageData,
  isPreview,
}: {
  detailPageData: ReturnType<typeof buildInsightDetail> | null;
  isPreview: boolean;
}) {
  vi.doMock(
    "@/actions/insights/get-resolved-insight-detail-route-data",
    () => ({
      getResolvedInsightDetailRouteData: vi.fn().mockResolvedValue({
        detailPageData,
        isPreview,
      }),
    }),
  );
  vi.doMock("@/lib/env/public", () => {
    return {
      publicEnv: {
        siteUrl: "https://scalzostudio.com",
      },
      publicFeatureFlags: {
        analyticsEnabled: false,
        calBookingEnabled: false,
        hcaptchaEnabled: false,
      },
    };
  });

  return import("./insights/[slug]/page");
}

describe("service detail metadata", () => {
  it("prefers CMS SEO fields when they exist", async () => {
    const pageModule = await loadServicePageModule(
      buildServiceDetail({
        seoDescription: "Custom CMS description",
        seoTitle: "Custom CMS title",
      }),
    );

    await expect(
      pageModule.generateMetadata({
        params: Promise.resolve({ slug: "strategy-sprints" }),
      }),
    ).resolves.toMatchObject({
      alternates: {
        canonical: "/services/strategy-sprints",
      },
      description: "Custom CMS description",
      openGraph: {
        images: [
          {
            url: "/services/strategy-sprints/opengraph-image",
          },
        ],
      },
      title: "Custom CMS title",
      twitter: {
        images: ["/services/strategy-sprints/opengraph-image"],
      },
    });
  });

  it("falls back to resolved route copy for known slugs when SEO fields are empty", async () => {
    const pageModule = await loadServicePageModule(
      buildServiceDetail({
        problem: "Fallback problem framing",
        summary: "Fallback summary copy",
      }),
    );

    await expect(
      pageModule.generateMetadata({
        params: Promise.resolve({ slug: "strategy-sprints" }),
      }),
    ).resolves.toMatchObject({
      alternates: {
        canonical: "/services/strategy-sprints",
      },
      description: "Fallback summary copy",
      openGraph: {
        images: [
          {
            url: "/services/strategy-sprints/opengraph-image",
          },
        ],
      },
      title: "Strategy Sprints | Services | Scalzo Studio",
    });
  });

  it("does not fabricate indexable metadata for unknown slugs", async () => {
    const pageModule = await loadServicePageModule(null);

    await expect(
      pageModule.generateMetadata({
        params: Promise.resolve({ slug: "missing-service" }),
      }),
    ).resolves.toEqual({
      description: "This page could not be found.",
      robots: {
        follow: false,
        index: false,
      },
      title: "Not found | Scalzo Studio",
    });
  });
});

describe("work detail metadata", () => {
  it("prefers CMS SEO fields and canonicalizes the route", async () => {
    const pageModule = await loadWorkPageModule({
      detailPageData: buildWorkDetail({
        seoDescription: "Case study SEO description",
        seoTitle: "Case study SEO title",
      }),
      isPreview: false,
    });

    await expect(
      pageModule.generateMetadata({
        params: Promise.resolve({ slug: "featured-1" }),
      }),
    ).resolves.toMatchObject({
      alternates: {
        canonical: "/work/featured-1",
      },
      description: "Case study SEO description",
      openGraph: {
        images: [
          {
            url: "/work-cover.jpg",
          },
        ],
      },
      title: "Case study SEO title",
      twitter: {
        images: ["/work-cover.jpg"],
      },
    });
  });

  it("marks preview metadata as non-indexable", async () => {
    const pageModule = await loadWorkPageModule({
      detailPageData: buildWorkDetail(),
      isPreview: true,
    });

    await expect(
      pageModule.generateMetadata({
        params: Promise.resolve({ slug: "featured-1" }),
      }),
    ).resolves.toMatchObject({
      alternates: {
        canonical: "/work/featured-1",
      },
      description: "Case study description",
      openGraph: {
        images: [
          {
            url: "/work-cover.jpg",
          },
        ],
      },
      robots: {
        follow: false,
        index: false,
      },
      title: "Featured Case Study | Work | Scalzo Studio",
    });
  });

  it("falls back to a generated social card when work imagery is missing", async () => {
    const pageModule = await loadWorkPageModule({
      detailPageData: buildWorkDetail({
        image: null,
      }),
      isPreview: false,
    });

    await expect(
      pageModule.generateMetadata({
        params: Promise.resolve({ slug: "featured-1" }),
      }),
    ).resolves.toMatchObject({
      openGraph: {
        images: [
          {
            url: "/work/featured-1/opengraph-image",
          },
        ],
      },
      twitter: {
        images: ["/work/featured-1/opengraph-image"],
      },
    });
  });

  it("returns minimal non-indexable metadata for unknown work slugs", async () => {
    const pageModule = await loadWorkPageModule({
      detailPageData: null,
      isPreview: false,
    });

    await expect(
      pageModule.generateMetadata({
        params: Promise.resolve({ slug: "missing-work" }),
      }),
    ).resolves.toEqual({
      description: "This page could not be found.",
      robots: {
        follow: false,
        index: false,
      },
      title: "Not found | Scalzo Studio",
    });
  });
});

describe("insight detail metadata", () => {
  it("prefers CMS SEO fields when they exist", async () => {
    const pageModule = await loadInsightPageModule({
      detailPageData: buildInsightDetail({
        seoDescription: "Insight SEO description",
        seoTitle: "Insight SEO title",
      }),
      isPreview: false,
    });

    await expect(
      pageModule.generateMetadata({
        params: Promise.resolve({ slug: "editorial-systems" }),
      }),
    ).resolves.toMatchObject({
      alternates: {
        canonical: "/insights/editorial-systems",
      },
      description: "Insight SEO description",
      openGraph: {
        images: [
          {
            url: "/insight-cover.jpg",
          },
        ],
        type: "article",
      },
      title: "Insight SEO title",
      twitter: {
        images: ["/insight-cover.jpg"],
      },
    });
  });

  it("marks preview insights as non-indexable", async () => {
    const pageModule = await loadInsightPageModule({
      detailPageData: buildInsightDetail(),
      isPreview: true,
    });

    await expect(
      pageModule.generateMetadata({
        params: Promise.resolve({ slug: "editorial-systems" }),
      }),
    ).resolves.toMatchObject({
      alternates: {
        canonical: "/insights/editorial-systems",
      },
      description: "A shorter editorial summary.",
      openGraph: {
        images: [
          {
            url: "/insight-cover.jpg",
          },
        ],
        type: "article",
      },
      robots: {
        follow: false,
        index: false,
      },
      title: "Editorial Systems | Insights | Scalzo Studio",
    });
  });

  it("falls back to a generated social card when article imagery is missing", async () => {
    const pageModule = await loadInsightPageModule({
      detailPageData: buildInsightDetail({
        image: null,
      }),
      isPreview: false,
    });

    await expect(
      pageModule.generateMetadata({
        params: Promise.resolve({ slug: "editorial-systems" }),
      }),
    ).resolves.toMatchObject({
      openGraph: {
        images: [
          {
            url: "/insights/editorial-systems/opengraph-image",
          },
        ],
      },
      twitter: {
        images: ["/insights/editorial-systems/opengraph-image"],
      },
    });
  });

  it("returns minimal non-indexable metadata for unknown insight slugs", async () => {
    const pageModule = await loadInsightPageModule({
      detailPageData: null,
      isPreview: false,
    });

    await expect(
      pageModule.generateMetadata({
        params: Promise.resolve({ slug: "missing-insight" }),
      }),
    ).resolves.toEqual({
      description: "This page could not be found.",
      robots: {
        follow: false,
        index: false,
      },
      title: "Not found | Scalzo Studio",
    });
  });
});
