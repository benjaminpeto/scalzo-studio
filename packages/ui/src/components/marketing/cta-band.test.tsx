import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarketingCtaBand } from "./cta-band";

describe("MarketingCtaBand", () => {
  it("renders the main CTA content, quick brief, and email link", () => {
    render(
      <MarketingCtaBand
        briefItems={["What changed?", "Where is the friction?"]}
        briefKicker="Quick brief"
        contactId="contact"
        description="A direct conversation about what needs to feel clearer."
        email={{ href: "mailto:hello@example.com", label: "hello@example.com" }}
        kicker="Brand organiser"
        primaryAction={{ href: "/contact", label: "Book a discovery call" }}
        secondaryAction={{ href: "/journal", label: "Read the journal" }}
        title="Ready to sharpen the page?"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Ready to sharpen the page?" }),
    ).toBeTruthy();
    expect(screen.getByText("What changed?")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /Book a discovery call/i }),
    ).toHaveProperty("href");
    expect(
      screen
        .getByRole("link", { name: /Read the journal/i })
        .getAttribute("href"),
    ).toBe("/journal");
    expect(
      screen.getByRole("link", { name: /hello@example.com/i }),
    ).toBeTruthy();
  });

  it("supports a single-action variant", () => {
    render(
      <MarketingCtaBand
        briefItems={["One prompt only"]}
        briefKicker="Brief"
        description="One clear next step."
        email={{ href: "mailto:hello@example.com", label: "hello@example.com" }}
        kicker="Contact"
        primaryAction={{ href: "/contact", label: "Start now" }}
        title="Simple CTA"
      />,
    );

    expect(
      screen.queryByRole("link", { name: /Read the journal/i }),
    ).toBeNull();
  });
});
