import "server-only";

import {
  fallbackTestimonials,
  fallbackWorkDetailBySlug,
  fallbackWorkImage,
  fallbackWorkIndexEntries,
} from "@/constants/work/content";
import { createCmsImageAsset } from "@/lib/media-assets/shared";
import type {
  WorkDetailPageData,
  WorkDetailTestimonial,
  WorkDetailVisual,
  WorkIndexEntry,
  WorkOutcomeMetric,
} from "@/interfaces/work/content";
import { titleCaseFromSlug } from "@/lib/content/format";

export function cloneFallbackWorkEntries(): WorkIndexEntry[] {
  return fallbackWorkIndexEntries.map((entry) => ({
    description: entry.description,
    image: entry.image,
    metadata: entry.metadata,
    metric: entry.metric,
    slug: entry.slug,
    title: entry.title,
  }));
}

export function formatMetricLabel(label: string) {
  return label
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function resolveWorkMetric(
  outcomesMetrics: unknown,
  fallbackMetric: string,
) {
  if (typeof outcomesMetrics === "string" && outcomesMetrics.trim()) {
    return outcomesMetrics;
  }

  if (
    outcomesMetrics &&
    typeof outcomesMetrics === "object" &&
    !Array.isArray(outcomesMetrics)
  ) {
    const values = Object.values(outcomesMetrics as Record<string, unknown>);
    const firstStringValue = values.find(
      (value): value is string => typeof value === "string" && Boolean(value),
    );

    if (firstStringValue) {
      return firstStringValue;
    }
  }

  return fallbackMetric;
}

export function resolveWorkMetrics(
  outcomesMetrics: unknown,
  fallbackMetric: string,
): WorkOutcomeMetric[] {
  if (typeof outcomesMetrics === "string" && outcomesMetrics.trim()) {
    return [{ label: "Key outcome", value: outcomesMetrics }];
  }

  if (Array.isArray(outcomesMetrics)) {
    const values = outcomesMetrics.filter(
      (value): value is string => typeof value === "string" && Boolean(value),
    );

    if (values.length) {
      return values.map((value, index) => ({
        label: index === 0 ? "Key outcome" : `Additional signal ${index}`,
        value,
      }));
    }
  }

  if (
    outcomesMetrics &&
    typeof outcomesMetrics === "object" &&
    !Array.isArray(outcomesMetrics)
  ) {
    const metrics = Object.entries(outcomesMetrics as Record<string, unknown>)
      .filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      )
      .map(([label, value]) => ({
        label: formatMetricLabel(label),
        value,
      }));

    if (metrics.length) {
      return metrics;
    }
  }

  return [{ label: "Key outcome", value: fallbackMetric }];
}

export function buildGenericWorkTestimonial(
  title: string,
  clientName: string | null,
): WorkDetailTestimonial {
  const fallbackTestimonial = fallbackTestimonials[0];

  return {
    company: clientName ?? fallbackTestimonial.company,
    name: fallbackTestimonial.name,
    quote: `The direction behind ${title.toLowerCase()} made the business easier to understand earlier and gave the team a stronger first impression to build on.`,
    role: fallbackTestimonial.role,
  };
}

export function buildGenericWorkVisuals(
  title: string,
  leadImage: WorkIndexEntry["image"],
): WorkDetailVisual[] {
  const imagePool = [
    leadImage,
    ...fallbackWorkIndexEntries
      .map((project) => project.image)
      .filter((image) => image.src !== leadImage.src),
  ].slice(0, 3);

  const captions = [
    "Opening screen showing the first-impression hierarchy.",
    "Supporting frame where proof and pacing are made easier to read.",
    "Detail view of the visual system as it starts carrying more authority.",
  ];

  return imagePool.map((image, index) => ({
    ...createCmsImageAsset({
      alt: image.alt || `${title} visual ${index + 1}`,
      blurDataUrl: image.blurDataUrl,
      height: image.height,
      src: image.src,
      width: image.width,
    }),
    caption: captions[index] ?? "Selected project visual.",
  }));
}

