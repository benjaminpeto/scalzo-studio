import { notFound } from "next/navigation";
import { connection } from "next/server";

import {
  getAdminCaseStudyBySlug,
  updateAdminCaseStudy,
} from "@/actions/admin/work/server";
import { AdminWorkEditor } from "@/components/admin/work-editor";

export default async function AdminWorkEditorPage({
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
  const caseStudy = await getAdminCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <AdminWorkEditor
      action={updateAdminCaseStudy}
      caseStudy={caseStudy}
      status={status}
    />
  );
}
