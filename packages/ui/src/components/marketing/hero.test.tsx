import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarketingHero } from "./hero";

describe("MarketingHero", () => {
  it("renders headline content, actions, and showcase media", () => {
    render(
      <MarketingHero
        description="Strategy and design aligned into a clearer commercial first impression."
        kicker="Strategy first"
        primaryAction={{ href: "/contact", label: "Start a project" }}
        secondaryAction={{ href: "/work", ariaLabel: "Scroll to projects" }}
        showcase={[
          { src: "/one.jpg", alt: "Editorial composition" },
          { src: "/two.jpg", alt: "Project artwork" },
        ]}
        title="Open your brand wider."
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Open your brand wider." }),
    ).toBeTruthy();
    expect(screen.getByText("Strategy first")).toBeTruthy();

    const primaryLink = screen.getByRole("link", { name: /Start a project/i });
    const secondaryLink = screen.getByRole("link", {
      name: "Scroll to projects",
    });

    expect(primaryLink.getAttribute("href")).toBe("/contact");
    expect(secondaryLink.getAttribute("href")).toBe("/work");
    expect(screen.getByAltText("Editorial composition")).toBeTruthy();
    expect(screen.getByAltText("Project artwork")).toBeTruthy();
  });

  it("omits the secondary action when it is not provided", () => {
    render(
      <MarketingHero
        description="A quieter first impression."
        kicker="Direction"
        primaryAction={{ href: "/contact", label: "Book a call" }}
        showcase={[{ src: "/one.jpg", alt: "Single showcase" }]}
        title="One clear route."
      />,
    );

    expect(screen.queryByLabelText("Scroll to projects")).toBeNull();
  });
});
