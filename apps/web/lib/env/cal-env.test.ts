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
  NEXT_PUBLIC_HCAPTCHA_SITE_KEY: "",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "test-publishable-key",
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  RESEND_API_KEY: "",
  RESEND_NEWSLETTER_TOPIC_ID: "",
  SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
  HCAPTCHA_SECRET_KEY: "",
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

  it("keeps hCaptcha disabled when no keys are configured", async () => {
    const { publicFeatureFlags } = await import("./public");
    const { serverFeatureFlags } = await import("./server");

    expect(publicFeatureFlags.hcaptchaEnabled).toBe(false);
    expect(serverFeatureFlags.hcaptchaEnabled).toBe(false);
  });

  it("enables hCaptcha only when both the public and secret keys are present", async () => {
    applyEnv({
      HCAPTCHA_SECRET_KEY: "secret",
      NEXT_PUBLIC_HCAPTCHA_SITE_KEY: "site-key",
    });

    const { publicEnv, publicFeatureFlags } = await import("./public");
    const { serverEnv, serverFeatureFlags } = await import("./server");

    expect(publicEnv.hcaptchaSiteKey).toBe("site-key");
    expect(serverEnv.hcaptchaSecretKey).toBe("secret");
    expect(serverFeatureFlags.hcaptchaEnabled).toBe(true);
    expect(publicFeatureFlags.hcaptchaEnabled).toBe(true);
  });
});
