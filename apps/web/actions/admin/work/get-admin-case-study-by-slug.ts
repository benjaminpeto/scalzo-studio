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
      "approach, approach_es, challenge, challenge_es, client_name, cover_image_url, gallery_urls, id, industry, outcomes, outcomes_es, outcomes_metrics, published, published_at, seo_description, seo_description_es, seo_title, seo_title_es, services, slug, title, title_es, updated_at",
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
    approachEs: data.approach_es ?? "",
    challenge: data.challenge ?? "",
    challengeEs: data.challenge_es ?? "",
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
    outcomesEs: data.outcomes_es ?? "",
    published: data.published,
    publishedAt: data.published_at,
    seoDescription: data.seo_description ?? "",
    seoDescriptionEs: data.seo_description_es ?? "",
    seoTitle: data.seo_title ?? "",
    seoTitleEs: data.seo_title_es ?? "",
    services: data.services ?? [],
    slug: data.slug,
    title: data.title,
    titleEs: data.title_es ?? "",
    updatedAt: data.updated_at,
  };
}
