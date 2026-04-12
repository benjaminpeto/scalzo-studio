"use server";

import "server-only";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type {
  AdminOverviewDashboardData,
  AdminOverviewSearchParams,
} from "@/interfaces/admin/overview-dashboard";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  buildAdminOverviewDashboardData,
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

  const [eventsResult, leadsResult] = await Promise.all([
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
  ]);

  if (eventsResult.error) {
    throw new Error("Could not load analytics events for the admin overview.");
  }

  if (leadsResult.error) {
    throw new Error("Could not load leads for the admin overview.");
  }

  return buildAdminOverviewDashboardData({
    events: eventsResult.data ?? [],
    leads: leadsResult.data ?? [],
    range,
  });
}
