import { connection } from "next/server";

import { AdminServicesList } from "@/components/admin/services-list";
import { getAdminServicesListData } from "@/actions/admin/services/server";

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
