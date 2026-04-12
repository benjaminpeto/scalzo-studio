import { connection } from "next/server";

import { getAdminLeadsListData } from "@/actions/admin/leads/get-admin-leads-list-data";
import { AdminLeadsList } from "@/components/admin/leads-list";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    budget?: string;
    q?: string;
    status?: string;
  }>;
}) {
  await connection();

  const resolvedSearchParams = (await searchParams) ?? {};
  const query =
    typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
  const status =
    typeof resolvedSearchParams.status === "string"
      ? resolvedSearchParams.status
      : "all";
  const budget =
    typeof resolvedSearchParams.budget === "string"
      ? resolvedSearchParams.budget
      : "";

  const data = await getAdminLeadsListData({ budget, query, status });

  return <AdminLeadsList data={data} />;
}
