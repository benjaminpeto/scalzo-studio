"use server";

import "server-only";

import {
  fallbackWorkDetailBySlug,
  fallbackWorkImage,
  fallbackWorkIndexEntries,
} from "@/constants/work/content";
import { titleCaseFromSlug } from "@/lib/content/format";
import type { Locale } from "@/lib/i18n/routing";
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
    locale?: Locale;
  },
) {
  const isEs = options?.locale === "es";
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("case_studies")
    .select(
      "approach, approach_es, challenge, challenge_es, client_name, cover_image_url, gallery_urls, industry, outcomes, outcomes_es, outcomes_metrics, published, published_at, seo_description, seo_description_es, seo_title, seo_title_es, services, slug, title, title_es, updated_at",
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
    (isEs ? caseStudy?.title_es || caseStudy?.title : caseStudy?.title) ??
    fallbackIndexEntry?.title ??
    titleCaseFromSlug(slug);
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

  const resolvedApproach = isEs
    ? caseStudy?.approach_es || caseStudy?.approach
    : caseStudy?.approach;
  const resolvedChallenge = isEs
    ? caseStudy?.challenge_es || caseStudy?.challenge
    : caseStudy?.challenge;
  const resolvedOutcomes = isEs
    ? caseStudy?.outcomes_es || caseStudy?.outcomes
    : caseStudy?.outcomes;

  return {
    approach:
      resolvedApproach ?? fallbackDetail?.approach ?? genericFallback.approach,
    challenge:
      resolvedChallenge ??
      fallbackDetail?.challenge ??
      genericFallback.challenge,
    clientName: resolvedClientName,
    description:
      resolvedOutcomes ??
      fallbackIndexEntry?.description ??
      genericFallback.description,
    image: resolvedImage,
    industry: caseStudy?.industry ?? fallbackDetail?.industry ?? null,
    metadata: resolvedMetadata,
    metric: resolvedMetric,
    metrics: resolveWorkMetrics(caseStudy?.outcomes_metrics, resolvedMetric),
    outcomes:
      resolvedOutcomes ?? fallbackDetail?.outcomes ?? genericFallback.outcomes,
    published: caseStudy?.published ?? genericFallback.published,
    seoDescription: isEs
      ? ((caseStudy?.seo_description_es || caseStudy?.seo_description) ?? null)
      : (caseStudy?.seo_description ?? null),
    seoTitle: isEs
      ? ((caseStudy?.seo_title_es || caseStudy?.seo_title) ?? null)
      : (caseStudy?.seo_title ?? null),
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
