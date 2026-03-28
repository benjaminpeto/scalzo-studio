// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { submitQuoteRequest } from "./submit-quote-request";

const mocks = vi.hoisted(() => ({
  fromMock: vi.fn(),
  insertMock: vi.fn(),
  serverFeatureFlags: {
    serviceRoleEnabled: true,
  },
}));

vi.mock("@/lib/env/server", () => ({
  serverFeatureFlags: mocks.serverFeatureFlags,
}));

vi.mock("@/lib/supabase/service-role", () => ({
  createServiceRoleSupabaseClient: () => ({
    from: mocks.fromMock,
  }),
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
  formData.set("pagePath", "/contact");
  formData.set("primaryGoal", "Improve conversion clarity");
  formData.set("projectType", "homepage");
  formData.set("referrer", "https://google.com");
  formData.append("servicesInterest", "strategic-framing");
  formData.set("timelineBand", "2-4-weeks");
  formData.set("website", "https://example.com");

  return formData;
}

describe("submitQuoteRequest", () => {
  beforeEach(() => {
    mocks.fromMock.mockReset();
    mocks.insertMock.mockReset();
    mocks.fromMock.mockReturnValue({
      insert: mocks.insertMock,
    });
    mocks.serverFeatureFlags.serviceRoleEnabled = true;
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
  });

  it("logs insert failures and returns the generic save error", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mocks.insertMock.mockResolvedValueOnce({
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
  });

  it("logs unexpected insert errors and returns the generic save error", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mocks.insertMock.mockRejectedValueOnce(new Error("network down"));

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
  });

  it("inserts valid leads through the service-role client without logging an error", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mocks.insertMock.mockResolvedValueOnce({ error: null });

    const result = await submitQuoteRequest(
      { fieldErrors: {}, message: null, status: "idle" },
      buildValidFormData(),
    );

    expect(mocks.fromMock).toHaveBeenCalledWith("leads");
    expect(mocks.insertMock).toHaveBeenCalledTimes(1);
    expect(result.status).toBe("success");
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
