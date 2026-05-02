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
      "content_md, content_md_es, cover_image_url, excerpt, excerpt_es, id, published, published_at, seo_description, seo_description_es, seo_title, seo_title_es, slug, tags, title, title_es, updated_at",
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
    contentMdEs: data.content_md_es ?? "",
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
    excerptEs: data.excerpt_es ?? "",
    id: data.id,
    published: data.published,
    publishedAt: data.published_at,
    seoDescription: data.seo_description ?? "",
    seoDescriptionEs: data.seo_description_es ?? "",
    seoTitle: data.seo_title ?? "",
    seoTitleEs: data.seo_title_es ?? "",
    slug: data.slug,
    tags: data.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [],
    title: data.title,
    titleEs: data.title_es ?? "",
    updatedAt: data.updated_at,
  };
}
