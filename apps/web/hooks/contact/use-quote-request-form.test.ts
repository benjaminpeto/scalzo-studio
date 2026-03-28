import { act, renderHook } from "@testing-library/react";
import type { FormEvent } from "react";
import { describe, expect, it, vi } from "vitest";

import { useQuoteRequestForm } from "./use-quote-request-form";

vi.mock("@/actions/contact/submit-quote-request", () => ({
  submitQuoteRequest: vi.fn(),
}));

describe("useQuoteRequestForm", () => {
  it("advances to the next step when the current step is valid", () => {
    const { result } = renderHook(() => useQuoteRequestForm());

    act(() => {
      result.current.updateField("servicesInterest", ["strategic-framing"]);
      result.current.updateField(
        "primaryGoal",
        "Clarify the offer and improve conversion",
      );
    });

    act(() => {
      result.current.handleNextStep(4);
    });

    expect(result.current.activeStep).toBe(1);
  });

  it("blocks submit and surfaces client-side errors when required fields are missing", () => {
    const preventDefault = vi.fn();
    const { result } = renderHook(() => useQuoteRequestForm());

    act(() => {
      result.current.handleSubmit({
        preventDefault,
      } as unknown as FormEvent<HTMLFormElement>);
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(result.current.stepErrors.servicesInterest).toBe(
      "Choose at least one service area.",
    );
    expect(result.current.activeStep).toBe(0);
  });
});
