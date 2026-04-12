// @vitest-environment node

import { describe, expect, it } from "vitest";

import {
  buildAdminOverviewDashboardData,
  buildAdminOverviewWatchdogAlerts,
  resolveAdminOverviewRange,
} from "./helpers";

describe("admin overview analytics helpers", () => {
  it("defaults invalid range inputs to the last 30 days", () => {
    const range = resolveAdminOverviewRange(
      {
        range: "nope",
      },
      new Date("2026-04-12T14:00:00.000Z"),
    );

    expect(range.key).toBe("30d");
    expect(range.from).toBe("2026-03-14");
    expect(range.to).toBe("2026-04-12");
    expect(range.previousFrom).toBe("2026-02-12");
    expect(range.previousTo).toBe("2026-03-13");
  });

  it("builds a previous equal-length comparison window for custom ranges", () => {
    const range = resolveAdminOverviewRange(
      {
        from: "2026-04-01",
        range: "custom",
        to: "2026-04-10",
      },
      new Date("2026-04-12T14:00:00.000Z"),
    );

    expect(range.key).toBe("custom");
    expect(range.from).toBe("2026-04-01");
    expect(range.to).toBe("2026-04-10");
    expect(range.previousFrom).toBe("2026-03-22");
    expect(range.previousTo).toBe("2026-03-31");
  });

  it("aggregates sessions, qualified leads, landing pages, and CTA totals", () => {
    const range = resolveAdminOverviewRange(
      {
        range: "7d",
      },
      new Date("2026-04-12T14:00:00.000Z"),
    );

    const data = buildAdminOverviewDashboardData({
      events: [
        {
          created_at: "2026-04-11T09:00:00.000Z",
          event_name: "page_view",
          page_path: "/services",
          properties: null,
          session_id: "session-a",
        },
        {
          created_at: "2026-04-11T09:02:00.000Z",
          event_name: "page_view",
          page_path: "/contact",
          properties: null,
          session_id: "session-a",
        },
        {
          created_at: "2026-04-10T10:00:00.000Z",
          event_name: "page_view",
          page_path: "/contact",
          properties: null,
          session_id: "session-b",
        },
        {
          created_at: "2026-04-09T10:00:00.000Z",
          event_name: "cta_click",
          page_path: "/contact",
          properties: {
            cta_id: "book-call",
            placement: "header",
          },
          session_id: "session-a",
        },
        {
          created_at: "2026-04-09T11:00:00.000Z",
          event_name: "cta_click",
          page_path: "/contact",
          properties: {
            cta_id: "book-call",
            placement: "header",
          },
          session_id: "session-b",
        },
        {
          created_at: "2026-04-03T09:00:00.000Z",
          event_name: "page_view",
          page_path: "/work",
          properties: null,
          session_id: "session-prev",
        },
      ],
      leads: [
        {
          created_at: "2026-04-11T13:00:00.000Z",
          status: "qualified",
        },
        {
          created_at: "2026-04-10T13:00:00.000Z",
          status: "new",
        },
        {
          created_at: "2026-04-03T13:00:00.000Z",
          status: "qualified",
        },
      ],
      range,
    });

    expect(data.sessions.value).toBe(2);
    expect(data.qualifiedLeads.value).toBe(1);
    expect(data.conversionRate.value).toBe(50);
    expect(data.alerts).toEqual([]);
    expect(data.topLandingPages).toEqual([
      { pagePath: "/contact", sessions: 1 },
      { pagePath: "/services", sessions: 1 },
    ]);
    expect(data.topCtas).toEqual([
      {
        ctaId: "book-call",
        clicks: 2,
        placement: "header",
      },
    ]);
  });

  it("marks a recent form failure as critical and recent analytics as healthy", () => {
    const alerts = buildAdminOverviewWatchdogAlerts({
      featureFlags: {
        hcaptchaEnabled: true,
        newsletterSignupEnabled: true,
        serviceRoleEnabled: true,
      },
      latestAnalyticsEventAt: "2026-04-12T11:00:00.000Z",
      latestWatchdogEvents: [
        {
          created_at: "2026-04-12T10:00:00.000Z",
          reason: "lead_insert_failed",
          source: "quote_request",
          status: "error",
        },
        {
          created_at: "2026-04-12T09:00:00.000Z",
          reason: "submitted",
          source: "newsletter_signup",
          status: "success",
        },
      ],
      now: new Date("2026-04-12T12:00:00.000Z"),
    });

    expect(alerts).toEqual([
      expect.objectContaining({
        id: "quote_request_form",
        status: "critical",
      }),
      expect.objectContaining({
        id: "newsletter_signup",
        status: "healthy",
      }),
      expect.objectContaining({
        id: "analytics_mirror",
        status: "healthy",
      }),
    ]);
  });

  it("uses the newest per-source watchdog event when a failure is followed by success", () => {
    const alerts = buildAdminOverviewWatchdogAlerts({
      featureFlags: {
        hcaptchaEnabled: true,
        newsletterSignupEnabled: true,
        serviceRoleEnabled: true,
      },
      latestAnalyticsEventAt: "2026-04-12T11:00:00.000Z",
      latestWatchdogEvents: [
        {
          created_at: "2026-04-11T10:00:00.000Z",
          reason: "lead_insert_failed",
          source: "quote_request",
          status: "error",
        },
        {
          created_at: "2026-04-12T10:00:00.000Z",
          reason: "submitted",
          source: "quote_request",
          status: "success",
        },
      ],
      now: new Date("2026-04-12T12:00:00.000Z"),
    });

    expect(alerts[0]).toEqual(
      expect.objectContaining({
        id: "quote_request_form",
        status: "healthy",
      }),
    );
  });

  it("marks disabled integrations inactive", () => {
    const alerts = buildAdminOverviewWatchdogAlerts({
      featureFlags: {
        hcaptchaEnabled: false,
        newsletterSignupEnabled: false,
        serviceRoleEnabled: false,
      },
      latestAnalyticsEventAt: null,
      latestWatchdogEvents: [],
      now: new Date("2026-04-12T12:00:00.000Z"),
    });

    expect(alerts).toEqual([
      expect.objectContaining({
        id: "quote_request_form",
        status: "inactive",
      }),
      expect.objectContaining({
        id: "newsletter_signup",
        status: "inactive",
      }),
      expect.objectContaining({
        id: "analytics_mirror",
        status: "inactive",
      }),
    ]);
  });

  it("marks stale analytics as warning", () => {
    const alerts = buildAdminOverviewWatchdogAlerts({
      featureFlags: {
        hcaptchaEnabled: true,
        newsletterSignupEnabled: true,
        serviceRoleEnabled: true,
      },
      latestAnalyticsEventAt: "2026-04-10T11:00:00.000Z",
      latestWatchdogEvents: [],
      now: new Date("2026-04-12T12:00:00.000Z"),
    });

    expect(alerts[2]).toEqual(
      expect.objectContaining({
        id: "analytics_mirror",
        status: "warning",
      }),
    );
  });
});
