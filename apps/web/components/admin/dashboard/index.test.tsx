import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AdminOverviewDashboard } from ".";

describe("AdminOverviewDashboard", () => {
  it("renders the default 30 day dashboard state", () => {
    render(
      <AdminOverviewDashboard
        data={{
          alerts: [
            {
              id: "quote_request_form",
              label: "Quote request form",
              lastCheckedAt: "2026-04-12T10:30:00.000Z",
              status: "healthy",
              summary: "No recent operational failures were recorded.",
            },
            {
              id: "newsletter_signup",
              label: "Newsletter signup",
              lastCheckedAt: "2026-04-12T10:00:00.000Z",
              status: "warning",
              summary:
                "No analytics events were mirrored in the last 24 hours.",
            },
            {
              id: "analytics_mirror",
              label: "Analytics mirror",
              lastCheckedAt: null,
              status: "inactive",
              summary:
                "Analytics mirroring is not configured in this environment.",
            },
          ],
          conversionRate: {
            delta: {
              percentageDelta: 25,
              previousValue: 4,
              valueDelta: 1,
            },
            tone: "positive",
            value: 5,
          },
          qualifiedLeads: {
            delta: {
              percentageDelta: 100,
              previousValue: 2,
              valueDelta: 2,
            },
            tone: "positive",
            value: 4,
          },
          range: {
            from: "2026-03-14",
            key: "30d",
            label: "Last 30 days",
            previousFrom: "2026-02-12",
            previousTo: "2026-03-13",
            to: "2026-04-12",
          },
          sessions: {
            delta: {
              percentageDelta: 20,
              previousValue: 10,
              valueDelta: 2,
            },
            tone: "neutral",
            value: 12,
          },
          topCtas: [
            {
              ctaId: "book-call",
              clicks: 8,
              placement: "header",
            },
          ],
          topLandingPages: [
            {
              pagePath: "/contact",
              sessions: 6,
            },
          ],
        }}
      />,
    );

    expect(screen.getByText("Overview KPI dashboard")).toBeTruthy();
    expect(screen.getByText(/Current window: Last 30 days\./)).toBeTruthy();
    expect(screen.getByText("Quote request form")).toBeTruthy();
    expect(screen.getByText("Healthy")).toBeTruthy();
    expect(screen.getByText("Qualified leads")).toBeTruthy();
    expect(screen.getByText("/contact")).toBeTruthy();
    expect(screen.getByText("book-call")).toBeTruthy();
  });

  it("renders custom range copy and empty-state tables", () => {
    render(
      <AdminOverviewDashboard
        data={{
          alerts: [
            {
              id: "quote_request_form",
              label: "Quote request form",
              lastCheckedAt: null,
              status: "critical",
              summary: "The latest form attempt failed.",
            },
            {
              id: "newsletter_signup",
              label: "Newsletter signup",
              lastCheckedAt: null,
              status: "inactive",
              summary:
                "Newsletter signup is not configured in this environment.",
            },
            {
              id: "analytics_mirror",
              label: "Analytics mirror",
              lastCheckedAt: "2026-03-30T08:00:00.000Z",
              status: "warning",
              summary:
                "No analytics events were mirrored in the last 24 hours.",
            },
          ],
          conversionRate: {
            delta: {
              percentageDelta: 0,
              previousValue: 0,
              valueDelta: 0,
            },
            tone: "positive",
            value: 0,
          },
          qualifiedLeads: {
            delta: {
              percentageDelta: 0,
              previousValue: 0,
              valueDelta: 0,
            },
            tone: "positive",
            value: 0,
          },
          range: {
            from: "2026-04-01",
            key: "custom",
            label: "2026-04-01 to 2026-04-10",
            previousFrom: "2026-03-22",
            previousTo: "2026-03-31",
            to: "2026-04-10",
          },
          sessions: {
            delta: {
              percentageDelta: 0,
              previousValue: 0,
              valueDelta: 0,
            },
            tone: "neutral",
            value: 0,
          },
          topCtas: [],
          topLandingPages: [],
        }}
      />,
    );

    expect(
      screen.getByText(/Current window: 2026-04-01 to 2026-04-10\./),
    ).toBeTruthy();
    expect(
      screen.getByText("No landing-page sessions were captured in this range."),
    ).toBeTruthy();
    expect(
      screen.getByText("No CTA clicks were captured in this range."),
    ).toBeTruthy();
    expect(screen.getByText("The latest form attempt failed.")).toBeTruthy();
  });
});
