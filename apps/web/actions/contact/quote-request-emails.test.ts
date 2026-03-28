// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/resend/client", () => ({
  sendResendEmail: vi.fn(),
}));

import {
  buildInternalQuoteRequestEmail,
  buildQuoteRequestConfirmationEmail,
  buildQuoteRequestEmailLogContext,
  buildQuoteRequestEmailPayload,
  serializeQuoteRequestEmailErrorForLog,
} from "./quote-request-emails";

function buildPayload() {
  return buildQuoteRequestEmailPayload(
    {
      budgetBand: "1000-3000",
      company: "Scalzo Studio",
      consent: "true",
      email: "hello@example.com",
      location: "uk-europe",
      message: "We need a sharper homepage and better CTA hierarchy.",
      name: "Ben",
      pagePath: "/contact",
      primaryGoal: "Improve conversion clarity",
      projectType: "homepage",
      referrer: "https://google.com",
      servicesInterest: ["strategic-framing", "design-systems"],
      timelineBand: "2-4-weeks",
      utmCampaign: "spring-launch",
      utmContent: "cta-footer",
      utmMedium: "email",
      utmSource: "newsletter",
      utmTerm: "brand-strategy",
      website: "https://example.com",
    },
    {
      createdAt: "2026-03-28T10:30:00.000Z",
      id: "lead_123",
    },
  );
}

describe("quote request email helpers", () => {
  it("builds the internal notification email with reply-to and lead context", () => {
    const email = buildInternalQuoteRequestEmail(buildPayload(), {
      fromEmail: "Scalzo Studio <hello@scalzostudio.com>",
      toEmail: "studio@scalzostudio.com",
    });

    expect(email).toMatchObject({
      from: "Scalzo Studio <hello@scalzostudio.com>",
      replyTo: "hello@example.com",
      subject: "New quote request from Ben at Scalzo Studio",
      to: "studio@scalzostudio.com",
    });
    expect(email.text).toContain("Lead ID: lead_123");
    expect(email.text).toContain("Referrer: https://google.com");
    expect(email.text).toContain("UTM source: newsletter");
    expect(email.html).toContain("Scalzo Studio");
    expect(email.html).toContain("We need a sharper homepage");
  });

  it("builds the confirmation email with summary fields and booking fallback", () => {
    const email = buildQuoteRequestConfirmationEmail(buildPayload(), {
      fromEmail: "Scalzo Studio <hello@scalzostudio.com>",
      toEmail: "hello@example.com",
    });

    expect(email).toMatchObject({
      from: "Scalzo Studio <hello@scalzostudio.com>",
      subject: "We received your quote request",
      to: "hello@example.com",
    });
    expect(email.text).toContain("Quote requests are reviewed manually.");
    expect(email.text).toContain("Arrange a call by email");
    expect(email.html).toContain("Improve conversion clarity");
    expect(email.html).toContain("mailto:hello@scalzostudio.com");
  });

  it("builds sanitized email log context without personal fields", () => {
    expect(buildQuoteRequestEmailLogContext(buildPayload())).toEqual({
      budgetBand: "EUR 1,000 - 3,000",
      hasReferrer: true,
      hasUtm: true,
      leadId: "lead_123",
      pagePath: "/contact",
      servicesInterest: ["Strategic framing", "Design systems"],
      timelineBand: "2-4 weeks",
    });
  });

  it("serializes resend-like email errors for safe logging", () => {
    const error = Object.assign(new Error("restricted"), {
      code: "restricted_api_key",
      name: "ResendSendError",
      statusCode: 403,
    });

    expect(serializeQuoteRequestEmailErrorForLog(error)).toEqual({
      code: "restricted_api_key",
      message: "restricted",
      name: "ResendSendError",
      statusCode: 403,
    });
  });
});
