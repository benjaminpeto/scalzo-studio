import "server-only";

import {
  fallbackWorkImage,
  fallbackWorkIndexEntries,
} from "@/constants/work/content";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { cloneFallbackWorkEntries, resolveWorkMetric } from "./helpers";

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
