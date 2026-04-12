"use server";

import "server-only";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type { AdminCaseStudiesListData } from "@/interfaces/admin/work-editor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { publishedFilterSchema } from "./schemas";

export async function getAdminCaseStudiesListData(input?: {
  industry?: string;
  publishedFilter?: string;
}): Promise<AdminCaseStudiesListData> {
  await requireCurrentAdminAccess("/admin/work");

  const selectedPublishedFilter = publishedFilterSchema.safeParse(
    input?.publishedFilter,
  ).success
    ? (input?.publishedFilter as "all" | "published" | "draft")
    : "all";
  const selectedIndustry = input?.industry?.trim() ?? "";
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select(
      "client_name, cover_image_url, gallery_urls, id, industry, published, published_at, slug, title, updated_at",
    )
    .order("published", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error("Could not load admin case studies list.");
  }

  const allCaseStudies = (data ?? []).map((caseStudy) => ({
    clientName: caseStudy.client_name,
    coverImageUrl: caseStudy.cover_image_url,
    galleryCount: caseStudy.gallery_urls?.length ?? 0,
    id: caseStudy.id,
    industry: caseStudy.industry,
    published: caseStudy.published,
    publishedAt: caseStudy.published_at,
    slug: caseStudy.slug,
    title: caseStudy.title,
    updatedAt: caseStudy.updated_at,
  }));

  const industries = Array.from(
    new Set(
      allCaseStudies
        .map((caseStudy) => caseStudy.industry?.trim() ?? "")
        .filter(Boolean),
    ),
  ).sort((left, right) =>
    left.localeCompare(right, "en", { sensitivity: "base" }),
  );

  const caseStudies = allCaseStudies.filter((caseStudy) => {
    const publishedMatches =
      selectedPublishedFilter === "all"
        ? true
        : selectedPublishedFilter === "published"
          ? caseStudy.published
          : !caseStudy.published;
    const industryMatches = selectedIndustry
      ? caseStudy.industry?.trim() === selectedIndustry
      : true;

    return publishedMatches && industryMatches;
  });

  return {
    caseStudies,
    draftCount: allCaseStudies.filter((caseStudy) => !caseStudy.published)
      .length,
    filteredCount: caseStudies.length,
    industries,
    publishedCount: allCaseStudies.filter((caseStudy) => caseStudy.published)
      .length,
    selectedIndustry,
    selectedPublishedFilter,
    totalCount: allCaseStudies.length,
  };
}
