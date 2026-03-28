// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env/public", () => ({
  publicEnv: {
    siteUrl: "https://example.com",
    supabaseUrl: "https://example.supabase.co",
  },
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(),
}));

import {
  buildNormalizedCaseStudyPayload,
  buildPublishedAtValue,
  buildWorkReturnPath,
  normalizeMetricsRows,
} from "./helpers";

describe("work helpers", () => {
  it("normalizes metrics rows into an object payload", () => {
    const result = normalizeMetricsRows({
      labels: ["Bookings", "Retention"],
      values: ["+24%", "+12%"],
    });

    expect(result.error).toBeNull();
    expect(result.rows).toEqual([
      { label: "Bookings", value: "+24%" },
      { label: "Retention", value: "+12%" },
    ]);
    expect(result.metrics).toEqual({
      Bookings: "+24%",
      Retention: "+12%",
    });
  });

  it("returns an error for duplicate metric labels", () => {
    const result = normalizeMetricsRows({
      labels: ["Bookings", "bookings"],
      values: ["+24%", "+12%"],
    });

    expect(result.error).toContain("unique");
  });

  it("builds the normalized case-study payload", () => {
    const metricsResult = normalizeMetricsRows({
      labels: ["Bookings"],
      values: ["+24%"],
    });

    const result = buildNormalizedCaseStudyPayload(
      {
        approach: "  New approach  ",
        challenge: "  Existing challenge  ",
        clientName: "  Scalzo  ",
        industry: "  Hospitality  ",
        outcomes: "  Stronger outcomes  ",
        published: true,
        seoDescription: "",
        seoTitle: "",
        serviceLines: "Strategy\nDesign",
        slug: "",
        title: "Coastal Launch",
      },
      metricsResult,
    );

    expect(result.errorState).toBeNull();
    expect(result.payload).toMatchObject({
      approach: "New approach",
      challenge: "Existing challenge",
      clientName: "Scalzo",
      industry: "Hospitality",
      metrics: { Bookings: "+24%" },
      outcomes: "Stronger outcomes",
      published: true,
      services: ["Strategy", "Design"],
      slug: "coastal-launch",
      title: "Coastal Launch",
    });
  });

  it("preserves the current publish timestamp when already published", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-27T10:00:00.000Z"));

    expect(
      buildPublishedAtValue({
        currentPublishedAt: "2026-01-01T00:00:00.000Z",
        nextPublished: true,
      }),
    ).toBe("2026-01-01T00:00:00.000Z");
    expect(
      buildPublishedAtValue({
        currentPublishedAt: null,
        nextPublished: false,
      }),
    ).toBeNull();
    expect(
      buildWorkReturnPath({ industry: "Hospitality", status: "saved" }),
    ).toBe("/admin/work?industry=Hospitality&status=saved");

    vi.useRealTimers();
  });
});
