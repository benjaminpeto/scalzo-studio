import {
  adminOverviewTableRowLimit,
  qualifiedLeadStatuses,
} from "@/constants/admin/dashboard";
import type {
  AdminOverviewDashboardData,
  AdminOverviewDateRange,
  AdminOverviewKpiDelta,
  AdminOverviewRangePreset,
  AdminOverviewSearchParams,
  AdminOverviewTopCtaRow,
  AdminOverviewWatchdogAlert,
} from "@/interfaces/admin/overview-dashboard";
import type { Json } from "@/lib/supabase/database.types";

interface TimeWindow {
  endExclusive: Date;
  startInclusive: Date;
}

export interface ResolvedAdminOverviewRange extends AdminOverviewDateRange {
  currentWindow: TimeWindow;
  previousWindow: TimeWindow;
}

export interface OverviewEventRow {
  created_at: string;
  event_name: string;
  page_path: string | null;
  properties: Json | null;
  session_id: string | null;
}

export interface OverviewLeadRow {
  created_at: string;
  status: string | null;
}

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

const rangeDayCountMap: Record<
  Exclude<AdminOverviewRangePreset, "custom">,
  number
> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};
const watchdogWindowMs = 24 * 60 * 60 * 1000;

function toUtcDateString(value: Date) {
  return value.toISOString().slice(0, 10);
}

function startOfUtcDay(value: Date) {
  return new Date(
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()),
  );
}

function addUtcDays(value: Date, days: number) {
  return new Date(value.getTime() + days * 24 * 60 * 60 * 1000);
}

function parseDateInput(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }

  return parsed;
}

function formatRangeLabel(input: {
  from: string;
  key: AdminOverviewRangePreset;
  to: string;
}) {
  if (input.key !== "custom") {
    return `Last ${rangeDayCountMap[input.key]} days`;
  }

  return `${input.from} to ${input.to}`;
}

function buildRangeOutput(input: {
  currentEndExclusive: Date;
  currentStartInclusive: Date;
  key: AdminOverviewRangePreset;
  previousEndExclusive: Date;
  previousStartInclusive: Date;
}): ResolvedAdminOverviewRange {
  const from = toUtcDateString(input.currentStartInclusive);
  const to = toUtcDateString(addUtcDays(input.currentEndExclusive, -1));
  const previousFrom = toUtcDateString(input.previousStartInclusive);
  const previousTo = toUtcDateString(
    addUtcDays(input.previousEndExclusive, -1),
  );

  return {
    currentWindow: {
      endExclusive: input.currentEndExclusive,
      startInclusive: input.currentStartInclusive,
    },
    from,
    key: input.key,
    label: formatRangeLabel({ from, key: input.key, to }),
    previousFrom,
    previousTo,
    previousWindow: {
      endExclusive: input.previousEndExclusive,
      startInclusive: input.previousStartInclusive,
    },
    to,
  };
}

export function resolveAdminOverviewRange(
  input?: AdminOverviewSearchParams,
  now = new Date(),
): ResolvedAdminOverviewRange {
  const today = startOfUtcDay(now);
  const tomorrow = addUtcDays(today, 1);
  const requestedRange = input?.range;
  const presetRange: AdminOverviewRangePreset =
    requestedRange === "7d" ||
    requestedRange === "30d" ||
    requestedRange === "90d" ||
    requestedRange === "custom"
      ? requestedRange
      : "30d";

  if (presetRange === "custom") {
    const from = parseDateInput(input?.from);
    const to = parseDateInput(input?.to);

    if (from && to && from <= to) {
      const currentEndExclusive = addUtcDays(to, 1);
      const rangeLengthInDays = Math.round(
        (currentEndExclusive.getTime() - from.getTime()) /
          (24 * 60 * 60 * 1000),
      );
      const previousEndExclusive = from;
      const previousStartInclusive = addUtcDays(from, -rangeLengthInDays);

      return buildRangeOutput({
        currentEndExclusive,
        currentStartInclusive: from,
        key: "custom",
        previousEndExclusive,
        previousStartInclusive,
      });
    }
  }

  const rangeLengthInDays =
    rangeDayCountMap[
      presetRange as Exclude<AdminOverviewRangePreset, "custom">
    ];
  const currentStartInclusive = addUtcDays(today, -(rangeLengthInDays - 1));
  const previousEndExclusive = currentStartInclusive;
  const previousStartInclusive = addUtcDays(
    previousEndExclusive,
    -rangeLengthInDays,
  );

  return buildRangeOutput({
    currentEndExclusive: tomorrow,
    currentStartInclusive,
    key: presetRange as Exclude<AdminOverviewRangePreset, "custom">,
    previousEndExclusive,
    previousStartInclusive,
  });
}

export function buildKpiDelta(
  value: number,
  previousValue: number,
): AdminOverviewKpiDelta {
  const valueDelta = value - previousValue;

  return {
    percentageDelta:
      previousValue === 0
        ? value === 0
          ? 0
          : null
        : (valueDelta / previousValue) * 100,
    previousValue,
    valueDelta,
  };
}

function isInWindow(value: string, window: TimeWindow) {
  return (
    value >= window.startInclusive.toISOString() &&
    value < window.endExclusive.toISOString()
  );
}

