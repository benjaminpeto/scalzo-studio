import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  posthog: {
    capture: vi.fn(),
    get_session_id: vi.fn(),
  },
}));

vi.mock("posthog-js", () => ({
  default: mocks.posthog,
}));

describe("analytics client mirroring", () => {
  beforeEach(() => {
    mocks.posthog.capture.mockReset();
    mocks.posthog.get_session_id.mockReset();
    mocks.posthog.get_session_id.mockReturnValue("session-123");
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 202 }),
    );
    window.history.pushState({}, "", "/work");
    Object.defineProperty(document, "referrer", {
      configurable: true,
      value: "https://google.com",
    });
  });

  it("captures the PostHog event and mirrors the enriched payload", async () => {
    const { captureEvent } = await import("./client");

    captureEvent("cta_click", {
      cta_id: "book-call",
      page_path: "/contact",
      placement: "header",
    });

    expect(mocks.posthog.capture).toHaveBeenCalledWith("cta_click", {
      cta_id: "book-call",
      page_path: "/contact",
      placement: "header",
    });
    expect(global.fetch).toHaveBeenCalledWith("/api/analytics/events", {
      body: JSON.stringify({
        eventName: "cta_click",
        pagePath: "/contact",
        properties: {
          cta_id: "book-call",
          page_path: "/contact",
          placement: "header",
        },
        referrer: "https://google.com",
        sessionId: "session-123",
      }),
      headers: {
        "content-type": "application/json",
      },
      keepalive: true,
      method: "POST",
    });
  });

  it("mirrors page views with the current pathname", async () => {
    const { capturePageView } = await import("./client");

    capturePageView("/insights");

    expect(global.fetch).toHaveBeenCalledWith("/api/analytics/events", {
      body: JSON.stringify({
        eventName: "page_view",
        pagePath: "/insights",
        properties: null,
        referrer: "https://google.com",
        sessionId: "session-123",
      }),
      headers: {
        "content-type": "application/json",
      },
      keepalive: true,
      method: "POST",
    });
  });
});
