import { connection } from "next/server";

import { createAdminCaseStudy } from "@/actions/admin/work/create-admin-case-study";
import { AdminWorkEditor } from "@/components/admin/work-editor";

export default async function AdminWorkNewPage() {
  await connection();

  return <AdminWorkEditor action={createAdminCaseStudy} mode="create" />;
}
