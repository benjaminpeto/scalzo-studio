// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { hashNewsletterToken } from "./helpers";

const mocks = vi.hoisted(() => ({
  captureServerEventMock: vi.fn(),
  createOrUpdateResendContactWithTopicMock: vi.fn(),
  eqMock: vi.fn(),
  fromMock: vi.fn(),
  maybeSingleMock: vi.fn(),
  serverEnv: {
    resendNewsletterTopicId: "topic_123",
  },
  serverFeatureFlags: {
    newsletterSignupEnabled: true,
  },
  updateMock: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/env/server", () => ({
  serverEnv: mocks.serverEnv,
  serverFeatureFlags: mocks.serverFeatureFlags,
}));

vi.mock("@/lib/resend/client", () => ({
  createOrUpdateResendContactWithTopic:
    mocks.createOrUpdateResendContactWithTopicMock,
}));

vi.mock("@/lib/analytics/server", () => ({
  captureServerEvent: mocks.captureServerEventMock,
}));

vi.mock("@/lib/supabase/service-role", () => ({
  createServiceRoleSupabaseClient: () => ({
    from: mocks.fromMock,
  }),
}));

import { handleNewsletterConfirmRequest } from "./confirm-newsletter-signup";

describe("handleNewsletterConfirmRequest", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15T12:00:00.000Z"));

    mocks.createOrUpdateResendContactWithTopicMock.mockReset();
    mocks.captureServerEventMock.mockReset();
    mocks.eqMock.mockReset();
    mocks.fromMock.mockReset();
    mocks.maybeSingleMock.mockReset();
    mocks.serverFeatureFlags.newsletterSignupEnabled = true;
    mocks.updateMock.mockReset();

    mocks.fromMock.mockReturnValue({
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
    mocks.eqMock.mockResolvedValue({ error: null });
    mocks.createOrUpdateResendContactWithTopicMock.mockResolvedValue(
      "contact_123",
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("confirms a valid subscriber and syncs the contact to the configured Resend topic", async () => {
    const token = "token_123";
    mocks.maybeSingleMock.mockResolvedValueOnce({
      data: {
        confirmation_expires_at: "2026-03-30T10:00:00.000Z",
        confirmation_token_hash: hashNewsletterToken(token),
        email: "reader@example.com",
        id: "subscriber_123",
        page_path: "/insights/clarity",
        placement: "insights-detail",
        provider_contact_id: null,
        status: "pending",
      },
      error: null,
    });

    const redirectPath = await handleNewsletterConfirmRequest({
      email: "reader@example.com",
      token,
    });

    expect(redirectPath).toBe("/newsletter/confirmed?status=confirmed");
    expect(mocks.createOrUpdateResendContactWithTopicMock).toHaveBeenCalledWith(
      {
        email: "reader@example.com",
        topicId: "topic_123",
      },
    );
    expect(mocks.updateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        confirmation_expires_at: null,
        confirmation_token_hash: null,
        confirmed_at: expect.any(String),
        provider_contact_id: "contact_123",
        status: "confirmed",
        unsubscribed_at: null,
      }),
    );
  });

  it("returns invalid for a token mismatch", async () => {
    mocks.maybeSingleMock.mockResolvedValueOnce({
      data: {
        confirmation_expires_at: "2026-03-30T10:00:00.000Z",
        confirmation_token_hash: hashNewsletterToken("other_token"),
        email: "reader@example.com",
        id: "subscriber_123",
        page_path: "/",
        placement: "home",
        provider_contact_id: null,
        status: "pending",
      },
      error: null,
    });

    const redirectPath = await handleNewsletterConfirmRequest({
      email: "reader@example.com",
      token: "token_123",
    });

    expect(redirectPath).toBe("/newsletter/confirmed?status=invalid");
    expect(
      mocks.createOrUpdateResendContactWithTopicMock,
    ).not.toHaveBeenCalled();
  });

  it("returns expired when the confirmation token has lapsed", async () => {
    const token = "token_123";
    mocks.maybeSingleMock.mockResolvedValueOnce({
      data: {
        confirmation_expires_at: "2020-03-30T10:00:00.000Z",
        confirmation_token_hash: hashNewsletterToken(token),
        email: "reader@example.com",
        id: "subscriber_123",
        page_path: "/",
        placement: "home",
        provider_contact_id: null,
        status: "pending",
      },
      error: null,
    });

    const redirectPath = await handleNewsletterConfirmRequest({
      email: "reader@example.com",
      token,
    });

    expect(redirectPath).toBe("/newsletter/confirmed?status=expired");
    expect(
      mocks.createOrUpdateResendContactWithTopicMock,
    ).not.toHaveBeenCalled();
  });

  it("returns confirmed for already-confirmed subscribers without re-syncing", async () => {
    mocks.maybeSingleMock.mockResolvedValueOnce({
      data: {
        confirmation_expires_at: null,
        confirmation_token_hash: null,
        email: "reader@example.com",
        id: "subscriber_123",
        page_path: "/",
        placement: "home",
        provider_contact_id: "contact_123",
        status: "confirmed",
      },
      error: null,
    });

    const redirectPath = await handleNewsletterConfirmRequest({
      email: "reader@example.com",
      token: "token_123",
    });

    expect(redirectPath).toBe("/newsletter/confirmed?status=confirmed");
    expect(
      mocks.createOrUpdateResendContactWithTopicMock,
    ).not.toHaveBeenCalled();
  });

  it("returns error when the provider sync fails and leaves the token untouched", async () => {
    const token = "token_123";
    mocks.maybeSingleMock.mockResolvedValueOnce({
      data: {
        confirmation_expires_at: "2026-03-30T10:00:00.000Z",
        confirmation_token_hash: hashNewsletterToken(token),
        email: "reader@example.com",
        id: "subscriber_123",
        page_path: "/",
        placement: "footer",
        provider_contact_id: null,
        status: "pending",
      },
      error: null,
    });
    mocks.createOrUpdateResendContactWithTopicMock.mockRejectedValueOnce(
      new Error("Resend outage"),
    );

    const redirectPath = await handleNewsletterConfirmRequest({
      email: "reader@example.com",
      token,
    });

    expect(redirectPath).toBe("/newsletter/confirmed?status=error");
    expect(mocks.updateMock).not.toHaveBeenCalled();
  });
});
