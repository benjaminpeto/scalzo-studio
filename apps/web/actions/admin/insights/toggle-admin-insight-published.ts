"use server";

import { redirect } from "next/navigation";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { buildInsightsReturnPath, revalidateInsightRoutes } from "./helpers";
import { publishActionSchema } from "./schemas";

export async function toggleAdminInsightPublished(formData: FormData) {
  await requireCurrentAdminAccess("/admin/insights");

  const parsedInput = publishActionSchema.safeParse({
    currentPublished: formData.get("currentPublished"),
    currentPublishedAt: formData.get("currentPublishedAt"),
    postId: formData.get("postId"),
    publishedFilter: formData.get("publishedFilter"),
    slug: formData.get("slug"),
    tagFilter: formData.get("tagFilter"),
  });

  if (!parsedInput.success) {
    redirect(buildInsightsReturnPath({ status: "invalid-action" }));
  }

  const {
    currentPublished,
    currentPublishedAt,
    postId,
    publishedFilter,
    slug,
    tagFilter,
  } = parsedInput.data;
  const nextPublished = currentPublished !== "true";
  const nextPublishedAt = nextPublished
    ? currentPublishedAt || new Date().toISOString()
    : null;
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("posts")
    .update({
      published: nextPublished,
      published_at: nextPublishedAt,
    })
    .eq("id", postId);

  if (error) {
    redirect(
      buildInsightsReturnPath({
        publishedFilter,
        status: "update-error",
        tag: tagFilter,
      }),
    );
  }

  revalidateInsightRoutes(slug);

  redirect(
    buildInsightsReturnPath({
      publishedFilter,
      status: "publish-updated",
      tag: tagFilter,
    }),
  );
}
