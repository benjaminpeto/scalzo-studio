import { connection } from "next/server";

import { getAdminInsightsListData } from "@/actions/admin/insights/server";
import { AdminInsightsList } from "@/components/admin/insights-list";

export default async function AdminInsightsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    published?: string;
    status?: string;
    tag?: string;
  }>;
}) {
  await connection();

  const resolvedSearchParams = (await searchParams) ?? {};
  const publishedFilter =
    typeof resolvedSearchParams.published === "string"
      ? resolvedSearchParams.published
      : "all";
  const status =
    typeof resolvedSearchParams.status === "string"
      ? resolvedSearchParams.status
      : undefined;
  const tag =
    typeof resolvedSearchParams.tag === "string"
      ? resolvedSearchParams.tag
      : "";
  const data = await getAdminInsightsListData({
    publishedFilter,
    tag,
  });

  return <AdminInsightsList data={data} status={status} />;
}
