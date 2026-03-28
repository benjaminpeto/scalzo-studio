import { notFound } from "next/navigation";
import { connection } from "next/server";

import { getAdminInsightBySlug } from "@/actions/admin/insights/get-admin-insight-by-slug";
import { updateAdminInsight } from "@/actions/admin/insights/update-admin-insight";
import { uploadAdminInsightContentImage } from "@/actions/admin/insights/upload-admin-insight-content-image";
import { AdminInsightEditor } from "@/components/admin/insight-editor";

export default async function AdminInsightEditorPage({
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
  const post = await getAdminInsightBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <AdminInsightEditor
      action={updateAdminInsight}
      mediaAction={uploadAdminInsightContentImage}
      mode="edit"
      post={post}
      status={status}
    />
  );
}
