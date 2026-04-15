import type { Json } from "@/lib/supabase/database.types";

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

export interface TimeWindow {
  endExclusive: Date;
  startInclusive: Date;
}

export interface ResolvedAdminOverviewRange extends AdminOverviewDateRange {
  currentWindow: TimeWindow;
  previousWindow: TimeWindow;
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

export interface AdminOverviewWatchdogFeatureFlags {
  hcaptchaEnabled: boolean;
  newsletterSignupEnabled: boolean;
  serviceRoleEnabled: boolean;
}

export type AdminOverviewWatchdogAlertStatus =
  | "critical"
  | "healthy"
  | "inactive"
  | "warning";

export interface AdminOverviewWatchdogAlert {
  id: "analytics_mirror" | "newsletter_signup" | "quote_request_form";
  label: string;
  lastCheckedAt: string | null;
  status: AdminOverviewWatchdogAlertStatus;
  summary: string;
}

export interface AdminOverviewDashboardData {
  alerts: AdminOverviewWatchdogAlert[];
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
