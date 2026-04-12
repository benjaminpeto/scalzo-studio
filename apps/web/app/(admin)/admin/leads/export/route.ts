import { type NextRequest, NextResponse } from "next/server";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function escapeCSVField(value: string | null | undefined): string {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  await requireCurrentAdminAccess("/admin/leads/export");

  const { searchParams } = request.nextUrl;
  const rawQuery = searchParams.get("q") ?? "";
  const selectedStatus = searchParams.get("status") ?? "all";
  const selectedBudget = searchParams.get("budget") ?? "";

  const query = rawQuery.trim().toLowerCase();

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("leads")
    .select(
      "budget_band, company, created_at, email, name, services_interest, status",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Could not load leads." },
      { status: 500 },
    );
  }

  const filtered = (data ?? []).filter((lead) => {
    const searchText = [lead.name ?? "", lead.email ?? "", lead.company ?? ""]
      .join(" ")
      .toLowerCase();
    const queryMatches = query ? searchText.includes(query) : true;
    const statusMatches =
      selectedStatus === "all" ? true : lead.status === selectedStatus;
    const budgetMatches = selectedBudget
      ? lead.budget_band?.trim() === selectedBudget
      : true;
    return queryMatches && statusMatches && budgetMatches;
  });

  const header = [
    "Date received",
    "Name",
    "Email",
    "Company",
    "Budget",
    "Interests",
    "Status",
  ].join(",");

  const rows = filtered.map((lead) => {
    const date = lead.created_at
      ? new Date(lead.created_at).toISOString().slice(0, 10)
      : "";
    return [
      escapeCSVField(date),
      escapeCSVField(lead.name),
      escapeCSVField(lead.email),
      escapeCSVField(lead.company),
      escapeCSVField(lead.budget_band),
      escapeCSVField((lead.services_interest ?? []).join("; ")),
      escapeCSVField(lead.status),
    ].join(",");
  });

  const csv = [header, ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Disposition": "attachment; filename=leads.csv",
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}
