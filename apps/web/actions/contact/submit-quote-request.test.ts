// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { submitQuoteRequest } from "./submit-quote-request";

const mocks = vi.hoisted(() => ({
  createOrRefreshPendingNewsletterSignupMock: vi.fn(),
  buildQuoteRequestEmailLogContextMock: vi.fn(),
  buildQuoteRequestEmailPayloadMock: vi.fn(),
  fromMock: vi.fn(),
  insertMock: vi.fn(),
  selectMock: vi.fn(),
  sendQuoteRequestEmailsMock: vi.fn(),
  serializeNewsletterErrorForLogMock: vi.fn(),
  serializeQuoteRequestEmailErrorForLogMock: vi.fn(),
  serverFeatureFlags: {
    contactNotificationsEnabled: false,
    serviceRoleEnabled: true,
  },
  singleMock: vi.fn(),
}));

vi.mock("@/lib/env/server", () => ({
  serverFeatureFlags: mocks.serverFeatureFlags,
}));

vi.mock("@/lib/supabase/service-role", () => ({
  createServiceRoleSupabaseClient: () => ({
    from: mocks.fromMock,
  }),
}));

vi.mock(
  "@/actions/newsletter/create-or-refresh-pending-newsletter-signup",
  () => ({
    createOrRefreshPendingNewsletterSignup:
      mocks.createOrRefreshPendingNewsletterSignupMock,
  }),
);

vi.mock("@/actions/newsletter/helpers", () => ({
  buildNewsletterSignupLogContext: ({
    email,
    pagePath,
    placement,
  }: {
    email?: string | null;
    pagePath?: string | null;
    placement?: string | null;
  }) => ({
    emailDomain:
      email && email.includes("@") ? (email.split("@")[1] ?? null) : null,
    pagePath: pagePath ?? "/",
    placement: placement ?? null,
  }),
  serializeNewsletterErrorForLog: mocks.serializeNewsletterErrorForLogMock,
}));

vi.mock("./quote-request-emails", () => ({
  buildQuoteRequestEmailLogContext: mocks.buildQuoteRequestEmailLogContextMock,
  buildQuoteRequestEmailPayload: mocks.buildQuoteRequestEmailPayloadMock,
  sendQuoteRequestEmails: mocks.sendQuoteRequestEmailsMock,
  serializeQuoteRequestEmailErrorForLog:
    mocks.serializeQuoteRequestEmailErrorForLogMock,
}));

function buildValidFormData() {
  const formData = new FormData();

  formData.set("budgetBand", "1000-3000");
  formData.set("company", "Scalzo");
  formData.set("consent", "true");
  formData.set("email", "hello@example.com");
  formData.set("location", "uk-europe");
  formData.set(
    "message",
    "We need a clearer commercial story and a stronger conversion path.",
  );
  formData.set("name", "Ben");
  formData.set("newsletterOptIn", "true");
  formData.set("pagePath", "/contact");
  formData.set("primaryGoal", "Improve conversion clarity");
  formData.set("projectType", "homepage");
  formData.set("referrer", "https://google.com");
  formData.append("servicesInterest", "strategic-framing");
  formData.set("timelineBand", "2-4-weeks");
  formData.set("website", "https://example.com");

  return formData;
}

function expectLeadInsertPayload(
  payload: unknown,
  overrides?: Partial<{
    budget_band: string | null;
    company: string | null;
    email: string | null;
    message: string | null;
    name: string | null;
    page_path: string | null;
    services_interest: string[] | null;
    source_utm: {
      referrer: string | null;
      submitted_via: string;
      utm_campaign: string | null;
      utm_content: string | null;
      utm_medium: string | null;
      utm_source: string | null;
      utm_term: string | null;
    };
    timeline_band: string | null;
    website: string | null;
  }>,
) {
  expect(payload).toEqual({
    budget_band: "1000-3000",
    company: "Scalzo",
    email: "hello@example.com",
    message: [
      "Primary goal: Improve conversion clarity",
      "Project type: homepage",
      "Location: uk-europe",
      "Website / profile: https://example.com",
      "",
      "Brief:",
      "We need a clearer commercial story and a stronger conversion path.",
    ].join("\n"),
    name: "Ben",
    page_path: "/contact",
    services_interest: ["strategic-framing"],
    source_utm: {
      referrer: "https://google.com",
      submitted_via: "contact-page",
      utm_campaign: null,
      utm_content: null,
      utm_medium: null,
      utm_source: null,
      utm_term: null,
    },
    timeline_band: "2-4-weeks",
    website: "https://example.com",
    ...overrides,
  });
}

