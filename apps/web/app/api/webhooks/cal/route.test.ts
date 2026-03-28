// @vitest-environment node

import { createHmac } from "node:crypto";

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createServiceRoleSupabaseClientMock: vi.fn(),
  fromMock: vi.fn(),
  insertMock: vi.fn(),
  serverEnv: {
    calWebhookSecret: "super-secret",
  },
  serverFeatureFlags: {
    calWebhookEnabled: true,
  },
}));

vi.mock("@/lib/env/server", () => ({
  serverEnv: mocks.serverEnv,
  serverFeatureFlags: mocks.serverFeatureFlags,
}));

vi.mock("@/lib/supabase/service-role", () => ({
  createServiceRoleSupabaseClient: mocks.createServiceRoleSupabaseClientMock,
}));

function signPayload(payload: string) {
  return createHmac("sha256", mocks.serverEnv.calWebhookSecret)
    .update(payload)
    .digest("hex");
}

function buildRequest(payload: string, signature = signPayload(payload)) {
  return new NextRequest("https://example.com/api/webhooks/cal", {
    body: payload,
    headers: {
      "content-type": "application/json",
      "user-agent": "Vitest",
      "x-cal-signature-256": signature,
      "x-cal-webhook-version": "2021-10-20",
    },
    method: "POST",
  });
}

describe("POST /api/webhooks/cal", () => {
  beforeEach(() => {
    mocks.fromMock.mockReset();
    mocks.insertMock.mockReset();
    mocks.createServiceRoleSupabaseClientMock.mockReset();
    mocks.serverFeatureFlags.calWebhookEnabled = true;
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

  it("stores a normalized booking_complete event for BOOKING_CREATED", async () => {
    const payload = JSON.stringify({
      createdAt: "2026-03-28T10:00:00.000Z",
      payload: {
        attendees: [
          {
            email: "guest@example.com",
            name: "Guest User",
          },
        ],
        endTime: "2026-04-01T10:30:00.000Z",
        eventTypeId: 42,
        startTime: "2026-04-01T10:00:00.000Z",
        status: "ACCEPTED",
        title: "Discovery Call",
        uid: "booking_123",
        videoCallUrl: "https://video.example.com/secret",
      },
      triggerEvent: "BOOKING_CREATED",
    });
    const { POST } = await import("./route");

    const response = await POST(buildRequest(payload));

    expect(response.status).toBe(202);
    expect(mocks.fromMock).toHaveBeenCalledWith("events");
    expect(mocks.insertMock).toHaveBeenCalledWith({
      event_name: "booking_complete",
      page_path: "/contact",
      properties: {
        bookingSurface: "contact-inline-embed",
        bookingUid: "booking_123",
        endTime: "2026-04-01T10:30:00.000Z",
        eventTitle: "Discovery Call",
        eventTypeId: 42,
        provider: "cal.com",
        providerTrigger: "BOOKING_CREATED",
        startTime: "2026-04-01T10:00:00.000Z",
        status: "ACCEPTED",
        webhookVersion: "2021-10-20",
      },
      referrer: null,
      session_id: null,
      user_agent: "Vitest",
    });
    expect(mocks.insertMock.mock.calls[0]?.[0]?.properties).not.toHaveProperty(
      "attendees",
    );
    expect(mocks.insertMock.mock.calls[0]?.[0]?.properties).not.toHaveProperty(
      "videoCallUrl",
    );
  });

  it("rejects invalid signatures without writing an event", async () => {
    const payload = JSON.stringify({
      payload: {},
      triggerEvent: "BOOKING_CREATED",
    });
    const { POST } = await import("./route");

    const response = await POST(buildRequest(payload, "invalid"));

    expect(response.status).toBe(401);
    expect(mocks.fromMock).not.toHaveBeenCalled();
  });

  it("ignores unsupported trigger events", async () => {
    const payload = JSON.stringify({
      payload: {
        uid: "booking_123",
      },
      triggerEvent: "BOOKING_CANCELLED",
    });
    const { POST } = await import("./route");

    const response = await POST(buildRequest(payload));

    expect(response.status).toBe(202);
    expect(mocks.fromMock).not.toHaveBeenCalled();
  });
});
