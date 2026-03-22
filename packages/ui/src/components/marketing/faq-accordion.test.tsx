import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { FaqAccordion } from "./faq-accordion";

vi.mock("motion/react", () => {
  function MotionDiv({
    children,
    className,
    id,
    role,
    "aria-labelledby": ariaLabelledBy,
  }: React.ComponentProps<"div"> & {
    animate?: unknown;
    exit?: unknown;
    initial?: unknown;
    transition?: unknown;
  }) {
    return (
      <div
        aria-labelledby={ariaLabelledBy}
        className={className}
        id={id}
        role={role}
      >
        {children}
      </div>
    );
  }

  function MotionSpan({
    children,
    className,
    "aria-hidden": ariaHidden,
  }: React.ComponentProps<"span"> & {
    animate?: unknown;
    exit?: unknown;
    initial?: unknown;
    transition?: unknown;
  }) {
    return (
      <span aria-hidden={ariaHidden} className={className}>
        {children}
      </span>
    );
  }

  return {
    AnimatePresence({ children }: { children: React.ReactNode }) {
      return <>{children}</>;
    },
    motion: {
      div: MotionDiv,
      span: MotionSpan,
    },
  };
});

describe("FaqAccordion", () => {
  it("opens the default item and switches panels on click", () => {
    render(
      <FaqAccordion
        items={[
          {
            question: "What kind of projects are the best fit?",
            answer:
              "Projects with a strong offer and unclear first impression.",
          },
          {
            question: "How do projects usually start?",
            answer: "They start with a short review of the current site.",
          },
        ]}
      />,
    );

    const firstTrigger = screen.getByRole("button", {
      name: "What kind of projects are the best fit?",
    });
    const secondTrigger = screen.getByRole("button", {
      name: "How do projects usually start?",
    });

    expect(firstTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(secondTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(
      screen.getByText(
        "Projects with a strong offer and unclear first impression.",
      ),
    ).toBeTruthy();

    fireEvent.click(secondTrigger);

    expect(firstTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(secondTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(
      screen.getByText("They start with a short review of the current site."),
    ).toBeTruthy();
  });

  it("renders a fallback card when no items are available", () => {
    render(
      <FaqAccordion
        emptyMessage="No FAQ entries have been published yet."
        items={[]}
      />,
    );

    expect(
      screen.getByText("No FAQ entries have been published yet."),
    ).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
