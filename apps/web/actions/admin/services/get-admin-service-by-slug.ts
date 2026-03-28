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
      "content_md, deliverables, id, order_index, published, seo_description, seo_title, slug, summary, title, updated_at",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    contentMd: data.content_md ?? "",
    deliverables: data.deliverables ?? [],
    id: data.id,
    orderIndex: data.order_index,
    published: data.published,
    seoDescription: data.seo_description ?? "",
    seoTitle: data.seo_title ?? "",
    slug: data.slug,
    summary: data.summary ?? "",
    title: data.title,
    updatedAt: data.updated_at,
  };
}
