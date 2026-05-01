// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createOrRefreshPendingNewsletterSignupMock: vi.fn(),
  recordWatchdogEventMock: vi.fn(),
  serverFeatureFlags: {
    newsletterSignupEnabled: true,
    serviceRoleEnabled: true,
  },
}));

vi.mock("server-only", () => ({}));

vi.mock("./create-or-refresh-pending-newsletter-signup", () => ({
  createOrRefreshPendingNewsletterSignup:
    mocks.createOrRefreshPendingNewsletterSignupMock,
}));

vi.mock("@/lib/env/server", () => ({
  serverFeatureFlags: mocks.serverFeatureFlags,
}));

vi.mock("@/lib/watchdog/server", () => ({
  recordWatchdogEvent: mocks.recordWatchdogEventMock,
}));

vi.mock("./newsletter-emails", () => ({
  getNewsletterConfirmationMessage: () =>
    "Check your inbox and confirm your subscription to finish joining the newsletter.",
}));

import { submitNewsletterSignup } from "./submit-newsletter-signup";

function buildValidFormData() {
  const formData = new FormData();

  formData.set("email", "reader@example.com");
  formData.set("pagePath", "/insights");
  formData.set("placement", "insights-index");

  return formData;
}

describe("submitNewsletterSignup", () => {
  beforeEach(() => {
    mocks.createOrRefreshPendingNewsletterSignupMock.mockReset();
    mocks.recordWatchdogEventMock.mockReset();
    mocks.serverFeatureFlags.newsletterSignupEnabled = true;
    mocks.serverFeatureFlags.serviceRoleEnabled = true;
  });

  it("returns field errors for invalid submissions", async () => {
    const formData = new FormData();
    formData.set("email", "bad-email");
    formData.set("pagePath", "/insights");
    formData.set("placement", "insights-index");

    const result = await submitNewsletterSignup(
      { fieldErrors: {}, message: null, status: "idle" },
      formData,
    );

    expect(result).toEqual({
      fieldErrors: {
        email: "Enter a valid email address to join the newsletter.",
      },
      message: "Enter a valid email address to join the newsletter.",
      status: "error",
    });
    expect(
      mocks.createOrRefreshPendingNewsletterSignupMock,
    ).not.toHaveBeenCalled();
    expect(mocks.recordWatchdogEventMock).not.toHaveBeenCalled();
  });

  it("returns the unavailable state when the integration is disabled", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mocks.createOrRefreshPendingNewsletterSignupMock.mockResolvedValueOnce(
      "disabled",
    );

    const result = await submitNewsletterSignup(
      { fieldErrors: {}, message: null, status: "idle" },
      buildValidFormData(),
    );

    expect(result).toEqual({
      fieldErrors: {},
      message:
        "Newsletter signup is temporarily unavailable. Please try again later.",
      status: "error",
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Newsletter signup skipped because the integration is disabled",
      {
        emailDomain: "example.com",
        pagePath: "/insights",
        placement: "insights-index",
      },
    );
    expect(mocks.recordWatchdogEventMock).toHaveBeenCalledWith({
      context: {
        emailDomain: "example.com",
        newsletterSignupEnabled: true,
        pagePath: "/insights",
        placement: "insights-index",
        serviceRoleEnabled: true,
      },
      reason: "integration_disabled",
      source: "newsletter_signup",
      status: "error",
    });
  });

  it("returns the already-subscribed success state when the helper reports an existing subscription", async () => {
    mocks.createOrRefreshPendingNewsletterSignupMock.mockResolvedValueOnce(
      "already-subscribed",
    );

    const result = await submitNewsletterSignup(
      { fieldErrors: {}, message: null, status: "idle" },
      buildValidFormData(),
    );

    expect(result).toEqual({
      fieldErrors: {},
      message:
        "This email is already subscribed. Future notes will land there automatically.",
      status: "success",
    });
    expect(mocks.recordWatchdogEventMock).toHaveBeenCalledWith({
      context: {
        emailDomain: "example.com",
        newsletterSignupEnabled: true,
        pagePath: "/insights",
        placement: "insights-index",
        serviceRoleEnabled: true,
      },
      reason: "already_subscribed",
      source: "newsletter_signup",
      status: "success",
    });
  });

  it("returns the inbox confirmation state for a fresh or refreshed pending signup", async () => {
    mocks.createOrRefreshPendingNewsletterSignupMock.mockResolvedValueOnce(
      "pending",
    );

    const result = await submitNewsletterSignup(
      { fieldErrors: {}, message: null, status: "idle" },
      buildValidFormData(),
    );

    expect(result).toEqual({
      fieldErrors: {},
      message:
        "Check your inbox and confirm your subscription to finish joining the newsletter.",
      status: "success",
    });
    expect(mocks.recordWatchdogEventMock).toHaveBeenCalledWith({
      context: {
        emailDomain: "example.com",
        newsletterSignupEnabled: true,
        pagePath: "/insights",
        placement: "insights-index",
        serviceRoleEnabled: true,
      },
      reason: "submitted",
      source: "newsletter_signup",
      status: "success",
    });
  });

  it("returns an error when the helper throws and keeps logs sanitized", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mocks.createOrRefreshPendingNewsletterSignupMock.mockRejectedValueOnce(
      new Error("Resend outage"),
    );

    const result = await submitNewsletterSignup(
      { fieldErrors: {}, message: null, status: "idle" },
      buildValidFormData(),
    );

    expect(result).toEqual({
      fieldErrors: {},
      message:
        "The signup could not be completed right now. Please try again in a moment.",
      status: "error",
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Newsletter signup threw an unexpected error",
      {
        emailDomain: "example.com",
        error: {
          code: null,
          details: null,
          hint: null,
          message: "Resend outage",
          name: "Error",
          statusCode: null,
        },
        pagePath: "/insights",
        placement: "insights-index",
      },
    );
    expect(mocks.recordWatchdogEventMock).toHaveBeenCalledWith({
      context: {
        emailDomain: "example.com",
        errorName: "Error",
        newsletterSignupEnabled: true,
        pagePath: "/insights",
        placement: "insights-index",
        serviceRoleEnabled: true,
      },
      reason: "request_failed",
      source: "newsletter_signup",
      status: "error",
    });
  });
});
