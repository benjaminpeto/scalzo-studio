import {
  adminOverviewTableRowLimit,
  qualifiedLeadStatuses,
} from "@/constants/admin/dashboard";
import type {
  AdminOverviewDashboardData,
  AdminOverviewKpiDelta,
  AdminOverviewTopCtaRow,
} from "@/interfaces/admin/overview-dashboard";
import type { Json } from "@/lib/supabase/database.types";

import type { ResolvedAdminOverviewRange, TimeWindow } from "./date-range";

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
