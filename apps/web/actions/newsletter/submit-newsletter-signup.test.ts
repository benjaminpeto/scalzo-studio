// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { submitNewsletterSignup } from "./submit-newsletter-signup";

const mocks = vi.hoisted(() => ({
  buildNewsletterConfirmationEmailPayloadMock: vi.fn(),
  eqMock: vi.fn(),
  fromMock: vi.fn(),
  insertMock: vi.fn(),
  maybeSingleMock: vi.fn(),
  sendNewsletterConfirmationEmailMock: vi.fn(),
  serverFeatureFlags: {
    newsletterSignupEnabled: true,
  },
  updateMock: vi.fn(),
}));

vi.mock("@/lib/env/server", () => ({
  serverFeatureFlags: mocks.serverFeatureFlags,
}));

vi.mock("@/lib/supabase/service-role", () => ({
  createServiceRoleSupabaseClient: () => ({
    from: mocks.fromMock,
  }),
}));

vi.mock("./newsletter-emails", () => ({
  buildNewsletterConfirmationEmailPayload:
    mocks.buildNewsletterConfirmationEmailPayloadMock,
  getNewsletterConfirmationMessage: () =>
    "Check your inbox and confirm your subscription to finish joining the newsletter.",
  sendNewsletterConfirmationEmail: mocks.sendNewsletterConfirmationEmailMock,
}));

function buildValidFormData() {
  const formData = new FormData();

  formData.set("email", "reader@example.com");
  formData.set("pagePath", "/insights");
  formData.set("placement", "insights-index");

  return formData;
}

describe("submitNewsletterSignup", () => {
  beforeEach(() => {
    mocks.buildNewsletterConfirmationEmailPayloadMock.mockReset();
    mocks.eqMock.mockReset();
    mocks.fromMock.mockReset();
    mocks.insertMock.mockReset();
    mocks.maybeSingleMock.mockReset();
    mocks.sendNewsletterConfirmationEmailMock.mockReset();
    mocks.updateMock.mockReset();
    mocks.serverFeatureFlags.newsletterSignupEnabled = true;

    mocks.fromMock.mockReturnValue({
      insert: mocks.insertMock,
      select: () => ({
        ilike: () => ({
          maybeSingle: mocks.maybeSingleMock,
        }),
      }),
      update: mocks.updateMock,
    });
    mocks.updateMock.mockReturnValue({
      eq: mocks.eqMock,
    });
    mocks.buildNewsletterConfirmationEmailPayloadMock.mockImplementation(
      ({ email, pagePath, placement, token }) => ({
        confirmUrl: `https://scalzostudio.com/newsletter/confirm?email=${encodeURIComponent(email)}&token=${token}`,
        email,
        expiresAt: new Date("2026-03-30T10:00:00.000Z"),
        pagePath,
        placement,
      }),
    );
    mocks.insertMock.mockResolvedValue({ error: null });
    mocks.eqMock.mockResolvedValue({ error: null });
    mocks.maybeSingleMock.mockResolvedValue({
      data: null,
      error: null,
    });
    mocks.sendNewsletterConfirmationEmailMock.mockResolvedValue({
      id: "email_123",
    });
  });

  it("creates a pending subscriber row and sends the confirmation email for a new signup", async () => {
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
    expect(mocks.insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        confirmation_expires_at: "2026-03-30T10:00:00.000Z",
        confirmation_sent_at: expect.any(String),
        confirmation_token_hash: expect.stringMatching(/^[a-f0-9]{64}$/),
        email: "reader@example.com",
        page_path: "/insights",
        placement: "insights-index",
        provider: "resend",
        status: "pending",
      }),
    );
    expect(
      mocks.buildNewsletterConfirmationEmailPayloadMock,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "reader@example.com",
        pagePath: "/insights",
        placement: "insights-index",
        token: expect.any(String),
      }),
    );
    expect(mocks.sendNewsletterConfirmationEmailMock).toHaveBeenCalledTimes(1);
  });

  it("returns the already-subscribed success state without resending for confirmed emails", async () => {
    mocks.maybeSingleMock.mockResolvedValueOnce({
      data: {
        confirmation_expires_at: null,
        confirmation_sent_at: null,
        confirmed_at: "2026-03-28T10:00:00.000Z",
        email: "reader@example.com",
        id: "subscriber_123",
        page_path: "/",
        placement: "home",
        provider_contact_id: "contact_123",
        status: "confirmed",
        unsubscribed_at: null,
      },
      error: null,
    });

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
    expect(mocks.updateMock).toHaveBeenCalledWith({
      page_path: "/insights",
      placement: "insights-index",
    });
    expect(mocks.sendNewsletterConfirmationEmailMock).not.toHaveBeenCalled();
  });

  it("rotates the pending signup token and resends the confirmation email", async () => {
    mocks.maybeSingleMock.mockResolvedValueOnce({
      data: {
        confirmation_expires_at: "2026-03-29T10:00:00.000Z",
        confirmation_sent_at: "2026-03-28T10:00:00.000Z",
        confirmed_at: null,
        email: "reader@example.com",
        id: "subscriber_123",
        page_path: "/",
        placement: "home",
        provider_contact_id: "contact_123",
        status: "pending",
        unsubscribed_at: null,
      },
      error: null,
    });

    const result = await submitNewsletterSignup(
      { fieldErrors: {}, message: null, status: "idle" },
      buildValidFormData(),
    );

    expect(result.status).toBe("success");
    expect(mocks.updateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        confirmation_expires_at: "2026-03-30T10:00:00.000Z",
        confirmation_sent_at: expect.any(String),
        confirmation_token_hash: expect.stringMatching(/^[a-f0-9]{64}$/),
        page_path: "/insights",
        placement: "insights-index",
        provider_contact_id: "contact_123",
        status: "pending",
      }),
    );
    expect(mocks.sendNewsletterConfirmationEmailMock).toHaveBeenCalledTimes(1);
  });

  it("returns the unavailable state when the integration is disabled", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mocks.serverFeatureFlags.newsletterSignupEnabled = false;

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
    expect(mocks.fromMock).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Newsletter signup skipped because the integration is disabled",
      {
        emailDomain: "example.com",
        pagePath: "/insights",
        placement: "insights-index",
      },
    );
  });

  it("returns an error when the confirmation email send fails and keeps logs sanitized", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mocks.sendNewsletterConfirmationEmailMock.mockRejectedValueOnce(
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
      "Newsletter confirmation email send failed",
      {
        emailDomain: "example.com",
        error: {
          message: "Resend outage",
          name: "Error",
        },
        pagePath: "/insights",
        placement: "insights-index",
      },
    );
    expect(consoleErrorSpy.mock.calls[0]?.[1]).not.toHaveProperty(
      "email",
      "reader@example.com",
    );
  });
});
