// @vitest-environment node

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createServiceRoleSupabaseClientMock: vi.fn(),
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
  createServiceRoleSupabaseClient: mocks.createServiceRoleSupabaseClientMock,
}));

function buildRequest(body: unknown) {
  return new NextRequest("https://example.com/api/analytics/events", {
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      "user-agent": "Vitest",
    },
    method: "POST",
  });
}

describe("POST /api/analytics/events", () => {
  beforeEach(() => {
    mocks.createServiceRoleSupabaseClientMock.mockReset();
    mocks.fromMock.mockReset();
    mocks.insertMock.mockReset();
    mocks.serverFeatureFlags.serviceRoleEnabled = true;
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

  it("accepts allowlisted events and stores a sanitized insert", async () => {
    const { POST } = await import("./route");

    const response = await POST(
      buildRequest({
        eventName: "cta_click",
        pagePath: "/contact",
        properties: {
          cta_id: "book-call",
          nested: {
            safe: "value",
            skipped: undefined,
          },
          placement: "header",
        },
        referrer: "https://google.com",
        sessionId: "session-123",
      }),
    );

    expect(response.status).toBe(202);
    expect(mocks.fromMock).toHaveBeenCalledWith("events");
    expect(mocks.insertMock).toHaveBeenCalledWith({
      event_name: "cta_click",
      page_path: "/contact",
      properties: {
        cta_id: "book-call",
        nested: {
          safe: "value",
        },
        placement: "header",
      },
      referrer: "https://google.com",
      session_id: "session-123",
      user_agent: "Vitest",
    });
  });

  it("returns a deterministic no-op when service-role access is disabled", async () => {
    mocks.serverFeatureFlags.serviceRoleEnabled = false;
    const { POST } = await import("./route");

    const response = await POST(
      buildRequest({
        eventName: "page_view",
        pagePath: "/",
        properties: null,
        referrer: null,
        sessionId: "session-123",
      }),
    );

    expect(response.status).toBe(202);
    expect(mocks.fromMock).not.toHaveBeenCalled();
  });

  it("rejects malformed payloads predictably", async () => {
    const { POST } = await import("./route");

    const response = await POST(
      buildRequest({
        eventName: "unknown_event",
        pagePath: "/",
        properties: null,
        referrer: null,
        sessionId: null,
      }),
    );

    expect(response.status).toBe(400);
    expect(mocks.fromMock).not.toHaveBeenCalled();
  });
});
