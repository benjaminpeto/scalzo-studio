export const adminOverviewRangePresets = [
  "7d",
  "30d",
  "90d",
  "custom",
] as const;

export type AdminOverviewRangePreset =
  (typeof adminOverviewRangePresets)[number];

export interface AdminOverviewSearchParams {
  from?: string;
  range?: string;
  to?: string;
}

export interface AdminOverviewDateRange {
  from: string;
  key: AdminOverviewRangePreset;
  label: string;
  previousFrom: string;
  previousTo: string;
  to: string;
}

export interface AdminOverviewKpiDelta {
  percentageDelta: number | null;
  previousValue: number;
  valueDelta: number;
}

export interface AdminOverviewKpi {
  delta: AdminOverviewKpiDelta;
  tone: "neutral" | "positive";
  value: number;
}

export interface AdminOverviewLandingPageRow {
  pagePath: string;
  sessions: number;
}

export interface AdminOverviewTopCtaRow {
  ctaId: string;
  clicks: number;
  placement: string;
}

export interface AdminOverviewDashboardData {
  conversionRate: AdminOverviewKpi;
  qualifiedLeads: AdminOverviewKpi;
  range: AdminOverviewDateRange;
  sessions: AdminOverviewKpi;
  topCtas: AdminOverviewTopCtaRow[];
  topLandingPages: AdminOverviewLandingPageRow[];
}

export interface AdminOverviewDashboardProps {
  data: AdminOverviewDashboardData;
}

export interface AdminOverviewKpiCardProps {
  format: "count" | "percent";
  label: string;
  metric: AdminOverviewKpi;
}
