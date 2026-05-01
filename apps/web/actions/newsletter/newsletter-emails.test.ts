// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/env/server", () => ({
  serverEnv: {
    contactFromEmail: "Scalzo Studio <hello@scalzostudio.com>",
    siteUrl: "https://scalzostudio.com",
  },
}));
vi.mock("@/lib/resend/client", () => ({
  sendResendEmail: vi.fn(),
}));

import {
  buildNewsletterConfirmationEmail,
  buildNewsletterConfirmationEmailPayload,
  buildNewsletterSignupLogContext,
  serializeNewsletterErrorForLog,
} from "./helpers";
import { getNewsletterConfirmationMessage } from "./newsletter-emails";

describe("newsletter email helpers", () => {
  it("builds the confirmation email with the expected CTA and metadata", () => {
    const payload = buildNewsletterConfirmationEmailPayload({
      email: "reader@example.com",
      pagePath: "/insights/clarity",
      placement: "insights-detail",
      token: "token_123",
    });
    const email = buildNewsletterConfirmationEmail({
      ...payload,
      expiresAt: new Date("2026-03-30T10:00:00.000Z"),
    });

    expect(payload.confirmUrl).toBe(
      "https://scalzostudio.com/newsletter/confirm?email=reader%40example.com&token=token_123",
    );
    expect(email).toMatchObject({
      from: "Scalzo Studio <hello@scalzostudio.com>",
      subject: "Confirm your newsletter signup",
      to: "reader@example.com",
    });
    expect(email.text).toContain("Placement: insights-detail");
    expect(email.text).toContain("/insights/clarity");
    expect(email.html).toContain("Confirm subscription");
    expect(email.html).toContain(
      "https://scalzostudio.com/newsletter/confirm?email=reader%40example.com&amp;token=token_123",
    );
  });

  it("returns sanitized signup log context without raw personal data", () => {
    expect(
      buildNewsletterSignupLogContext({
        email: "reader@example.com",
        pagePath: "/",
        placement: "home",
      }),
    ).toEqual({
      emailDomain: "example.com",
      pagePath: "/",
      placement: "home",
    });
  });

  it("serializes newsletter errors for safe logging", () => {
    const error = Object.assign(new Error("provider rejected request"), {
      code: "restricted_api_key",
      name: "ResendSendError",
      statusCode: 403,
    });

    expect(serializeNewsletterErrorForLog(error)).toEqual({
      code: "restricted_api_key",
      details: null,
      hint: null,
      message: "provider rejected request",
      name: "ResendSendError",
      statusCode: 403,
    });
    expect(getNewsletterConfirmationMessage()).toContain("Check your inbox");
  });
});
