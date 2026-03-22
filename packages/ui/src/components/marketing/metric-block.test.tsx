import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MetricBlock } from "./metric-block";

describe("MetricBlock", () => {
  it("renders the metric value and label", () => {
    render(
      <MetricBlock label="Clear UX and conversion thinking" value="Product" />,
    );

    expect(screen.getByText("Product")).toBeTruthy();
    expect(screen.getByText("Clear UX and conversion thinking")).toBeTruthy();
  });

  it("merges custom classes onto the root element", () => {
    const { container } = render(
      <MetricBlock
        className="custom-root"
        label="Editorial structure"
        value="Content"
      />,
    );

    expect(container.firstChild).toBeTruthy();
    expect((container.firstChild as HTMLElement).className).toContain(
      "custom-root",
    );
  });
});
