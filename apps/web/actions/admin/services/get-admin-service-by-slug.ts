"use server";

import "server-only";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type { AdminServiceEditorRecord } from "@/interfaces/admin/service-editor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAdminServiceBySlug(
  slug: string,
): Promise<AdminServiceEditorRecord | null> {
  await requireCurrentAdminAccess(`/admin/services/${slug}`);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("services")
    .select(
      "content_md, content_md_es, deliverables, id, order_index, published, seo_description, seo_description_es, seo_title, seo_title_es, slug, summary, summary_es, title, title_es, updated_at",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    contentMd: data.content_md ?? "",
    contentMdEs: data.content_md_es ?? "",
    deliverables: data.deliverables ?? [],
    id: data.id,
    orderIndex: data.order_index,
    published: data.published,
    seoDescription: data.seo_description ?? "",
    seoDescriptionEs: data.seo_description_es ?? "",
    seoTitle: data.seo_title ?? "",
    seoTitleEs: data.seo_title_es ?? "",
    slug: data.slug,
    summary: data.summary ?? "",
    summaryEs: data.summary_es ?? "",
    title: data.title,
    titleEs: data.title_es ?? "",
    updatedAt: data.updated_at,
  };
}
