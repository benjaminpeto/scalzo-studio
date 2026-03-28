// @vitest-environment node

import { describe, expect, it } from "vitest";

import {
  normalizeKebabSlug,
  normalizeLineSeparatedEntries,
  normalizeOptionalText,
} from "./helpers";

describe("admin shared helpers", () => {
  it("normalizes kebab slugs consistently", () => {
    expect(normalizeKebabSlug("  Crème Brulee Launch  ")).toBe(
      "creme-brulee-launch",
    );
  });

  it("normalizes line-separated entries with trimming and limits", () => {
    expect(
      normalizeLineSeparatedEntries({
        itemLimit: 3,
        itemMaxLength: 20,
        value: " Strategy \n\nDesign\nLaunch support ",
      }),
    ).toEqual({
      error: null,
      items: ["Strategy", "Design", "Launch support"],
    });

    expect(
      normalizeLineSeparatedEntries({
        itemLimit: 1,
        itemMaxLength: 20,
        value: "Strategy\nDesign",
      }),
    ).toEqual({
      error: "Keep this list to 1 items or fewer.",
      items: [],
    });
  });

  it("normalizes optional text to null when empty", () => {
    expect(normalizeOptionalText("  ")).toBeNull();
    expect(normalizeOptionalText("  Summary  ")).toBe("Summary");
  });
});
