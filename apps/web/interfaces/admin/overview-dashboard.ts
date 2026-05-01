import type { Json } from "@/lib/supabase/database.types";
import { ReactNode, RefObject } from "react";

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

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  defaultValue: string;
  name: string;
  options: FilterOption[];
  placeholder: string;
}

export interface AdminListToolbarProps {
  clearHref: string;
  extraActions?: ReactNode;
  filters?: FilterConfig[];
  formAction: string;
  isFiltered: boolean;
  newHref?: string;
  newLabel?: string;
  query?: string;
  searchPlaceholder?: string;
  statusMessage?: string | null;
  summaryText: string;
  title: string;
}

export interface MarkdownEditorProps {
  id?: string;
  name: string;
  /** Controlled mode — provide onChange too */
  value?: string;
  /** Uncontrolled mode */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Forward to the underlying textarea (e.g. for snippet insertion) */
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  required?: boolean;
  spellCheck?: boolean;
  placeholder?: string;
  /** Extra className applied to the textarea (e.g. "min-h-144") */
  className?: string;
}
