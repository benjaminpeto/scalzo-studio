// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(),
}));

import {
  buildNormalizedServicePayload,
  buildServicesReturnPath,
} from "./helpers";

describe("services helpers", () => {
  it("normalizes a valid service payload", () => {
    const result = buildNormalizedServicePayload({
      contentMd: "  Markdown body  ",
      deliverables: "Audit\nLaunch support",
      published: true,
      seoDescription: "  SEO description  ",
      seoTitle: "  SEO title  ",
      slug: "",
      summary: "  Summary  ",
      title: "Conversion Strategy",
    });

    expect(result.errorState).toBeNull();
    expect(result.payload).toMatchObject({
      contentMd: "Markdown body",
      deliverables: ["Audit", "Launch support"],
      published: true,
      seoDescription: "SEO description",
      seoTitle: "SEO title",
      slug: "conversion-strategy",
      summary: "Summary",
      title: "Conversion Strategy",
    });
  });

  it("returns a field error for reserved slugs", () => {
    const result = buildNormalizedServicePayload({
      contentMd: "",
      deliverables: "",
      published: false,
      seoDescription: "",
      seoTitle: "",
      slug: "new",
      summary: "",
      title: "Ignored",
    });

    expect(result.payload).toBeNull();
    expect(result.errorState?.fieldErrors.slug).toContain("reserved");
  });

  it("builds the filtered return path", () => {
    expect(
      buildServicesReturnPath({
        query: "strategy",
        status: "publish-updated",
      }),
    ).toBe("/admin/services?q=strategy&status=publish-updated");
  });
});
