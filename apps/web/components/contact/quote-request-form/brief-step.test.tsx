import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BriefStep } from "./brief-step";

describe("BriefStep", () => {
  it("renders the newsletter opt-in checked by default and lets the user opt out", () => {
    const updateField = vi.fn();

    render(
      <BriefStep
        stepErrors={{}}
        updateField={updateField}
        values={{
          budgetBand: "1000-3000",
          company: "Scalzo",
          consent: true,
          email: "hello@example.com",
          honeypot: "",
          location: "uk-europe",
          message:
            "We need a clearer commercial story and a stronger conversion path.",
          name: "Ben",
          newsletterOptIn: true,
          primaryGoal: "Improve conversion clarity",
          projectType: "homepage",
          servicesInterest: ["strategic-framing"],
          timelineBand: "2-4-weeks",
          website: "https://example.com",
        }}
      />,
    );

    const newsletterCheckbox = screen.getByRole("checkbox", {
      name: /sign me up for occasional editorial notes/i,
    });

    expect((newsletterCheckbox as HTMLInputElement).checked).toBe(true);

    fireEvent.click(newsletterCheckbox);

    expect(updateField).toHaveBeenCalledWith("newsletterOptIn", false);
  });
});
