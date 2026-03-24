import { connection } from "next/server";

import { createAdminService } from "@/actions/admin/services/server";
import { AdminServiceEditor } from "@/components/admin/service-editor";

export default async function AdminServiceNewPage() {
  await connection();

  return <AdminServiceEditor action={createAdminService} mode="create" />;
}
