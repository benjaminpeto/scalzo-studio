// @vitest-environment node

import { describe, expect, it } from "vitest";

import {
  collectDistinctInsightTags,
  matchesSelectedInsightTag,
  normalizeInsightTag,
} from "./tags";

describe("insight tag helpers", () => {
  it("normalizes and deduplicates tags case-insensitively", () => {
    expect(normalizeInsightTag(" Strategy ")).toBe("strategy");
    expect(
      collectDistinctInsightTags([
        { tags: ["Strategy", "Design"] },
        { tags: ["strategy", "Narrative", "  "] },
      ]),
    ).toEqual(["Design", "Narrative", "Strategy"]);
  });

  it("matches the selected tag against an entry", () => {
    expect(
      matchesSelectedInsightTag(
        { tags: ["Strategy", "Positioning"] },
        " strategy ",
      ),
    ).toBe(true);
    expect(matchesSelectedInsightTag({ tags: ["Strategy"] }, "Narrative")).toBe(
      false,
    );
    expect(matchesSelectedInsightTag({ tags: ["Strategy"] }, null)).toBe(true);
  });
});
