// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { createOrRefreshPendingNewsletterSignup } from "./create-or-refresh-pending-newsletter-signup";

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

vi.mock("server-only", () => ({}));

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
  sendNewsletterConfirmationEmail: mocks.sendNewsletterConfirmationEmailMock,
}));

describe("createOrRefreshPendingNewsletterSignup", () => {
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

  it("returns disabled without touching the database when the integration is unavailable", async () => {
    mocks.serverFeatureFlags.newsletterSignupEnabled = false;

    const result = await createOrRefreshPendingNewsletterSignup({
      email: "reader@example.com",
      pagePath: "/contact",
      placement: "contact",
    });

    expect(result).toBe("disabled");
    expect(mocks.fromMock).not.toHaveBeenCalled();
  });

  it("creates a pending subscriber row and sends the confirmation email for a new signup", async () => {
    const result = await createOrRefreshPendingNewsletterSignup({
      email: "reader@example.com",
      pagePath: "/insights",
      placement: "insights-index",
    });

    expect(result).toBe("pending");
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

  it("returns already-subscribed without resending for confirmed emails", async () => {
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

    const result = await createOrRefreshPendingNewsletterSignup({
      email: "reader@example.com",
      pagePath: "/contact",
      placement: "contact",
    });

    expect(result).toBe("already-subscribed");
    expect(mocks.updateMock).toHaveBeenCalledWith({
      page_path: "/contact",
      placement: "contact",
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

    const result = await createOrRefreshPendingNewsletterSignup({
      email: "reader@example.com",
      pagePath: "/contact",
      placement: "contact",
    });

    expect(result).toBe("pending");
    expect(mocks.updateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        confirmation_expires_at: "2026-03-30T10:00:00.000Z",
        confirmation_sent_at: expect.any(String),
        confirmation_token_hash: expect.stringMatching(/^[a-f0-9]{64}$/),
        page_path: "/contact",
        placement: "contact",
        provider_contact_id: "contact_123",
        status: "pending",
      }),
    );
    expect(mocks.sendNewsletterConfirmationEmailMock).toHaveBeenCalledTimes(1);
  });

  it("throws when the confirmation email send fails", async () => {
    mocks.sendNewsletterConfirmationEmailMock.mockRejectedValueOnce(
      new Error("Resend outage"),
    );

    await expect(
      createOrRefreshPendingNewsletterSignup({
        email: "reader@example.com",
        pagePath: "/contact",
        placement: "contact",
      }),
    ).rejects.toThrow("Resend outage");
  });
});
