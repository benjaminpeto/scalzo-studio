"use server";

import "server-only";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type {
  AdminOverviewDashboardData,
  AdminOverviewSearchParams,
} from "@/interfaces/admin/overview-dashboard";
import { serverFeatureFlags } from "@/lib/env/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  buildAdminOverviewDashboardData,
  buildAdminOverviewWatchdogAlerts,
  type OverviewWatchdogEventRow,
  resolveAdminOverviewRange,
} from "./helpers";

export async function getAdminOverviewDashboardData(
  searchParams?: AdminOverviewSearchParams,
): Promise<AdminOverviewDashboardData> {
  await requireCurrentAdminAccess("/admin");

  const range = resolveAdminOverviewRange(searchParams);
  const supabase = await createServerSupabaseClient();
  const queryStart = range.previousWindow.startInclusive.toISOString();
  const queryEnd = range.currentWindow.endExclusive.toISOString();

  const [
    eventsResult,
    leadsResult,
    latestAnalyticsEventResult,
    latestQuoteRequestWatchdogResult,
    latestNewsletterWatchdogResult,
  ] = await Promise.all([
    supabase
      .from("events")
      .select("created_at, event_name, page_path, properties, session_id")
      .gte("created_at", queryStart)
      .lt("created_at", queryEnd)
      .in("event_name", ["cta_click", "page_view"]),
    supabase
      .from("leads")
      .select("created_at, status")
      .gte("created_at", queryStart)
      .lt("created_at", queryEnd),
    supabase
      .from("events")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle<{ created_at: string }>(),
    supabase
      .from("watchdog_events")
      .select("created_at, reason, source, status")
      .eq("source", "quote_request")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle<OverviewWatchdogEventRow>(),
    supabase
      .from("watchdog_events")
      .select("created_at, reason, source, status")
      .eq("source", "newsletter_signup")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle<OverviewWatchdogEventRow>(),
  ]);

  if (eventsResult.error) {
    throw new Error("Could not load analytics events for the admin overview.");
  }

  if (leadsResult.error) {
    throw new Error("Could not load leads for the admin overview.");
  }

  if (latestAnalyticsEventResult.error) {
    throw new Error(
      "Could not load analytics watchdog state for the admin overview.",
    );
  }

  if (latestQuoteRequestWatchdogResult.error) {
    throw new Error(
      "Could not load quote-request watchdog state for the admin overview.",
    );
  }

  if (latestNewsletterWatchdogResult.error) {
    throw new Error(
      "Could not load newsletter watchdog state for the admin overview.",
    );
  }

  const dashboardData = buildAdminOverviewDashboardData({
    events: eventsResult.data ?? [],
    leads: leadsResult.data ?? [],
    range,
  });

  return {
    ...dashboardData,
    alerts: buildAdminOverviewWatchdogAlerts({
      featureFlags: {
        hcaptchaEnabled: serverFeatureFlags.hcaptchaEnabled,
        newsletterSignupEnabled: serverFeatureFlags.newsletterSignupEnabled,
        serviceRoleEnabled: serverFeatureFlags.serviceRoleEnabled,
      },
      latestAnalyticsEventAt:
        latestAnalyticsEventResult.data?.created_at ?? null,
      latestWatchdogEvents: [
        latestQuoteRequestWatchdogResult.data,
        latestNewsletterWatchdogResult.data,
      ].filter((row): row is OverviewWatchdogEventRow => Boolean(row)),
    }),
  };
}
