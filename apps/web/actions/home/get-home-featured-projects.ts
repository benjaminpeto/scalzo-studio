import "server-only";

import { featuredProjects as fallbackFeaturedProjects } from "@/constants/home/content";
import { resolveCmsImageAssetMap } from "@/lib/media-assets/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  cloneFallbackFeaturedProjects,
  fallbackHomeProjectImage,
} from "./helpers";

export async function getHomeFeaturedProjects() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select(
      "client_name, cover_image_url, industry, outcomes, outcomes_metrics, published_at, services, title, updated_at",
    )
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false })
    .limit(fallbackFeaturedProjects.length);

  if (error || !data?.length) {
    return cloneFallbackFeaturedProjects();
  }

  const imageAssets = await resolveCmsImageAssetMap(
    data.map((project, index) => ({
      fallbackAlt:
        fallbackFeaturedProjects[index]?.image.alt ??
        `Case study cover for ${project.title}`,
      url: project.cover_image_url,
    })),
  );

  return data.map((project, index) => ({
    accent:
      project.services?.[0] ??
      project.client_name ??
      fallbackFeaturedProjects[index]?.accent ??
      "Selected engagement",
    category:
      project.industry ??
      fallbackFeaturedProjects[index]?.category ??
      "Case study",
    description:
      project.outcomes ?? fallbackFeaturedProjects[index]?.description ?? "",
    image:
      (project.cover_image_url
        ? imageAssets[project.cover_image_url]
        : undefined) ??
      fallbackFeaturedProjects[index]?.image ??
      fallbackHomeProjectImage,
    metric:
      typeof project.outcomes_metrics === "string"
        ? project.outcomes_metrics
        : (fallbackFeaturedProjects[index]?.metric ?? "Published case study"),
    title: project.title,
  }));
}