export function resolveWorkVisuals(
  title: string,
  coverImage: WorkIndexEntry["image"] | null,
  galleryImages: WorkDetailVisual[] | null,
  fallbackVisuals: readonly WorkDetailVisual[],
): WorkDetailVisual[] {
  const sourceMap = new Map<string, WorkDetailVisual>();

  for (const image of [coverImage, ...(galleryImages ?? [])]) {
    if (!image) {
      continue;
    }

    sourceMap.set(image.src, {
      ...image,
      alt: image.alt || title,
      caption:
        (image as Partial<WorkDetailVisual>).caption ??
        "Selected project visual.",
    });
  }

  const sources = Array.from(sourceMap.values()).slice(0, 3);

  if (!sources.length) {
    return [...fallbackVisuals];
  }

  const captions = [
    "Primary case-study view used to anchor the page narrative.",
    "Supporting visual showing how the system behaves beyond the hero state.",
    "Closer detail of the page language and visual rhythm in context.",
  ];

  return sources.map((image, index) => ({
    ...image,
    alt: image.alt || `${title} visual ${index + 1}`,
    caption: captions[index] ?? "Selected project visual.",
  }));
}

export function buildGenericWorkDetailData({
  description,
  image,
  metric,
  slug,
  title,
}: WorkIndexEntry): WorkDetailPageData {
  return {
    approach: `The work focused on restructuring ${title.toLowerCase()} so the offer, the proof, and the next step were easier to understand in the first impression.`,
    challenge: `The underlying business had more value than the page was currently communicating. ${title} needed clearer hierarchy, stronger signals, and a calmer path toward action.`,
    clientName: null,
    description,
    image,
    industry: null,
    metadata: "Selected case study",
    metric,
    metrics: [{ label: "Key outcome", value: metric }],
    outcomes:
      description ||
      "The final direction made the page easier to trust, easier to scan, and more commercially useful once live.",
    published: true,
    publishedAt: null,
    seoDescription: null,
    seoTitle: null,
    services: ["Positioning", "Design direction", "Commercial clarity"],
    slug,
    testimonial: buildGenericWorkTestimonial(title, null),
    title,
    updatedAt: null,
    visuals: buildGenericWorkVisuals(title, image),
  };
}

export function getFallbackWorkDetailPageData(
  slug: string,
): WorkDetailPageData {
  const fallbackIndexEntry =
    fallbackWorkIndexEntries.find((entry) => entry.slug === slug) ??
    ({
      description:
        "Published case study showing how stronger hierarchy and clearer positioning change the quality of the first impression.",
      image: fallbackWorkImage,
      metadata: "Selected case study",
      metric: "Published case study",
      slug,
      title: titleCaseFromSlug(slug),
    } satisfies WorkIndexEntry);

  const fallbackDetail = fallbackWorkDetailBySlug[slug];
  const genericFallback = buildGenericWorkDetailData(fallbackIndexEntry);

  return {
    approach: fallbackDetail?.approach ?? genericFallback.approach,
    challenge: fallbackDetail?.challenge ?? genericFallback.challenge,
    clientName: fallbackDetail?.clientName ?? genericFallback.clientName,
    description: fallbackIndexEntry.description,
    image: fallbackIndexEntry.image,
    industry: fallbackDetail?.industry ?? genericFallback.industry,
    metadata: fallbackDetail?.industry ?? fallbackIndexEntry.metadata,
    metric: fallbackIndexEntry.metric,
    metrics: [{ label: "Key outcome", value: fallbackIndexEntry.metric }],
    outcomes: fallbackDetail?.outcomes ?? genericFallback.outcomes,
    published: true,
    publishedAt: null,
    seoDescription: null,
    seoTitle: null,
    services: fallbackDetail?.services ?? genericFallback.services,
    slug: fallbackIndexEntry.slug,
    testimonial: fallbackDetail?.testimonial ?? genericFallback.testimonial,
    title: fallbackIndexEntry.title,
    updatedAt: null,
    visuals: buildGenericWorkVisuals(
      fallbackIndexEntry.title,
      fallbackIndexEntry.image,
    ),
  };
}
