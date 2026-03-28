import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { QuoteRequestForm } from "./quote-request-form";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  useQuoteRequestForm: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mocks.replace,
  }),
}));

vi.mock("@/hooks/contact/use-quote-request-form", () => ({
  useQuoteRequestForm: mocks.useQuoteRequestForm,
}));

describe("QuoteRequestForm", () => {
  it("redirects to the thank-you route after a successful submission", async () => {
    mocks.useQuoteRequestForm.mockReturnValue({
      activeStep: 0,
      formAction: vi.fn(),
      handleNextStep: vi.fn(),
      handlePreviousStep: vi.fn(),
      handleSubmit: vi.fn(),
      isPending: false,
      referrer: "",
      serverState: {
        fieldErrors: {},
        message: "Thanks. The request is in and will be reviewed shortly.",
        status: "success",
      },
      setActiveStep: vi.fn(),
      stepErrors: {},
      updateField: vi.fn(),
      utmValues: {
        utmCampaign: "",
        utmContent: "",
        utmMedium: "",
        utmSource: "",
        utmTerm: "",
      },
      values: {
        budgetBand: "",
        company: "",
        consent: false,
        email: "",
        honeypot: "",
        location: "",
        message: "",
        name: "",
        primaryGoal: "",
        projectType: "",
        servicesInterest: [],
        timelineBand: "",
        website: "",
      },
    });

    render(<QuoteRequestForm />);

    expect(screen.getByText("Submission received")).not.toBeNull();
    await waitFor(() => {
      expect(mocks.replace).toHaveBeenCalledWith("/contact/thank-you");
    });
  });
});
