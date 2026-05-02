"use server";

import "server-only";

import {
  fallbackServiceDetailBySlug,
  fallbackServicesIndexEntries,
} from "@/constants/services/content";
import type { ServicesFaqItem } from "@/interfaces/services/content";
import { resolveCmsImageAssetMap } from "@/lib/media-assets/server";
import type { Locale } from "@/lib/i18n/routing";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  buildFallbackRelatedWork,
  buildGenericServiceFaq,
  buildGenericServiceTimeline,
  extractProblemFromContent,
} from "./helpers";

export async function getServiceDetailPageData(
  slug: string,
  locale: Locale = "en",
) {
  const isEs = locale === "es";
  const supabase = await createServerSupabaseClient();
  const { data: service, error } = await supabase
    .from("services")
    .select(
      "content_md, content_md_es, deliverables, seo_description, seo_description_es, seo_title, seo_title_es, slug, summary, summary_es, title, title_es, updated_at",
    )
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();

  const fallbackService =
    fallbackServicesIndexEntries.find((entry) => entry.slug === slug) ?? null;

  if ((error || !service) && !fallbackService) {
    return null;
  }

  const resolvedTitle =
    (isEs ? service?.title_es || service?.title : service?.title) ??
    fallbackService?.title ??
    "Service";
  const resolvedSummary =
    (isEs ? service?.summary_es || service?.summary : service?.summary) ??
    fallbackService?.summary ??
    "";
  const serviceFallback =
    fallbackServiceDetailBySlug[slug] ??
    ({
      faq: buildGenericServiceFaq(resolvedTitle),
      problem: `This service exists to make ${resolvedTitle.toLowerCase()} more commercially effective, easier to understand, and easier to trust.`,
      timeline: buildGenericServiceTimeline(resolvedTitle),
    } satisfies {
      faq: readonly ServicesFaqItem[];
      problem: string;
      timeline: ReturnType<typeof buildGenericServiceTimeline>;
    });

  const { data: relatedCaseStudies } = await supabase
    .from("case_studies")
    .select("cover_image_url, industry, outcomes, services, title")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(2);

  const relatedWork = relatedCaseStudies?.length
    ? await (async () => {
        const imageAssets = await resolveCmsImageAssetMap(
          relatedCaseStudies.map((item) => ({
            fallbackAlt: `Related work cover for ${item.title}`,
            url: item.cover_image_url,
          })),
        );

        return relatedCaseStudies.map((item) => ({
          description:
            item.outcomes ??
            "Published case study showing how strategic clarity translates into a stronger page or launch outcome.",
          image: (item.cover_image_url
            ? imageAssets[item.cover_image_url]
            : undefined) ?? {
            alt: `Related work cover for ${item.title}`,
            height: 1200,
            src: "/placeholders/hero-editorial.svg",
            width: 1600,
          },
          metadata:
            item.industry ?? item.services?.[0] ?? "Selected case study",
          outcome: item.services?.[0] ?? "Related studio work",
          title: item.title,
        }));
      })()
    : buildFallbackRelatedWork();

  const resolvedContent = isEs
    ? ((service?.content_md_es || service?.content_md) ?? null)
    : (service?.content_md ?? null);

  return {
    content: resolvedContent,
    deliverables: service?.deliverables?.length
      ? service.deliverables
      : [...(fallbackService?.deliverables ?? [])],
    faq: serviceFallback.faq,
    outcome:
      fallbackService?.outcome ??
      "Designed to make the offer easier to understand and easier to trust.",
    problem: extractProblemFromContent(
      resolvedContent,
      serviceFallback.problem,
    ),
    relatedWork,
    seoDescription: isEs
      ? ((service?.seo_description_es || service?.seo_description) ?? null)
      : (service?.seo_description ?? null),
    seoTitle: isEs
      ? ((service?.seo_title_es || service?.seo_title) ?? null)
      : (service?.seo_title ?? null),
    slug,
    summary: resolvedSummary,
    timeline: serviceFallback.timeline,
    title: resolvedTitle,
    updatedAt: service?.updated_at ?? null,
  };
}
