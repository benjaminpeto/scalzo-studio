import "server-only";

import {
  featuredProjects as fallbackFeaturedProjects,
  testimonials as fallbackTestimonials,
} from "@/components/home/content";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface WorkIndexEntry {
  description: string;
  image: string;
  metadata: string;
  metric: string;
  slug: string;
  title: string;
}

export interface WorkOutcomeMetric {
  label: string;
  value: string;
}

export interface WorkDetailVisual {
  alt: string;
  caption: string;
  src: string;
}

export interface WorkDetailTestimonial {
  company: string;
  name: string;
  quote: string;
  role: string;
}

export interface WorkDetailPageData extends WorkIndexEntry {
  approach: string;
  challenge: string;
  clientName: string | null;
  industry: string | null;
  outcomes: string;
  metrics: readonly WorkOutcomeMetric[];
  published: boolean;
  seoDescription: string | null;
  seoTitle: string | null;
  services: readonly string[];
  testimonial: WorkDetailTestimonial;
  visuals: readonly WorkDetailVisual[];
}

const fallbackWorkImage = "/placeholders/hero-editorial.svg";

export const fallbackWorkIndexEntries: readonly WorkIndexEntry[] =
  fallbackFeaturedProjects.map((project, index) => ({
    description: project.description,
    image: project.image,
    metadata: `${project.category} / ${project.accent}`,
    metric: project.metric,
    slug: `featured-${index + 1}`,
    title: project.title,
  }));

const fallbackWorkDetailBySlug: Record<
  string,
  {
    approach: string;
    challenge: string;
    clientName: string;
    industry: string;
    outcomes: string;
    services: readonly string[];
    testimonial: WorkDetailTestimonial;
  }
> = {
  "featured-1": {
    approach:
      "The page was rebuilt around the feeling of arrival. Offer hierarchy, imagery, and trust signals were reordered so the premium positioning was visible before the visitor reached practical details.",
    challenge:
      "The business already delivered a high-end stay, but the site still introduced it like a generic booking option. The first impression needed to feel more established and more direct-booking friendly.",
    clientName: "Coastal hospitality brand",
    industry: "Hospitality",
    outcomes:
      "Qualified enquiries increased because the site made the value clearer earlier. The sales conversation started from preference rather than explanation, and direct-booking intent improved alongside trust.",
    services: ["Brand direction", "Website strategy", "Conversion design"],
    testimonial: {
      company: "Coastal hospitality brand",
      name: "Marta R.",
      quote:
        "The site started to feel premium before anyone reached the booking details, which changed the quality of the conversations that followed.",
      role: "Founder",
    },
  },
  "featured-2": {
    approach:
      "The launch surface was simplified around a tighter story, clearer navigation, and calmer product framing. The interface was reset to guide new visitors through understanding before asking them to commit.",
    challenge:
      "The product had momentum internally, but the launch experience leaned too heavily on novelty. The team needed a sharper route from first impression to product understanding.",
    clientName: "Launch-stage product team",
    industry: "Technology",
    outcomes:
      "The MVP could present itself with more confidence, making onboarding simpler and reducing the amount of explanation required in live demos and follow-up conversations.",
    services: ["Product strategy", "Launch design", "UX direction"],
    testimonial: {
      company: "Launch-stage product team",
      name: "Lucia P.",
      quote:
        "The new direction made the product feel more decisive. Prospects understood what mattered faster and the team had a stronger story to stand behind.",
      role: "Brand lead",
    },
  },
  "featured-3": {
    approach:
      "A reusable editorial kit was designed to hold campaign, launch, and content work inside one system. Instead of one-off assets, the business gained repeatable structures for publishing and iteration.",
    challenge:
      "The brand had taste and momentum, but each new launch or campaign required starting from scratch. The missing layer was not more content, but a stronger editorial framework.",
    clientName: "Local premium brand",
    industry: "Retail",
    outcomes:
      "The content operation became faster and more consistent. Campaign production took less coordination, and the visual language became recognisable across launches without feeling templated.",
    services: ["Content systems", "Editorial design", "Campaign support"],
    testimonial: {
      company: "Local premium brand",
      name: "Daniel V.",
      quote:
        "What changed most was consistency. The brand stopped resetting itself every time we had something new to publish.",
      role: "Managing director",
    },
  },
  "featured-4": {
    approach:
      "The homepage was reorganised around proof, pacing, and a clearer CTA sequence. Visual noise was reduced so the service itself could carry more authority in the first scroll.",
    challenge:
      "The business was strong, but the homepage made first-time visitors work too hard to trust it. The offer needed a calmer route from introduction to contact.",
    clientName: "Service-led growth studio",
    industry: "Professional services",
    outcomes:
      "Visitors stayed longer, proof landed sooner, and the homepage started acting like a sales asset rather than a placeholder. The team had a clearer structure for future page decisions too.",
    services: ["Homepage strategy", "Conversion design", "Content direction"],
    testimonial: {
      company: "Service-led growth studio",
      name: "Daniel V.",
      quote:
        "The homepage finally started sounding like the business we were already running behind the scenes.",
      role: "Managing director",
    },
  },
};

