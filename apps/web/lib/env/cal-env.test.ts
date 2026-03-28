// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const baseEnv = {
  CAL_WEBHOOK_SECRET: "",
  CONTACT_EMAIL: "",
  CONTACT_FROM_EMAIL: "",
  CONTACT_TO_EMAIL: "",
  NEXT_PUBLIC_ANALYTICS_PROVIDER: "",
  NEXT_PUBLIC_CAL_BOOKING_URL: "",
  NEXT_PUBLIC_SITE_URL: "https://scalzostudio.com",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "test-publishable-key",
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "",
  RESEND_API_KEY: "",
  RESEND_NEWSLETTER_TOPIC_ID: "",
  SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
  TURNSTILE_SECRET_KEY: "",
  TURNSTILE_SITE_KEY: "",
} as const;

const originalEnv = { ...process.env };

function applyEnv(overrides?: Partial<Record<keyof typeof baseEnv, string>>) {
  process.env = {
    ...originalEnv,
    ...baseEnv,
    ...overrides,
  };
}

describe("Cal.com environment support", () => {
  beforeEach(() => {
    vi.resetModules();
    applyEnv();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("keeps Cal booking disabled when the public booking URL is absent", async () => {
    const { publicEnv, publicFeatureFlags } = await import("./public");

    expect(publicEnv.calBookingUrl).toBeUndefined();
    expect(publicFeatureFlags.calBookingEnabled).toBe(false);
  });

  it("parses a configured public Cal booking URL", async () => {
    applyEnv({
      NEXT_PUBLIC_CAL_BOOKING_URL: "https://cal.eu/scalzostudio/discovery-call",
    });

    const { publicEnv, publicFeatureFlags } = await import("./public");

    expect(publicEnv.calBookingUrl).toBe(
      "https://cal.eu/scalzostudio/discovery-call",
    );
    expect(publicFeatureFlags.calBookingEnabled).toBe(true);
  });

  it("enables the Cal webhook feature only when the booking URL and secret are both present", async () => {
    applyEnv({
      CAL_WEBHOOK_SECRET: "super-secret",
      NEXT_PUBLIC_CAL_BOOKING_URL: "https://cal.eu/scalzostudio/discovery-call",
    });

    const { serverEnv, serverFeatureFlags } = await import("./server");

    expect(serverEnv.calWebhookSecret).toBe("super-secret");
    expect(serverFeatureFlags.calWebhookEnabled).toBe(true);
  });
});
