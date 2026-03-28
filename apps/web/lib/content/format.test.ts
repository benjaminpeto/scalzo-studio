// @vitest-environment node

import { describe, expect, it } from "vitest";

import { formatPublishedDate, titleCaseFromSlug } from "./format";

describe("content format helpers", () => {
  it("formats valid published dates and falls back for invalid values", () => {
    expect(formatPublishedDate("2026-03-27T10:00:00.000Z", "Fallback")).toBe(
      "March 27, 2026",
    );
    expect(formatPublishedDate(null, "Fallback")).toBe("Fallback");
    expect(formatPublishedDate("invalid", "Fallback")).toBe("Fallback");
  });

  it("converts slugs into title case labels", () => {
    expect(titleCaseFromSlug("premium-service-brand")).toBe(
      "Premium Service Brand",
    );
  });
});