function sortByCountThenLabel<T extends { count: number; label: string }>(
  rows: T[],
) {
  return rows.sort((left, right) => {
    if (right.count !== left.count) {
      return right.count - left.count;
    }

    return left.label.localeCompare(right.label, "en", { sensitivity: "base" });
  });
}

function getPropertiesObject(value: Json | null) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, Json>)
    : null;
}

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

export function countSessions(rows: OverviewEventRow[], window: TimeWindow) {
  return new Set(
    rows
      .filter(
        (row) =>
          row.event_name === "page_view" &&
          Boolean(row.session_id) &&
          isInWindow(row.created_at, window),
      )
      .map((row) => row.session_id as string),
  ).size;
}

export function countQualifiedLeads(
  rows: OverviewLeadRow[],
  window: TimeWindow,
) {
  return rows.filter(
    (row) =>
      Boolean(row.status) &&
      qualifiedLeadStatuses.has((row.status ?? "").trim()) &&
      isInWindow(row.created_at, window),
  ).length;
}

export function getTopLandingPages(
  rows: OverviewEventRow[],
  window: TimeWindow,
) {
  const firstPageBySession = new Map<
    string,
    { createdAt: string; pagePath: string }
  >();

  for (const row of rows) {
    if (
      row.event_name !== "page_view" ||
      !row.session_id ||
      !row.page_path ||
      !isInWindow(row.created_at, window)
    ) {
      continue;
    }

    const current = firstPageBySession.get(row.session_id);

    if (!current || row.created_at < current.createdAt) {
      firstPageBySession.set(row.session_id, {
        createdAt: row.created_at,
        pagePath: row.page_path,
      });
    }
  }

  const counts = Array.from(firstPageBySession.values()).reduce<
    Record<string, number>
  >((result, row) => {
    result[row.pagePath] = (result[row.pagePath] ?? 0) + 1;
    return result;
  }, {});

  return sortByCountThenLabel(
    Object.entries(counts).map(([pagePath, count]) => ({
      count,
      label: pagePath,
      pagePath,
      sessions: count,
    })),
  )
    .slice(0, adminOverviewTableRowLimit)
    .map(({ pagePath, sessions }) => ({
      pagePath,
      sessions,
    }));
}

export function getTopCtas(
  rows: OverviewEventRow[],
  window: TimeWindow,
): AdminOverviewTopCtaRow[] {
  const counts = rows.reduce<
    Record<string, { clicks: number; ctaId: string; placement: string }>
  >((result, row) => {
    if (row.event_name !== "cta_click" || !isInWindow(row.created_at, window)) {
      return result;
    }

    const properties = getPropertiesObject(row.properties);
    const ctaId =
      typeof properties?.cta_id === "string" ? properties.cta_id : "unknown";
    const placement =
      typeof properties?.placement === "string"
        ? properties.placement
        : "unknown";
    const key = `${ctaId}::${placement}`;

    result[key] = {
      clicks: (result[key]?.clicks ?? 0) + 1,
      ctaId,
      placement,
    };

    return result;
  }, {});

  return sortByCountThenLabel(
    Object.values(counts).map((row) => ({
      count: row.clicks,
      ctaId: row.ctaId,
      clicks: row.clicks,
      label: `${row.ctaId} ${row.placement}`,
      placement: row.placement,
    })),
  )
    .slice(0, adminOverviewTableRowLimit)
    .map(({ ctaId, clicks, placement }) => ({
      ctaId,
      clicks,
      placement,
    }));
}

export function buildAdminOverviewDashboardData(input: {
  events: OverviewEventRow[];
  leads: OverviewLeadRow[];
  range: ResolvedAdminOverviewRange;
}): AdminOverviewDashboardData {
  const currentSessions = countSessions(
    input.events,
    input.range.currentWindow,
  );
  const previousSessions = countSessions(
    input.events,
    input.range.previousWindow,
  );
  const currentQualifiedLeads = countQualifiedLeads(
    input.leads,
    input.range.currentWindow,
  );
  const previousQualifiedLeads = countQualifiedLeads(
    input.leads,
    input.range.previousWindow,
  );
  const currentConversionRate =
    currentSessions === 0 ? 0 : (currentQualifiedLeads / currentSessions) * 100;
  const previousConversionRate =
    previousSessions === 0
      ? 0
      : (previousQualifiedLeads / previousSessions) * 100;

  return {
    alerts: [],
    conversionRate: {
      delta: buildKpiDelta(currentConversionRate, previousConversionRate),
      tone: "positive",
      value: currentConversionRate,
    },
    qualifiedLeads: {
      delta: buildKpiDelta(currentQualifiedLeads, previousQualifiedLeads),
      tone: "positive",
      value: currentQualifiedLeads,
    },
    range: input.range,
    sessions: {
      delta: buildKpiDelta(currentSessions, previousSessions),
      tone: "neutral",
      value: currentSessions,
    },
    topCtas: getTopCtas(input.events, input.range.currentWindow),
    topLandingPages: getTopLandingPages(
      input.events,
      input.range.currentWindow,
    ),
  };
}
