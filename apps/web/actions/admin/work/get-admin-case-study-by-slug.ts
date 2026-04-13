"use server";

import "server-only";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type { AdminCaseStudyEditorRecord } from "@/interfaces/admin/work-editor";
import { getMediaAssetRecordMap } from "@/lib/media-assets/server";
import { createCmsImageAsset } from "@/lib/media-assets/shared";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { buildEditorMetricsRows } from "./helpers";

export async function getAdminCaseStudyBySlug(
  slug: string,
): Promise<AdminCaseStudyEditorRecord | null> {
  await requireCurrentAdminAccess(`/admin/work/${slug}`);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select(
      "approach, challenge, client_name, cover_image_url, gallery_urls, id, industry, outcomes, outcomes_metrics, published, published_at, seo_description, seo_title, services, slug, title, updated_at",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const imageAssets = await getMediaAssetRecordMap([
    ...(data.cover_image_url ? [data.cover_image_url] : []),
    ...(data.gallery_urls ?? []),
  ]);

  return {
    approach: data.approach ?? "",
    challenge: data.challenge ?? "",
    clientName: data.client_name ?? "",
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
    galleryImages: (data.gallery_urls ?? []).map((url) => {
      const image = imageAssets.get(url);

      return createCmsImageAsset({
        alt: image?.alt_text ?? "",
        blurDataUrl: image?.blur_data_url,
        height: image?.height,
        src: url,
        width: image?.width,
      });
    }),
    id: data.id,
    industry: data.industry ?? "",
    metrics: buildEditorMetricsRows(data.outcomes_metrics),
    outcomes: data.outcomes ?? "",
    published: data.published,
    publishedAt: data.published_at,
    seoDescription: data.seo_description ?? "",
    seoTitle: data.seo_title ?? "",
    services: data.services ?? [],
    slug: data.slug,
    title: data.title,
    updatedAt: data.updated_at,
  };
}
