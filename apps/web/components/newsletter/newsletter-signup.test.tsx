import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { NewsletterSignup } from "./newsletter-signup";

const mocks = vi.hoisted(() => ({
  useNewsletterSignupForm: vi.fn(),
  usePathname: vi.fn(),
}));

vi.mock("@/components/home/motion", () => ({
  Reveal: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("next/navigation", () => ({
  usePathname: mocks.usePathname,
}));

vi.mock("@/hooks/newsletter/use-newsletter-signup-form", () => ({
  useNewsletterSignupForm: mocks.useNewsletterSignupForm,
}));

describe("NewsletterSignup", () => {
  it("renders the editorial variant for the homepage with the placement payload", () => {
    mocks.usePathname.mockReturnValue("/");
    mocks.useNewsletterSignupForm.mockReturnValue({
      formAction: vi.fn(),
      isPending: false,
      serverState: {
        fieldErrors: {},
        message: null,
        status: "idle",
      },
    });

    const { container } = render(<NewsletterSignup placement="home" />);

    expect(
      screen.getByText(
        "Quiet notes on product, brand, and content for studios and growing teams.",
      ),
    ).not.toBeNull();
    expect(
      container.querySelector('input[name="placement"][value="home"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('input[name="pagePath"][value="/"]'),
    ).not.toBeNull();
  });

  it("renders the footer variant with an accessible email label", () => {
    mocks.usePathname.mockReturnValue("/");
    mocks.useNewsletterSignupForm.mockReturnValue({
      formAction: vi.fn(),
      isPending: false,
      serverState: {
        fieldErrors: {},
        message: null,
        status: "idle",
      },
    });

    const { container } = render(<NewsletterSignup placement="footer" />);

    expect(
      screen.getByRole("heading", { name: "Quiet notes, sent occasionally." }),
    ).not.toBeNull();
    expect(
      screen.getByRole("textbox", { name: "Email address" }),
    ).not.toBeNull();
    expect(
      container.querySelector('input[name="placement"][value="footer"]'),
    ).not.toBeNull();
  });

  it("renders the inline insights-detail variant and shows the success message when submitted", () => {
    mocks.usePathname.mockReturnValue("/insights/clarity");
    mocks.useNewsletterSignupForm.mockReturnValue({
      formAction: vi.fn(),
      isPending: false,
      serverState: {
        fieldErrors: {},
        message:
          "Check your inbox and confirm your subscription to finish joining the newsletter.",
        status: "success",
      },
    });

    const { container } = render(
      <NewsletterSignup placement="insights-detail" />,
    );

    expect(screen.getByText("Get the next note in your inbox.")).not.toBeNull();
    expect(
      screen.getByText(
        "Check your inbox and confirm your subscription to finish joining the newsletter.",
      ),
    ).not.toBeNull();
    expect(
      container.querySelector(
        'input[name="placement"][value="insights-detail"]',
      ),
    ).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Join the newsletter" }),
    ).toBeNull();
  });
});
