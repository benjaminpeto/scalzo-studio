import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TestimonialCard } from "./testimonial-card";

describe("TestimonialCard", () => {
  it("renders quote, attribution, company, and optional image", () => {
    render(
      <TestimonialCard
        company="Coastal hospitality brand"
        image={{ src: "/avatar.jpg", alt: "Client portrait" }}
        name="Marta R."
        quote="The homepage finally started sounding like the business we were already running."
        role="Founder"
      />,
    );

    expect(
      screen.getByText(
        "The homepage finally started sounding like the business we were already running.",
      ),
    ).toBeTruthy();
    expect(screen.getByText("Marta R.")).toBeTruthy();
    expect(screen.getByText(/Founder/)).toBeTruthy();
    expect(screen.getByAltText("Client portrait")).toBeTruthy();
  });

  it("renders without image and company when they are omitted", () => {
    render(
      <TestimonialCard
        name="Daniel V."
        quote="A clearer story helped the team support better conversations."
        role="Managing director"
      />,
    );

    expect(screen.getByText("Daniel V.")).toBeTruthy();
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("Managing director")).toBeTruthy();
  });
});
