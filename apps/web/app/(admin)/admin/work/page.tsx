import { connection } from "next/server";

import { getAdminCaseStudiesListData } from "@/actions/admin/work/server";
import { AdminWorkList } from "@/components/admin/work-list";

export default async function AdminWorkPage({
  searchParams,
}: {
  searchParams?: Promise<{
    industry?: string;
    published?: string;
    status?: string;
  }>;
}) {
  await connection();

  const resolvedSearchParams = (await searchParams) ?? {};
  const industry =
    typeof resolvedSearchParams.industry === "string"
      ? resolvedSearchParams.industry
      : "";
  const publishedFilter =
    typeof resolvedSearchParams.published === "string"
      ? resolvedSearchParams.published
      : "all";
  const status =
    typeof resolvedSearchParams.status === "string"
      ? resolvedSearchParams.status
      : undefined;
  const data = await getAdminCaseStudiesListData({
    industry,
    publishedFilter,
  });

  return <AdminWorkList data={data} status={status} />;
}
