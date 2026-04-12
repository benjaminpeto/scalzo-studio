"use server";

import "server-only";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type { AdminInsightEditorRecord } from "@/interfaces/admin/insight-editor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAdminInsightBySlug(
  slug: string,
): Promise<AdminInsightEditorRecord | null> {
  await requireCurrentAdminAccess(`/admin/insights/${slug}`);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "content_md, cover_image_url, excerpt, id, published, published_at, seo_description, seo_title, slug, tags, title, updated_at",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    contentMd: data.content_md,
    coverImageUrl: data.cover_image_url,
    excerpt: data.excerpt ?? "",
    id: data.id,
    published: data.published,
    publishedAt: data.published_at,
    seoDescription: data.seo_description ?? "",
    seoTitle: data.seo_title ?? "",
    slug: data.slug,
    tags: data.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [],
    title: data.title,
    updatedAt: data.updated_at,
  };
}
