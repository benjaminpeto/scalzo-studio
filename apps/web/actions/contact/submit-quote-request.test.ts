// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

import { submitQuoteRequest } from "./submit-quote-request";

const insertMock = vi.fn();
const fromMock = vi.fn(() => ({
  insert: insertMock,
}));

vi.mock("@/lib/env/server", () => ({
  serverFeatureFlags: {
    serviceRoleEnabled: true,
  },
}));

vi.mock("@/lib/supabase/service-role", () => ({
  createServiceRoleSupabaseClient: () => ({
    from: fromMock,
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
  it("short-circuits honeypot submissions without touching the database", async () => {
    const formData = buildValidFormData();
    formData.set("companyWebsite", "bot-fill");

    const result = await submitQuoteRequest(
      { fieldErrors: {}, message: null, status: "idle" },
      formData,
    );

    expect(result.status).toBe("success");
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("returns field errors for invalid submissions", async () => {
    const formData = new FormData();
    formData.set("email", "bad-email");

    const result = await submitQuoteRequest(
      { fieldErrors: {}, message: null, status: "idle" },
      formData,
    );

    expect(result.status).toBe("error");
    expect(result.fieldErrors.email).toBe("Enter a valid email address.");
  });

  it("inserts valid leads through the service-role client", async () => {
    insertMock.mockResolvedValueOnce({ error: null });

    const result = await submitQuoteRequest(
      { fieldErrors: {}, message: null, status: "idle" },
      buildValidFormData(),
    );

    expect(fromMock).toHaveBeenCalledWith("leads");
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(result.status).toBe("success");
  });
});
