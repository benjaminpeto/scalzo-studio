// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createServiceRoleSupabaseClientMock: vi.fn(),
  fromMock: vi.fn(),
  insertMock: vi.fn(),
  getPostHogClientMock: vi.fn(),
  posthogCaptureMock: vi.fn(),
  serverFeatureFlags: {
    serviceRoleEnabled: true,
  },
}));

vi.mock("@/lib/env/server", () => ({
  serverFeatureFlags: mocks.serverFeatureFlags,
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/posthog-server", () => ({
  getPostHogClient: mocks.getPostHogClientMock,
}));

vi.mock("@/lib/supabase/service-role", () => ({
  createServiceRoleSupabaseClient: mocks.createServiceRoleSupabaseClientMock,
}));

describe("captureServerEvent", () => {
  beforeEach(() => {
    mocks.createServiceRoleSupabaseClientMock.mockReset();
    mocks.fromMock.mockReset();
    mocks.insertMock.mockReset();
    mocks.getPostHogClientMock.mockReset();
    mocks.posthogCaptureMock.mockReset();
    mocks.serverFeatureFlags.serviceRoleEnabled = true;

    mocks.getPostHogClientMock.mockReturnValue({
      capture: mocks.posthogCaptureMock,
    });
    mocks.createServiceRoleSupabaseClientMock.mockReturnValue({
      from: mocks.fromMock,
    });
    mocks.fromMock.mockReturnValue({
      insert: mocks.insertMock,
    });
    mocks.insertMock.mockResolvedValue({
      error: null,
    });
  });

  it("captures to PostHog and mirrors allowlisted server events to Supabase", async () => {
    const { captureServerEvent } = await import("./server");

    await captureServerEvent(
      "hello@example.com",
      "quote_request_submitted",
      {
        budget_band: "1000-3000",
        lead_id: "lead-123",
        newsletter_opt_in: true,
        page_path: "/contact",
        services_interest: ["strategy"],
        timeline_band: "2-4-weeks",
        utm_campaign: null,
        utm_medium: null,
        utm_source: "google",
      },
      {
        pagePath: "/contact",
        referrer: "https://google.com",
      },
    );

    expect(mocks.posthogCaptureMock).toHaveBeenCalledWith({
      distinctId: "hello@example.com",
      event: "quote_request_submitted",
      properties: expect.objectContaining({
        lead_id: "lead-123",
        page_path: "/contact",
      }),
    });
    expect(mocks.fromMock).toHaveBeenCalledWith("events");
    expect(mocks.insertMock).toHaveBeenCalledWith({
      event_name: "quote_request_submitted",
      page_path: "/contact",
      properties: expect.objectContaining({
        lead_id: "lead-123",
        page_path: "/contact",
      }),
      referrer: "https://google.com",
      session_id: null,
      user_agent: null,
    });
  });

  it("skips the Supabase mirror when service-role access is unavailable", async () => {
    mocks.serverFeatureFlags.serviceRoleEnabled = false;
    const { captureServerEvent } = await import("./server");

    await captureServerEvent("admin@example.com", "booking_created", {
      booking_title: "Discovery Call",
      booking_uid: "booking-123",
      end_time: null,
      start_time: null,
      status: "accepted",
    });

    expect(mocks.posthogCaptureMock).toHaveBeenCalled();
    expect(mocks.fromMock).not.toHaveBeenCalled();
  });
});
