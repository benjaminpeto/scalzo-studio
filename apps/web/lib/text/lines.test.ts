// @vitest-environment node

import { describe, expect, it } from "vitest";

import { splitLineSeparatedEntries } from "./lines";

describe("text line helpers", () => {
  it("splits, trims, and removes empty lines", () => {
    expect(
      splitLineSeparatedEntries(" Strategy \n\nDesign\r\n Launch "),
    ).toEqual(["Strategy", "Design", "Launch"]);
  });
});
