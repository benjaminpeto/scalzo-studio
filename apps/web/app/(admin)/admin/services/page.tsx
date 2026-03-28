import { connection } from "next/server";

import { getAdminServicesListData } from "@/actions/admin/services/get-admin-services-list-data";
import { AdminServicesList } from "@/components/admin/services-list";

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams?: Promise<{
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
      : undefined;
  const data = await getAdminServicesListData(query);

  return <AdminServicesList data={data} status={status} />;
}
