import { notFound } from "next/navigation";
import { connection } from "next/server";

import { deleteAdminRedirect } from "@/actions/admin/redirects/delete-admin-redirect";
import { getAdminRedirectById } from "@/actions/admin/redirects/get-admin-redirect-by-id";
import { updateAdminRedirect } from "@/actions/admin/redirects/update-admin-redirect";
import { AdminRedirectEditor } from "@/components/admin/redirect-editor";

export default async function AdminRedirectEditorPage({
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
  const redirectRecord = await getAdminRedirectById(id);

  if (!redirectRecord) {
    notFound();
  }

  return (
    <AdminRedirectEditor
      action={updateAdminRedirect}
      deleteAction={deleteAdminRedirect}
      mode="edit"
      redirectRecord={redirectRecord}
      status={status}
    />
  );
}
