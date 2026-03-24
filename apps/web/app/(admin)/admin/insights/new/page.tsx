import { connection } from "next/server";

import {
  createAdminInsight,
  uploadAdminInsightContentImage,
} from "@/actions/admin/insights/server";
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
