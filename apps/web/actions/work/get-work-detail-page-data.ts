"use server";

import "server-only";

import {
  fallbackWorkDetailBySlug,
  fallbackWorkImage,
  fallbackWorkIndexEntries,
} from "@/constants/work/content";
import { titleCaseFromSlug } from "@/lib/content/format";
import { resolveCmsImageAssetMap } from "@/lib/media-assets/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  buildGenericWorkDetailData,
  resolveWorkMetric,
  resolveWorkMetrics,
  resolveWorkVisuals,
} from "./helpers";

export async function getWorkDetailPageData(
  slug: string,
  options?: {
    includeDraft?: boolean;
  },
) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("case_studies")
    .select(
      "approach, challenge, client_name, cover_image_url, gallery_urls, industry, outcomes, outcomes_metrics, published, published_at, seo_description, seo_title, services, slug, title, updated_at",
    )
    .eq("slug", slug);

  if (!options?.includeDraft) {
    query = query.eq("published", true);
  }

  const { data: caseStudy, error } = await query.maybeSingle();

  const fallbackDetail = fallbackWorkDetailBySlug[slug];
  const fallbackIndexEntry =
    fallbackWorkIndexEntries.find((entry) => entry.slug === slug) ?? null;

  if ((error || !caseStudy) && !fallbackIndexEntry) {
    return null;
  }

  const resolvedTitle =
    caseStudy?.title ?? fallbackIndexEntry?.title ?? titleCaseFromSlug(slug);
  const imageAssets = await resolveCmsImageAssetMap([
    {
      fallbackAlt:
        fallbackIndexEntry?.image.alt ??
        `Case study cover for ${resolvedTitle}`,
      url: caseStudy?.cover_image_url,
    },
    ...((caseStudy?.gallery_urls ?? []).map((url, index) => ({
      fallbackAlt: `Case study gallery image ${index + 1} for ${resolvedTitle}`,
      url,
    })) ?? []),
  ]);
  const resolvedImage =
    (caseStudy?.cover_image_url
      ? imageAssets[caseStudy.cover_image_url]
      : undefined) ??
    fallbackIndexEntry?.image ??
    fallbackWorkImage;
  const resolvedMetric = resolveWorkMetric(
    caseStudy?.outcomes_metrics,
    fallbackIndexEntry?.metric ?? "Published case study",
  );
  const genericFallback = buildGenericWorkDetailData({
    description:
      fallbackIndexEntry?.description ??
      "Published case study showing how strategy and design direction translate into a stronger commercial result.",
    image: resolvedImage,
    metadata: fallbackIndexEntry?.metadata ?? "Selected case study",
    metric: resolvedMetric,
    slug,
    title: resolvedTitle,
  });

  const resolvedClientName =
    caseStudy?.client_name ?? fallbackDetail?.clientName ?? null;
  const resolvedServices = caseStudy?.services?.length
    ? caseStudy.services
    : (fallbackDetail?.services ?? genericFallback.services);
  const resolvedMetadata =
    caseStudy?.industry ||
    (resolvedServices.length
      ? resolvedServices.join(" / ")
      : (fallbackIndexEntry?.metadata ?? genericFallback.metadata));

  return {
    approach:
      caseStudy?.approach ??
      fallbackDetail?.approach ??
      genericFallback.approach,
    challenge:
      caseStudy?.challenge ??
      fallbackDetail?.challenge ??
      genericFallback.challenge,
    clientName: resolvedClientName,
    description:
      caseStudy?.outcomes ??
      fallbackIndexEntry?.description ??
      genericFallback.description,
    image: resolvedImage,
    industry: caseStudy?.industry ?? fallbackDetail?.industry ?? null,
    metadata: resolvedMetadata,
    metric: resolvedMetric,
    metrics: resolveWorkMetrics(caseStudy?.outcomes_metrics, resolvedMetric),
    outcomes:
      caseStudy?.outcomes ??
      fallbackDetail?.outcomes ??
      genericFallback.outcomes,
    published: caseStudy?.published ?? genericFallback.published,
    seoDescription: caseStudy?.seo_description ?? null,
    seoTitle: caseStudy?.seo_title ?? null,
    services: resolvedServices,
    slug,
    testimonial: fallbackDetail?.testimonial ?? genericFallback.testimonial,
    title: resolvedTitle,
    publishedAt: caseStudy?.published_at ?? null,
    updatedAt: caseStudy?.updated_at ?? caseStudy?.published_at ?? null,
    visuals: resolveWorkVisuals(
      resolvedTitle,
      caseStudy?.cover_image_url
        ? imageAssets[caseStudy.cover_image_url]
        : null,
      (caseStudy?.gallery_urls ?? [])
        .map((url) => imageAssets[url])
        .filter(Boolean)
        .map((image) => ({
          ...image,
          caption: "Selected project visual.",
        })),
      genericFallback.visuals,
    ),
  };
}
