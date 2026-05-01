// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import {
  buildQuoteRequestEmailPayload,
  buildQuoteRequestConfirmationEmail,
  buildInternalQuoteRequestEmail,
  buildQuoteRequestEmailLogContext,
  serializeQuoteRequestEmailErrorForLog,
} from "./quote-request-emails.helpers";

const mocks = vi.hoisted(() => ({
  getBookingActionMock: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/booking/config", () => ({
  getBookingAction: mocks.getBookingActionMock,
}));
vi.mock("@/lib/resend/client", () => ({
  sendResendEmail: vi.fn(),
}));

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
  it("uses the configured Cal.com booking link in the confirmation email", () => {
    mocks.getBookingActionMock.mockReturnValue({
      href: "https://cal.eu/scalzostudio/discovery-call",
      label: "Book a discovery call",
    });

    const email = buildQuoteRequestConfirmationEmail(buildPayload(), {
      fromEmail: "Scalzo Studio <hello@scalzostudio.com>",
      toEmail: "hello@example.com",
    });

    expect(email.text).toContain("Book a discovery call");
    expect(email.html).toContain("https://cal.eu/scalzostudio/discovery-call");
  });

  it("builds the internal notification email with reply-to and lead context", () => {
    mocks.getBookingActionMock.mockReturnValue({
      href: "https://cal.eu/scalzostudio/discovery-call",
      label: "Book a discovery call",
    });

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

  it("falls back to the email route when Cal.com is not configured", () => {
    mocks.getBookingActionMock.mockReturnValue({
      href: "mailto:hello@scalzostudio.com?subject=Discovery%20call%20request",
      label: "Arrange a call by email",
    });

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
    mocks.getBookingActionMock.mockReturnValue({
      href: "https://cal.eu/scalzostudio/discovery-call",
      label: "Book a discovery call",
    });

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
    mocks.getBookingActionMock.mockReturnValue({
      href: "https://cal.eu/scalzostudio/discovery-call",
      label: "Book a discovery call",
    });

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
