import { connection } from "next/server";

import { createAdminInsight } from "@/actions/admin/insights/create-admin-insight";
import { uploadAdminInsightContentImage } from "@/actions/admin/insights/upload-admin-insight-content-image";
import { AdminInsightEditor } from "@/components/admin/insight-editor";

export default async function AdminInsightNewPage() {
  await connection();

  return (
    <AdminInsightEditor
      action={createAdminInsight}
      mediaAction={uploadAdminInsightContentImage}
      mode="create"
    />
  );
}
