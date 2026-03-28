import { connection } from "next/server";

import { getAdminRedirectsListData } from "@/actions/admin/redirects/get-admin-redirects-list-data";
import { AdminRedirectsList } from "@/components/admin/redirects-list";

export default async function AdminRedirectsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
    status?: string;
    statusCode?: string;
  }>;
}) {
  await connection();

  const resolvedSearchParams = (await searchParams) ?? {};
  const query =
    typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
  const statusCodeFilter =
    typeof resolvedSearchParams.statusCode === "string"
      ? resolvedSearchParams.statusCode
      : "all";
  const status =
    typeof resolvedSearchParams.status === "string"
      ? resolvedSearchParams.status
      : undefined;
  const data = await getAdminRedirectsListData({
    query,
    statusCodeFilter,
  });

  return <AdminRedirectsList data={data} status={status} />;
}
