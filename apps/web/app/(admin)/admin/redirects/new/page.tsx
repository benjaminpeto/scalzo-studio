import { connection } from "next/server";

import { createAdminRedirect } from "@/actions/admin/redirects/create-admin-redirect";
import { AdminRedirectEditor } from "@/components/admin/redirect-editor";

export default async function AdminRedirectNewPage() {
  await connection();

  return (
    <AdminRedirectEditor
      action={createAdminRedirect}
      deleteAction={null}
      mode="create"
    />
  );
}
