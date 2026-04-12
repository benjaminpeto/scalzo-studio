import { connection } from "next/server";

import { getAdminOverviewDashboardData } from "@/actions/admin/analytics/get-admin-overview-dashboard-data";
import { AdminOverviewDashboard } from "@/components/admin/dashboard";
import type { AdminOverviewSearchParams } from "@/interfaces/admin/overview-dashboard";

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<AdminOverviewSearchParams>;
}) {
  await connection();

  const resolvedSearchParams = (await searchParams) ?? {};
  const data = await getAdminOverviewDashboardData(resolvedSearchParams);

  return <AdminOverviewDashboard data={data} />;
}
