import { redirect } from "next/navigation";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { buildWorkReturnPath, revalidateWorkRoutes } from "./helpers";
import { publishActionSchema } from "./schemas";

export async function toggleAdminCaseStudyPublished(formData: FormData) {
  "use server";

  await requireCurrentAdminAccess("/admin/work");

  const parsedInput = publishActionSchema.safeParse({
    caseStudyId: formData.get("caseStudyId"),
    currentPublished: formData.get("currentPublished"),
    industryFilter: formData.get("industryFilter"),
    publishedFilter: formData.get("publishedFilter"),
    slug: formData.get("slug"),
  });

  if (!parsedInput.success) {
    redirect(buildWorkReturnPath({ status: "invalid-action" }));
  }

  const {
    caseStudyId,
    currentPublished,
    industryFilter,
    publishedFilter,
    slug,
  } = parsedInput.data;
  const nextPublished = currentPublished !== "true";
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("case_studies")
    .update({
      published: nextPublished,
      published_at: nextPublished ? new Date().toISOString() : null,
    })
    .eq("id", caseStudyId);

  if (error) {
    redirect(
      buildWorkReturnPath({
        industry: industryFilter,
        publishedFilter,
        status: "update-error",
      }),
    );
  }

  revalidateWorkRoutes(slug);

  redirect(
    buildWorkReturnPath({
      industry: industryFilter,
      publishedFilter,
      status: "publish-updated",
    }),
  );
}
