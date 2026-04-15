import type { AdminOverviewWatchdogAlert } from "@/interfaces/admin/overview-dashboard";

export interface OverviewWatchdogEventRow {
  created_at: string;
  reason: string;
  source: "newsletter_signup" | "quote_request";
  status: "error" | "success";
}

interface AdminOverviewWatchdogFeatureFlags {
  hcaptchaEnabled: boolean;
  newsletterSignupEnabled: boolean;
  serviceRoleEnabled: boolean;
}

const watchdogWindowMs = 24 * 60 * 60 * 1000;

function isWithinWatchdogWindow(value: string | null, now: Date) {
  if (!value) {
    return false;
  }

  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return false;
  }

  return now.getTime() - timestamp <= watchdogWindowMs;
}

function getLatestWatchdogEvent(
  rows: OverviewWatchdogEventRow[],
  source: OverviewWatchdogEventRow["source"],
) {
  return rows.reduce<OverviewWatchdogEventRow | null>((latest, row) => {
    if (row.source !== source) {
      return latest;
    }

    if (!latest) {
      return row;
    }

    return row.created_at > latest.created_at ? row : latest;
  }, null);
}

function buildFormWatchdogAlert(input: {
  criticalSummary: string;
  healthySummary: string;
  id: AdminOverviewWatchdogAlert["id"];
  inactiveSummary: string;
  label: string;
  latestEvent: OverviewWatchdogEventRow | null;
  now: Date;
  enabled: boolean;
}): AdminOverviewWatchdogAlert {
  if (!input.enabled) {
    return {
      id: input.id,
      label: input.label,
      lastCheckedAt: input.latestEvent?.created_at ?? null,
      status: "inactive",
      summary: input.inactiveSummary,
    };
  }

  if (
    input.latestEvent?.status === "error" &&
    isWithinWatchdogWindow(input.latestEvent.created_at, input.now)
  ) {
    return {
      id: input.id,
      label: input.label,
      lastCheckedAt: input.latestEvent.created_at,
      status: "critical",
      summary: input.criticalSummary,
    };
  }

  return {
    id: input.id,
    label: input.label,
    lastCheckedAt: input.latestEvent?.created_at ?? null,
    status: "healthy",
    summary: input.healthySummary,
  };
}

export function buildAdminOverviewWatchdogAlerts(input: {
  featureFlags: AdminOverviewWatchdogFeatureFlags;
  latestAnalyticsEventAt: string | null;
  latestWatchdogEvents: OverviewWatchdogEventRow[];
  now?: Date;
}): AdminOverviewWatchdogAlert[] {
  const now = input.now ?? new Date();
  const latestQuoteRequestEvent = getLatestWatchdogEvent(
    input.latestWatchdogEvents,
    "quote_request",
  );
  const latestNewsletterEvent = getLatestWatchdogEvent(
    input.latestWatchdogEvents,
    "newsletter_signup",
  );

  return [
    buildFormWatchdogAlert({
      criticalSummary: "The latest form attempt failed.",
      enabled:
        input.featureFlags.serviceRoleEnabled &&
        input.featureFlags.hcaptchaEnabled,
      healthySummary: "No recent operational failures were recorded.",
      id: "quote_request_form",
      inactiveSummary:
        "Service-role access or hCaptcha is not configured in this environment.",
      label: "Quote request form",
      latestEvent: latestQuoteRequestEvent,
      now,
    }),
    buildFormWatchdogAlert({
      criticalSummary: "The latest signup attempt failed.",
      enabled: input.featureFlags.newsletterSignupEnabled,
      healthySummary: "No recent signup failures were recorded.",
      id: "newsletter_signup",
      inactiveSummary:
        "Newsletter signup is not configured in this environment.",
      label: "Newsletter signup",
      latestEvent: latestNewsletterEvent,
      now,
    }),
    input.featureFlags.serviceRoleEnabled
      ? isWithinWatchdogWindow(input.latestAnalyticsEventAt, now)
        ? {
            id: "analytics_mirror",
            label: "Analytics mirror",
            lastCheckedAt: input.latestAnalyticsEventAt,
            status: "healthy",
            summary: "Analytics events were mirrored in the last 24 hours.",
          }
        : {
            id: "analytics_mirror",
            label: "Analytics mirror",
            lastCheckedAt: input.latestAnalyticsEventAt,
            status: "warning",
            summary: "No analytics events were mirrored in the last 24 hours.",
          }
      : {
          id: "analytics_mirror",
          label: "Analytics mirror",
          lastCheckedAt: input.latestAnalyticsEventAt,
          status: "inactive",
          summary: "Analytics mirroring is not configured in this environment.",
        },
  ];
}
