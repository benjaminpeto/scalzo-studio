import { notFound } from "next/navigation";
import { connection } from "next/server";

import { getAdminServiceBySlug } from "@/actions/admin/services/get-admin-service-by-slug";
import { updateAdminService } from "@/actions/admin/services/update-admin-service";
import { AdminServiceEditor } from "@/components/admin/service-editor";

export default async function AdminServiceEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ status?: string }>;
}) {
  await connection();

  const { slug } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const status =
    typeof resolvedSearchParams.status === "string"
      ? resolvedSearchParams.status
      : undefined;
  const service = await getAdminServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <AdminServiceEditor
      action={updateAdminService}
      mode="edit"
      service={service}
      status={status}
    />
  );
}
