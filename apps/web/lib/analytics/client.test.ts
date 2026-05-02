import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  posthog: {
    capture: vi.fn(),
    get_session_id: vi.fn(),
    has_opted_out_capturing: vi.fn(),
  },
}));

vi.mock("posthog-js", () => ({
  default: mocks.posthog,
}));

describe("analytics client mirroring", () => {
  beforeEach(() => {
    mocks.posthog.capture.mockReset();
    mocks.posthog.get_session_id.mockReset();
    mocks.posthog.has_opted_out_capturing.mockReset();
    mocks.posthog.get_session_id.mockReturnValue("session-123");
    mocks.posthog.has_opted_out_capturing.mockReturnValue(false);
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

  it("includes locale in PostHog capture and mirror when provided", async () => {
    const { captureEvent } = await import("./client");

    captureEvent(
      "cta_click",
      {
        cta_id: "book-call",
        page_path: "/contact",
        placement: "header",
      },
      "es",
    );

    expect(mocks.posthog.capture).toHaveBeenCalledWith("cta_click", {
      cta_id: "book-call",
      locale: "es",
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
          locale: "es",
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

  it("includes locale in page view mirror when provided", async () => {
    const { capturePageView } = await import("./client");

    capturePageView("/es/servicios", "es");

    expect(global.fetch).toHaveBeenCalledWith("/api/analytics/events", {
      body: JSON.stringify({
        eventName: "page_view",
        pagePath: "/es/servicios",
        properties: { locale: "es" },
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

  it("skips PostHog capture and mirror when opted out", async () => {
    mocks.posthog.has_opted_out_capturing.mockReturnValue(true);

    const { captureEvent } = await import("./client");

    captureEvent("cta_click", {
      cta_id: "book-call",
      page_path: "/contact",
      placement: "header",
    });

    expect(mocks.posthog.capture).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("skips page view mirror when opted out", async () => {
    mocks.posthog.has_opted_out_capturing.mockReturnValue(true);

    const { capturePageView } = await import("./client");

    capturePageView("/insights");

    expect(global.fetch).not.toHaveBeenCalled();
  });
});
