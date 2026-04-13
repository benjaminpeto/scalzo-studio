"use server";

import "server-only";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type { AdminInsightEditorRecord } from "@/interfaces/admin/insight-editor";
import { getMediaAssetRecordMap } from "@/lib/media-assets/server";
import { createCmsImageAsset } from "@/lib/media-assets/shared";
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

  const imageAssets = await getMediaAssetRecordMap(
    data.cover_image_url ? [data.cover_image_url] : [],
  );

  return {
    contentMd: data.content_md,
    coverImage: data.cover_image_url
      ? (() => {
          const image = imageAssets.get(data.cover_image_url);

          return createCmsImageAsset({
            alt: image?.alt_text ?? "",
            blurDataUrl: image?.blur_data_url,
            height: image?.height,
            src: data.cover_image_url,
            width: image?.width,
          });
        })()
      : null,
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
