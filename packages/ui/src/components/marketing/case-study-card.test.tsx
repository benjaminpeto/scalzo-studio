import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CaseStudyCard } from "./case-study-card";

describe("CaseStudyCard", () => {
  it("renders image, metadata, outcome, and CTA content", () => {
    render(
      <CaseStudyCard
        title="A coastal stay reframed"
        metadata="Brand and web direction"
        description="Offer hierarchy and page pacing rebuilt around trust."
        outcome="+31% qualified enquiries"
        image={{
          alt: "Case study artwork",
          height: 1400,
          src: "/case-study.jpg",
          width: 1400,
        }}
        cta={{ href: "/projects/coastal", label: "Read case study" }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "A coastal stay reframed" }),
    ).toBeTruthy();
    expect(screen.getByText("Brand and web direction")).toBeTruthy();
    expect(screen.getByText("+31% qualified enquiries")).toBeTruthy();
    expect(screen.getByAltText("Case study artwork")).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: /Read case study/i })
        .getAttribute("href"),
    ).toBe("/projects/coastal");
  });

  it("supports the compact variant with an icon-only CTA label for assistive tech", () => {
    render(
      <CaseStudyCard
        title="A startup product simplified"
        image={{
          alt: "Product interface",
          height: 1400,
          src: "/product.jpg",
          width: 1400,
        }}
        variant="compact"
        cta={{
          href: "/projects/product",
          ariaLabel: "Open product case study",
        }}
      />,
    );

    expect(
      screen.getByRole("link", { name: "Open product case study" }),
    ).toBeTruthy();
  });
});
