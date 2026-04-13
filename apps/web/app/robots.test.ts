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

import robots from "./robots";

describe("robots", () => {
  it("allows crawling of public pages and points to the absolute sitemap URL", () => {
    expect(robots()).toEqual({
      rules: {
        allow: "/",
        userAgent: "*",
      },
      sitemap: "https://scalzostudio.com/sitemap.xml",
    });
  });
});