function cloneFallbackWorkEntries(): WorkIndexEntry[] {
  return fallbackWorkIndexEntries.map((entry) => ({
    description: entry.description,
    image: entry.image,
    metadata: entry.metadata,
    metric: entry.metric,
    slug: entry.slug,
    title: entry.title,
  }));
}

function titleCaseFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatMetricLabel(label: string) {
  return label
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function resolveWorkMetric(outcomesMetrics: unknown, fallbackMetric: string) {
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

function resolveWorkMetrics(
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

function buildGenericWorkTestimonial(
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

function buildGenericWorkVisuals(
  title: string,
  leadImage: string,
): WorkDetailVisual[] {
  const imagePool = [
    leadImage,
    ...fallbackFeaturedProjects
      .map((project) => project.image)
      .filter((image) => image !== leadImage),
  ].slice(0, 3);

  const captions = [
    "Opening screen showing the first-impression hierarchy.",
    "Supporting frame where proof and pacing are made easier to read.",
    "Detail view of the visual system as it starts carrying more authority.",
  ];

  return imagePool.map((src, index) => ({
    alt: `${title} visual ${index + 1}`,
    caption: captions[index] ?? "Selected project visual.",
    src,
  }));
}

function resolveWorkVisuals(
  title: string,
  coverImageUrl: string | null,
  galleryUrls: string[] | null,
  fallbackVisuals: readonly WorkDetailVisual[],
): WorkDetailVisual[] {
  const sources = Array.from(
    new Set([coverImageUrl, ...(galleryUrls ?? [])].filter(Boolean)),
  ).slice(0, 3) as string[];

  if (!sources.length) {
    return [...fallbackVisuals];
  }

  const captions = [
    "Primary case-study view used to anchor the page narrative.",
    "Supporting visual showing how the system behaves beyond the hero state.",
    "Closer detail of the page language and visual rhythm in context.",
  ];

  return sources.map((src, index) => ({
    alt: `${title} visual ${index + 1}`,
    caption: captions[index] ?? "Selected project visual.",
    src,
  }));
}

function buildGenericWorkDetailData({
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
    seoDescription: null,
    seoTitle: null,
    services: ["Positioning", "Design direction", "Commercial clarity"],
    slug,
    testimonial: buildGenericWorkTestimonial(title, null),
    title,
    visuals: buildGenericWorkVisuals(title, image),
  };
}

export async function getWorkIndexEntries() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select(
      "cover_image_url, industry, outcomes, outcomes_metrics, published_at, services, slug, title, updated_at",
    )
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (error || !data?.length) {
    return cloneFallbackWorkEntries();
  }

  return data.map((entry, index) => ({
    description:
      entry.outcomes ??
      fallbackWorkIndexEntries[index]?.description ??
      "Published case study showing how strategy and design direction translate into a stronger commercial result.",
    image:
      entry.cover_image_url ??
      fallbackWorkIndexEntries[index]?.image ??
      fallbackWorkImage,
    metadata:
      entry.industry ??
      entry.services?.join(" / ") ??
      fallbackWorkIndexEntries[index]?.metadata ??
      "Selected case study",
    metric: resolveWorkMetric(
      entry.outcomes_metrics,
      fallbackWorkIndexEntries[index]?.metric ?? "Published case study",
    ),
    slug: entry.slug,
    title: entry.title,
  }));
}

export async function getWorkDetailPageData(
  slug: string,
  options?: {
    includeDraft?: boolean;
  },
): Promise<WorkDetailPageData | null> {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("case_studies")
    .select(
      "approach, challenge, client_name, cover_image_url, gallery_urls, industry, outcomes, outcomes_metrics, published, seo_description, seo_title, services, slug, title",
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
  const resolvedImage =
    caseStudy?.cover_image_url ??
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
    testimonial:
      fallbackDetail?.testimonial ??
      buildGenericWorkTestimonial(resolvedTitle, resolvedClientName),
    title: resolvedTitle,
    visuals: resolveWorkVisuals(
      resolvedTitle,
      caseStudy?.cover_image_url ?? null,
      caseStudy?.gallery_urls ?? null,
      genericFallback.visuals,
    ),
  } satisfies WorkDetailPageData;
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
    seoDescription: null,
    seoTitle: null,
    services: fallbackDetail?.services ?? genericFallback.services,
    slug: fallbackIndexEntry.slug,
    testimonial: fallbackDetail?.testimonial ?? genericFallback.testimonial,
    title: fallbackIndexEntry.title,
    visuals: buildGenericWorkVisuals(
      fallbackIndexEntry.title,
      fallbackIndexEntry.image,
    ),
  };
}
