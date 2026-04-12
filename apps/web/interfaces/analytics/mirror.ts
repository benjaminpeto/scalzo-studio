import type { Json } from "@/lib/supabase/database.types";

export const mirroredAnalyticsEventNames = [
  "admin_login_succeeded",
  "booking_created",
  "booking_complete",
  "case_study_view",
  "cta_click",
  "form_start",
  "form_step_complete",
  "form_submit",
  "newsletter_confirmed",
  "newsletter_subscribe",
  "page_view",
  "quote_request_submitted",
] as const;

export type MirroredAnalyticsEventName =
  (typeof mirroredAnalyticsEventNames)[number];

export interface MirroredAnalyticsPayload {
  eventName: MirroredAnalyticsEventName;
  pagePath: string | null;
  properties: Json | null;
  referrer: string | null;
  sessionId: string | null;
}
