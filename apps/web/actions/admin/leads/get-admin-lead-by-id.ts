"use server";

import "server-only";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type { AdminLeadEditorRecord } from "@/interfaces/admin/lead-editor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAdminLeadById(
  id: string,
): Promise<AdminLeadEditorRecord | null> {
  await requireCurrentAdminAccess("/admin/leads");

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("leads")
    .select(
      "budget_band, company, created_at, email, id, internal_notes, message, name, page_path, services_interest, source_utm, status, timeline_band, website",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load lead record.");
  }

  if (!data) {
    return null;
  }

  return {
    budgetBand: data.budget_band,
    company: data.company,
    createdAt: data.created_at,
    email: data.email,
    id: data.id,
    internalNotes: data.internal_notes,
    message: data.message,
    name: data.name,
    pagePath: data.page_path,
    servicesInterest: data.services_interest ?? [],
    sourceUtm:
      data.source_utm && typeof data.source_utm === "object"
        ? (data.source_utm as Record<string, string>)
        : null,
    status: data.status ?? "new",
    timelineBand: data.timeline_band,
    website: data.website,
  };
}
