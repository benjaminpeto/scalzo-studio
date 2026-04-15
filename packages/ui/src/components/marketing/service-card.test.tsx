import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ServiceCard } from "./service-card";

describe("ServiceCard", () => {
  it("renders the service summary, checklist, and CTA", () => {
    render(
      <ServiceCard
        title="Strategic framing"
        indexLabel="01"
        description="We identify the message and the right visual level."
        items={["Offer positioning", "Conversion hierarchy"]}
        outcome="Clearer homepage direction"
        cta={{ href: "/services/strategy", label: "Explore service" }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Strategic framing" }),
    ).toBeTruthy();
    expect(screen.getByText("Offer positioning")).toBeTruthy();
    expect(screen.getByText("Clearer homepage direction")).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: /Explore service/i })
        .getAttribute("href"),
    ).toBe("/services/strategy");
  });

  it("renders an optional image without requiring metadata", () => {
    render(
      <ServiceCard
        title="Design systems"
        image={{
          alt: "Design system artwork",
          height: 1400,
          src: "/service.jpg",
          width: 1400,
        }}
      />,
    );

    expect(screen.getByAltText("Design system artwork")).toBeTruthy();
  });
});
