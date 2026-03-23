import "server-only";

import { featuredProjects as fallbackFeaturedProjects } from "@/components/home/content";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface WorkIndexEntry {
  description: string;
  image: string;
  metadata: string;
  metric: string;
  slug: string;
  title: string;
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
