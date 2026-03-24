import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const returnQuerySchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : ""),
  z.string().max(200),
);

const publishedFilterSchema = z.enum(["all", "published", "draft"]);

const publishActionSchema = z.object({
  caseStudyId: z.string().uuid(),
  currentPublished: z.enum(["true", "false"]),
  industryFilter: returnQuerySchema,
  publishedFilter: publishedFilterSchema,
  slug: z.string().trim().min(1).max(200),
});

export interface AdminCaseStudyListItem {
  clientName: string | null;
  coverImageUrl: string | null;
  galleryCount: number;
  id: string;
  industry: string | null;
  published: boolean;
  slug: string;
  title: string;
  updatedAt: string;
}

export interface AdminCaseStudiesListData {
  caseStudies: AdminCaseStudyListItem[];
  draftCount: number;
  filteredCount: number;
  industries: string[];
  publishedCount: number;
  selectedIndustry: string;
  selectedPublishedFilter: "all" | "published" | "draft";
  totalCount: number;
}

export interface AdminCaseStudyRecord {
  clientName: string | null;
  coverImageUrl: string | null;
  galleryCount: number;
  id: string;
  industry: string | null;
  published: boolean;
  publishedAt: string | null;
  slug: string;
  title: string;
  updatedAt: string;
}

function buildWorkReturnPath(input?: {
  industry?: string;
  publishedFilter?: "all" | "published" | "draft";
  status?: string;
}) {
  const searchParams = new URLSearchParams();

  if (input?.publishedFilter && input.publishedFilter !== "all") {
    searchParams.set("published", input.publishedFilter);
  }

  if (input?.industry) {
    searchParams.set("industry", input.industry);
  }

  if (input?.status) {
    searchParams.set("status", input.status);
  }

  const queryString = searchParams.toString();

  return queryString ? `/admin/work?${queryString}` : "/admin/work";
}

function revalidateWorkRoutes(slug: string) {
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath(`/work/${slug}`);
  revalidatePath("/admin/work");
  revalidatePath(`/admin/work/${slug}`);
}

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

export async function getAdminCaseStudyBySlug(
  slug: string,
): Promise<AdminCaseStudyRecord | null> {
  await requireCurrentAdminAccess(`/admin/work/${slug}`);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select(
      "client_name, cover_image_url, gallery_urls, id, industry, published, published_at, slug, title, updated_at",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    clientName: data.client_name,
    coverImageUrl: data.cover_image_url,
    galleryCount: data.gallery_urls?.length ?? 0,
    id: data.id,
    industry: data.industry,
    published: data.published,
    publishedAt: data.published_at,
    slug: data.slug,
    title: data.title,
    updatedAt: data.updated_at,
  };
}

export async function toggleAdminCaseStudyPublished(formData: FormData) {
  "use server";

  await requireCurrentAdminAccess("/admin/work");

  const parsedInput = publishActionSchema.safeParse({
    caseStudyId: formData.get("caseStudyId"),
    currentPublished: formData.get("currentPublished"),
    industryFilter: formData.get("industryFilter"),
    publishedFilter: formData.get("publishedFilter"),
    slug: formData.get("slug"),
  });

  if (!parsedInput.success) {
    redirect(buildWorkReturnPath({ status: "invalid-action" }));
  }

  const {
    caseStudyId,
    currentPublished,
    industryFilter,
    publishedFilter,
    slug,
  } = parsedInput.data;
  const nextPublished = currentPublished !== "true";
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("case_studies")
    .update({
      published: nextPublished,
      published_at: nextPublished ? new Date().toISOString() : null,
    })
    .eq("id", caseStudyId);

  if (error) {
    redirect(
      buildWorkReturnPath({
        industry: industryFilter,
        publishedFilter,
        status: "update-error",
      }),
    );
  }

  revalidateWorkRoutes(slug);

  redirect(
    buildWorkReturnPath({
      industry: industryFilter,
      publishedFilter,
      status: "publish-updated",
    }),
  );
}