describe("submitQuoteRequest", () => {
  beforeEach(() => {
    mocks.buildQuoteRequestEmailLogContextMock.mockReset();
    mocks.buildQuoteRequestEmailPayloadMock.mockReset();
    mocks.createOrRefreshPendingNewsletterSignupMock.mockReset();
    mocks.fromMock.mockReset();
    mocks.insertMock.mockReset();
    mocks.selectMock.mockReset();
    mocks.sendQuoteRequestEmailsMock.mockReset();
    mocks.serializeNewsletterErrorForLogMock.mockReset();
    mocks.serializeQuoteRequestEmailErrorForLogMock.mockReset();
    mocks.singleMock.mockReset();
    mocks.fromMock.mockReturnValue({
      insert: mocks.insertMock,
    });
    mocks.insertMock.mockReturnValue({
      select: mocks.selectMock,
    });
    mocks.selectMock.mockReturnValue({
      single: mocks.singleMock,
    });
    mocks.serverFeatureFlags.contactNotificationsEnabled = false;
    mocks.serverFeatureFlags.serviceRoleEnabled = true;
    mocks.createOrRefreshPendingNewsletterSignupMock.mockResolvedValue(
      "pending",
    );
    mocks.buildQuoteRequestEmailPayloadMock.mockReturnValue({
      leadId: "lead_123",
      pagePath: "/contact",
      servicesInterestLabels: ["Strategic framing"],
      budgetBandLabel: "EUR 1,000 - 3,000",
      timelineBandLabel: "2-4 weeks",
    });
    mocks.buildQuoteRequestEmailLogContextMock.mockReturnValue({
      leadId: "lead_123",
      pagePath: "/contact",
      servicesInterest: ["Strategic framing"],
      budgetBand: "EUR 1,000 - 3,000",
      timelineBand: "2-4 weeks",
      hasReferrer: true,
      hasUtm: false,
    });
    mocks.serializeQuoteRequestEmailErrorForLogMock.mockImplementation(
      (error) => ({
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : "UnknownError",
      }),
    );
    mocks.serializeNewsletterErrorForLogMock.mockImplementation((error) => ({
      code: null,
      details: null,
      hint: null,
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : "UnknownError",
      statusCode: null,
    }));
  });

  it("short-circuits honeypot submissions without touching the database", async () => {
    const formData = buildValidFormData();
    formData.set("companyWebsite", "bot-fill");

    const result = await submitQuoteRequest(
      { fieldErrors: {}, message: null, status: "idle" },
      formData,
    );

    expect(result.status).toBe("success");
    expect(mocks.fromMock).not.toHaveBeenCalled();
    expect(mocks.sendQuoteRequestEmailsMock).not.toHaveBeenCalled();
    expect(
      mocks.createOrRefreshPendingNewsletterSignupMock,
    ).not.toHaveBeenCalled();
  });

  it("logs sanitized validation failures and returns field errors for invalid submissions", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const formData = new FormData();
    formData.set("email", "bad-email");
    formData.set("pagePath", "/contact");
    formData.append("servicesInterest", "strategic-framing");

    const result = await submitQuoteRequest(
      { fieldErrors: {}, message: null, status: "idle" },
      formData,
    );

    expect(result.status).toBe("error");
    expect(result.fieldErrors.email).toBe("Enter a valid email address.");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Quote request validation failed",
      expect.objectContaining({
        budgetBand: null,
        fieldErrors: expect.arrayContaining([
          "budgetBand",
          "consent",
          "email",
          "message",
          "name",
          "primaryGoal",
          "timelineBand",
        ]),
        hasReferrer: false,
        hasUtm: false,
        hasWebsite: false,
        pagePath: "/contact",
        projectType: null,
        servicesInterest: ["strategic-framing"],
        timelineBand: null,
      }),
    );
    expect(consoleErrorSpy.mock.calls[0]?.[1]).not.toHaveProperty(
      "email",
      "bad-email",
    );
  });

  it("logs service-role disabled mode and returns the temporary-unavailable state", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mocks.serverFeatureFlags.serviceRoleEnabled = false;

    const result = await submitQuoteRequest(
      { fieldErrors: {}, message: null, status: "idle" },
      buildValidFormData(),
    );

    expect(result.status).toBe("error");
    expect(result.message).toContain("temporarily unavailable");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Quote request submission skipped because service-role access is disabled",
      expect.objectContaining({
        budgetBand: "1000-3000",
        hasReferrer: true,
        hasUtm: false,
        hasWebsite: true,
        pagePath: "/contact",
        projectType: "homepage",
        servicesInterest: ["strategic-framing"],
        timelineBand: "2-4-weeks",
      }),
    );
    expect(mocks.fromMock).not.toHaveBeenCalled();
    expect(mocks.sendQuoteRequestEmailsMock).not.toHaveBeenCalled();
    expect(
      mocks.createOrRefreshPendingNewsletterSignupMock,
    ).not.toHaveBeenCalled();
  });

  it("logs insert failures and returns the generic save error", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mocks.singleMock.mockResolvedValueOnce({
      data: null,
      error: {
        code: "23505",
        details: "duplicate",
        hint: null,
        message: "Insert failed",
      },
    });

    const result = await submitQuoteRequest(
      { fieldErrors: {}, message: null, status: "idle" },
      buildValidFormData(),
    );

    expect(result.status).toBe("error");
    expect(result.message).toContain("could not be saved");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Quote request insert failed",
      expect.objectContaining({
        budgetBand: "1000-3000",
        code: "23505",
        details: "duplicate",
        hasReferrer: true,
        hasUtm: false,
        hasWebsite: true,
        hint: null,
        message: "Insert failed",
        pagePath: "/contact",
        projectType: "homepage",
        servicesInterest: ["strategic-framing"],
        timelineBand: "2-4-weeks",
      }),
    );
    expect(mocks.sendQuoteRequestEmailsMock).not.toHaveBeenCalled();
    expect(
      mocks.createOrRefreshPendingNewsletterSignupMock,
    ).not.toHaveBeenCalled();
  });

  it("logs unexpected insert errors and returns the generic save error", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mocks.singleMock.mockRejectedValueOnce(new Error("network down"));

    const result = await submitQuoteRequest(
      { fieldErrors: {}, message: null, status: "idle" },
      buildValidFormData(),
    );

    expect(result.status).toBe("error");
    expect(result.message).toContain("could not be saved");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Quote request submission threw an unexpected error",
      expect.objectContaining({
        budgetBand: "1000-3000",
        error: {
          message: "network down",
          name: "Error",
        },
        hasReferrer: true,
        hasUtm: false,
        hasWebsite: true,
        pagePath: "/contact",
        projectType: "homepage",
        servicesInterest: ["strategic-framing"],
        timelineBand: "2-4-weeks",
      }),
    );
    expect(mocks.sendQuoteRequestEmailsMock).not.toHaveBeenCalled();
    expect(
      mocks.createOrRefreshPendingNewsletterSignupMock,
    ).not.toHaveBeenCalled();
  });

  it("inserts valid leads and skips email sends when notifications are disabled", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mocks.singleMock.mockResolvedValueOnce({
      data: {
        created_at: "2026-03-28T10:30:00.000Z",
        id: "lead_123",
      },
      error: null,
    });

    const result = await submitQuoteRequest(
      { fieldErrors: {}, message: null, status: "idle" },
      buildValidFormData(),
    );

    expect(mocks.fromMock).toHaveBeenCalledWith("leads");
    expect(mocks.insertMock).toHaveBeenCalledTimes(1);
    expectLeadInsertPayload(mocks.insertMock.mock.calls[0]?.[0]);
    expect(result.status).toBe("success");
    expect(
      mocks.createOrRefreshPendingNewsletterSignupMock,
    ).toHaveBeenCalledWith({
      email: "hello@example.com",
      pagePath: "/contact",
      placement: "contact",
    });
    expect(mocks.sendQuoteRequestEmailsMock).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("skips newsletter signup when the opt-in checkbox is unchecked", async () => {
    mocks.singleMock.mockResolvedValueOnce({
      data: {
        created_at: "2026-03-28T10:30:00.000Z",
        id: "lead_123",
      },
      error: null,
    });
    const formData = buildValidFormData();
    formData.set("newsletterOptIn", "");

    const result = await submitQuoteRequest(
      { fieldErrors: {}, message: null, status: "idle" },
      formData,
    );

    expect(result.status).toBe("success");
    expect(
      mocks.createOrRefreshPendingNewsletterSignupMock,
    ).not.toHaveBeenCalled();
  });

  it("sends both emails after a successful lead insert when notifications are enabled", async () => {
    mocks.serverFeatureFlags.contactNotificationsEnabled = true;
    mocks.singleMock.mockResolvedValueOnce({
      data: {
        created_at: "2026-03-28T10:30:00.000Z",
        id: "lead_123",
      },
      error: null,
    });
    mocks.sendQuoteRequestEmailsMock.mockResolvedValueOnce({
      confirmation: {
        status: "fulfilled",
        value: { id: "email_confirmation" },
      },
      internal: { status: "fulfilled", value: { id: "email_internal" } },
    });

    const result = await submitQuoteRequest(
      { fieldErrors: {}, message: null, status: "idle" },
      buildValidFormData(),
    );

    expect(result.status).toBe("success");
    expect(mocks.buildQuoteRequestEmailPayloadMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "hello@example.com",
        name: "Ben",
      }),
      {
        createdAt: "2026-03-28T10:30:00.000Z",
        id: "lead_123",
      },
    );
    expect(mocks.sendQuoteRequestEmailsMock).toHaveBeenCalledWith(
      mocks.buildQuoteRequestEmailPayloadMock.mock.results[0]?.value,
    );
    expect(
      mocks.createOrRefreshPendingNewsletterSignupMock,
    ).toHaveBeenCalledWith({
      email: "hello@example.com",
      pagePath: "/contact",
      placement: "contact",
    });
  });

  it("returns success and logs a sanitized error when one email send fails", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const resendError = Object.assign(new Error("resend down"), {
      name: "ResendSendError",
    });

    mocks.serverFeatureFlags.contactNotificationsEnabled = true;
    mocks.singleMock.mockResolvedValueOnce({
      data: {
        created_at: "2026-03-28T10:30:00.000Z",
        id: "lead_123",
      },
      error: null,
    });
    mocks.sendQuoteRequestEmailsMock.mockResolvedValueOnce({
      confirmation: {
        status: "fulfilled",
        value: { id: "email_confirmation" },
      },
      internal: { status: "rejected", reason: resendError },
    });
    mocks.serializeQuoteRequestEmailErrorForLogMock.mockReturnValueOnce({
      code: "application_error",
      message: "resend down",
      name: "ResendSendError",
      statusCode: 500,
    });

    const result = await submitQuoteRequest(
      { fieldErrors: {}, message: null, status: "idle" },
      buildValidFormData(),
    );

    expect(result.status).toBe("success");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Quote request email send failed",
      expect.objectContaining({
        budgetBand: "EUR 1,000 - 3,000",
        emailKind: "internal",
        error: {
          code: "application_error",
          message: "resend down",
          name: "ResendSendError",
          statusCode: 500,
        },
        hasReferrer: true,
        hasUtm: false,
        leadId: "lead_123",
        pagePath: "/contact",
        servicesInterest: ["Strategic framing"],
        timelineBand: "2-4 weeks",
      }),
    );
  });

  it("returns success and logs both failures when both email sends fail", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const confirmationError = new Error("confirmation failed");
    const internalError = new Error("internal failed");

    mocks.serverFeatureFlags.contactNotificationsEnabled = true;
    mocks.singleMock.mockResolvedValueOnce({
      data: {
        created_at: "2026-03-28T10:30:00.000Z",
        id: "lead_123",
      },
      error: null,
    });
    mocks.sendQuoteRequestEmailsMock.mockResolvedValueOnce({
      confirmation: { status: "rejected", reason: confirmationError },
      internal: { status: "rejected", reason: internalError },
    });

    const result = await submitQuoteRequest(
      { fieldErrors: {}, message: null, status: "idle" },
      buildValidFormData(),
    );

    expect(result.status).toBe("success");
    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(
      1,
      "Quote request email send failed",
      expect.objectContaining({
        emailKind: "confirmation",
      }),
    );
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(
      2,
      "Quote request email send failed",
      expect.objectContaining({
        emailKind: "internal",
      }),
    );
  });

  it("returns success and logs a sanitized error when newsletter signup fails after the lead is saved", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mocks.singleMock.mockResolvedValueOnce({
      data: {
        created_at: "2026-03-28T10:30:00.000Z",
        id: "lead_123",
      },
      error: null,
    });
    mocks.createOrRefreshPendingNewsletterSignupMock.mockRejectedValueOnce(
      new Error("newsletter down"),
    );

    const result = await submitQuoteRequest(
      { fieldErrors: {}, message: null, status: "idle" },
      buildValidFormData(),
    );

    expect(result.status).toBe("success");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Quote request newsletter signup failed",
      {
        emailDomain: "example.com",
        error: {
          code: null,
          details: null,
          hint: null,
          message: "newsletter down",
          name: "Error",
          statusCode: null,
        },
        pagePath: "/contact",
        placement: "contact",
      },
    );
  });

  it("returns success and logs a skip message when newsletter opt-in is checked but the integration is disabled", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mocks.singleMock.mockResolvedValueOnce({
      data: {
        created_at: "2026-03-28T10:30:00.000Z",
        id: "lead_123",
      },
      error: null,
    });
    mocks.createOrRefreshPendingNewsletterSignupMock.mockResolvedValueOnce(
      "disabled",
    );

    const result = await submitQuoteRequest(
      { fieldErrors: {}, message: null, status: "idle" },
      buildValidFormData(),
    );

    expect(result.status).toBe("success");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Quote request newsletter signup skipped because the integration is disabled",
      {
        emailDomain: "example.com",
        pagePath: "/contact",
        placement: "contact",
      },
    );
  });

  it("persists lead metadata and fallback defaults for optional fields", async () => {
    mocks.singleMock.mockResolvedValueOnce({
      data: {
        created_at: "2026-03-28T10:30:00.000Z",
        id: "lead_123",
      },
      error: null,
    });

    const formData = buildValidFormData();
    formData.delete("company");
    formData.delete("location");
    formData.delete("pagePath");
    formData.delete("projectType");
    formData.delete("referrer");
    formData.delete("website");
    formData.set("utmCampaign", "spring-launch");
    formData.set("utmContent", "cta-footer");
    formData.set("utmMedium", "email");
    formData.set("utmSource", "newsletter");
    formData.set("utmTerm", "brand-strategy");

    const result = await submitQuoteRequest(
      { fieldErrors: {}, message: null, status: "idle" },
      formData,
    );

    expect(result.status).toBe("success");
    expectLeadInsertPayload(mocks.insertMock.mock.calls[0]?.[0], {
      company: undefined,
      message: [
        "Primary goal: Improve conversion clarity",
        "",
        "Brief:",
        "We need a clearer commercial story and a stronger conversion path.",
      ].join("\n"),
      page_path: "/contact",
      source_utm: {
        referrer: null,
        submitted_via: "contact-page",
        utm_campaign: "spring-launch",
        utm_content: "cta-footer",
        utm_medium: "email",
        utm_source: "newsletter",
        utm_term: "brand-strategy",
      },
      website: undefined,
    });
  });
});
