import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("sitemap", () => {
  it("includes indexable static pages plus published dynamic detail routes for all locales", async () => {
    vi.doMock("@/actions/services/get-service-sitemap-entries", () => ({
      getServiceSitemapEntries: vi.fn().mockResolvedValue([
        {
          lastModified: "2026-04-01T09:00:00.000Z",
          slug: "strategy-sprints",
        },
      ]),
    }));
    vi.doMock("@/actions/insights/get-insight-sitemap-entries", () => ({
      getInsightSitemapEntries: vi.fn().mockResolvedValue([
        {
          lastModified: "2026-04-02T09:00:00.000Z",
          slug: "editorial-systems",
        },
      ]),
    }));
    vi.doMock("@/actions/work/get-work-sitemap-entries", () => ({
      getWorkSitemapEntries: vi.fn().mockResolvedValue([
        {
          lastModified: "2026-04-03T09:00:00.000Z",
          slug: "featured-1",
        },
      ]),
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

    const { default: sitemap } = await import("./sitemap");

    await expect(sitemap()).resolves.toEqual([
      { lastModified: undefined, url: "https://scalzostudio.com/about" },
      { lastModified: undefined, url: "https://scalzostudio.com/es/about" },
      { lastModified: undefined, url: "https://scalzostudio.com/contact" },
      { lastModified: undefined, url: "https://scalzostudio.com/es/contact" },
      { lastModified: undefined, url: "https://scalzostudio.com/cookies" },
      { lastModified: undefined, url: "https://scalzostudio.com/es/cookies" },
      { lastModified: undefined, url: "https://scalzostudio.com/" },
      { lastModified: undefined, url: "https://scalzostudio.com/es" },
      { lastModified: undefined, url: "https://scalzostudio.com/insights" },
      { lastModified: undefined, url: "https://scalzostudio.com/es/insights" },
      { lastModified: undefined, url: "https://scalzostudio.com/privacy" },
      { lastModified: undefined, url: "https://scalzostudio.com/es/privacy" },
      { lastModified: undefined, url: "https://scalzostudio.com/services" },
      { lastModified: undefined, url: "https://scalzostudio.com/es/services" },
      { lastModified: undefined, url: "https://scalzostudio.com/work" },
      { lastModified: undefined, url: "https://scalzostudio.com/es/work" },
      {
        lastModified: "2026-04-01T09:00:00.000Z",
        url: "https://scalzostudio.com/services/strategy-sprints",
      },
      {
        lastModified: "2026-04-01T09:00:00.000Z",
        url: "https://scalzostudio.com/es/services/strategy-sprints",
      },
      {
        lastModified: "2026-04-02T09:00:00.000Z",
        url: "https://scalzostudio.com/insights/editorial-systems",
      },
      {
        lastModified: "2026-04-02T09:00:00.000Z",
        url: "https://scalzostudio.com/es/insights/editorial-systems",
      },
      {
        lastModified: "2026-04-03T09:00:00.000Z",
        url: "https://scalzostudio.com/work/featured-1",
      },
      {
        lastModified: "2026-04-03T09:00:00.000Z",
        url: "https://scalzostudio.com/es/work/featured-1",
      },
    ]);
  });

  it("excludes non-indexable confirmation routes from the static inventory", async () => {
    vi.doMock("@/actions/services/get-service-sitemap-entries", () => ({
      getServiceSitemapEntries: vi.fn().mockResolvedValue([]),
    }));
    vi.doMock("@/actions/insights/get-insight-sitemap-entries", () => ({
      getInsightSitemapEntries: vi.fn().mockResolvedValue([]),
    }));
    vi.doMock("@/actions/work/get-work-sitemap-entries", () => ({
      getWorkSitemapEntries: vi.fn().mockResolvedValue([]),
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

    const { default: sitemap } = await import("./sitemap");
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).not.toContain("https://scalzostudio.com/contact/thank-you");
    expect(urls).not.toContain("https://scalzostudio.com/newsletter/confirmed");
    expect(urls).not.toContain("https://scalzostudio.com/es/contact/thank-you");
    expect(urls).not.toContain(
      "https://scalzostudio.com/es/newsletter/confirmed",
    );
  });
});
