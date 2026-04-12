import { notFound } from "next/navigation";
import { connection } from "next/server";

import { getAdminLeadById } from "@/actions/admin/leads/get-admin-lead-by-id";
import { updateAdminLead } from "@/actions/admin/leads/update-admin-lead";
import { AdminLeadEditor } from "@/components/admin/lead-editor";

export default async function AdminLeadDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ status?: string }>;
}) {
  await connection();

  const { id } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const status =
    typeof resolvedSearchParams.status === "string"
      ? resolvedSearchParams.status
      : undefined;

  const lead = await getAdminLeadById(id);

  if (!lead) {
    notFound();
  }

  return (
    <AdminLeadEditor action={updateAdminLead} lead={lead} status={status} />
  );
}
