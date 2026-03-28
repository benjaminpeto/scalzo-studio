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
  buildInsightsReturnPath,
  buildNormalizedInsightPayload,
  collectDistinctTags,
  normalizeTagLines,
} from "./helpers";

describe("insights helpers", () => {
  it("deduplicates tags case-insensitively", () => {
    expect(normalizeTagLines("Strategy\nstrategy\nDesign")).toEqual({
      error: null,
      tags: ["Strategy", "Design"],
    });
  });

  it("builds a normalized insight payload", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-27T10:00:00.000Z"));

    const result = buildNormalizedInsightPayload({
      contentMd: "Body",
      excerpt: "  Summary  ",
      published: true,
      seoDescription: "",
      seoTitle: "",
      slug: "",
      tagLines: "Strategy\nDesign",
      title: "Premium Narrative",
    });

    expect(result.errorState).toBeNull();
    expect(result.payload).toMatchObject({
      contentMd: "Body",
      excerpt: "Summary",
      published: true,
      slug: "premium-narrative",
      tags: ["Strategy", "Design"],
      title: "Premium Narrative",
      publishedAt: "2026-03-27T10:00:00.000Z",
    });
    expect(
      collectDistinctTags([
        { tags: ["Strategy", "Design"] },
        { tags: ["strategy", "Narrative"] },
      ]),
    ).toEqual(["Design", "Narrative", "Strategy"]);
    expect(
      buildInsightsReturnPath({
        publishedFilter: "draft",
        status: "publish-updated",
        tag: "Strategy",
      }),
    ).toBe(
      "/admin/insights?published=draft&tag=Strategy&status=publish-updated",
    );

    vi.useRealTimers();
  });
});
