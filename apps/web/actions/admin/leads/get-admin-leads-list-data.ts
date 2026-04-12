"use server";

import "server-only";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type { AdminLeadsListData } from "@/interfaces/admin/lead-list";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAdminLeadsListData(input?: {
  budget?: string;
  query?: string;
  status?: string;
}): Promise<AdminLeadsListData> {
  await requireCurrentAdminAccess("/admin/leads");

  const query = (input?.query ?? "").trim();
  const normalizedQuery = query.toLowerCase();
  const selectedStatus = input?.status?.trim() ?? "all";
  const selectedBudget = input?.budget?.trim() ?? "";

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("leads")
    .select(
      "budget_band, company, created_at, email, id, name, services_interest, status",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Could not load admin leads list.");
  }

  const allLeads = (data ?? []).map((lead) => ({
    budgetBand: lead.budget_band,
    company: lead.company,
    createdAt: lead.created_at,
    email: lead.email,
    id: lead.id,
    name: lead.name,
    searchText: [lead.name ?? "", lead.email ?? "", lead.company ?? ""]
      .join(" ")
      .toLowerCase(),
    servicesInterest: lead.services_interest ?? [],
    status: lead.status ?? "new",
  }));

  const budgets = Array.from(
    new Set(
      allLeads.map((lead) => lead.budgetBand?.trim() ?? "").filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

  const statuses = Array.from(
    new Set(allLeads.map((lead) => lead.status.trim()).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

  const leads = allLeads
    .filter((lead) => {
      const queryMatches = normalizedQuery
        ? lead.searchText.includes(normalizedQuery)
        : true;
      const statusMatches =
        selectedStatus === "all" ? true : lead.status === selectedStatus;
      const budgetMatches = selectedBudget
        ? lead.budgetBand?.trim() === selectedBudget
        : true;
      return queryMatches && statusMatches && budgetMatches;
    })
    .map((lead) => ({
      budgetBand: lead.budgetBand,
      company: lead.company,
      createdAt: lead.createdAt,
      email: lead.email,
      id: lead.id,
      name: lead.name,
      servicesInterest: lead.servicesInterest,
      status: lead.status,
    }));

  return {
    budgets,
    filteredCount: leads.length,
    leads,
    newCount: allLeads.filter((lead) => lead.status === "new").length,
    query,
    selectedBudget,
    selectedStatus,
    statuses,
    totalCount: allLeads.length,
  };
}
