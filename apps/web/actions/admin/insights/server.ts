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
  currentPublished: z.enum(["true", "false"]),
  currentPublishedAt: returnQuerySchema,
  postId: z.string().uuid(),
  publishedFilter: publishedFilterSchema,
  slug: z.string().trim().min(1).max(200),
  tagFilter: returnQuerySchema,
});

export interface AdminInsightListItem {
  coverImageUrl: string | null;
  excerpt: string | null;
  id: string;
  published: boolean;
  publishedAt: string | null;
  slug: string;
  tags: string[];
  title: string;
  updatedAt: string;
}

export interface AdminInsightsListData {
  draftCount: number;
  filteredCount: number;
  posts: AdminInsightListItem[];
  publishedCount: number;
  selectedPublishedFilter: "all" | "published" | "draft";
  selectedTag: string;
  tags: string[];
  totalCount: number;
}

export type AdminInsightRecord = AdminInsightListItem;

function normalizeTag(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function collectDistinctTags(items: Array<{ tags: string[] }>) {
  const tagsByKey = new Map<string, string>();

  for (const item of items) {
    for (const tag of item.tags) {
      const trimmedTag = tag.trim();
      const normalizedTag = normalizeTag(trimmedTag);

      if (!trimmedTag || !normalizedTag || tagsByKey.has(normalizedTag)) {
        continue;
      }

      tagsByKey.set(normalizedTag, trimmedTag);
    }
  }

  return Array.from(tagsByKey.values()).sort((left, right) =>
    left.localeCompare(right, "en", { sensitivity: "base" }),
  );
}

function buildInsightsReturnPath(input?: {
  publishedFilter?: "all" | "published" | "draft";
  status?: string;
  tag?: string;
}) {
  const searchParams = new URLSearchParams();

  if (input?.publishedFilter && input.publishedFilter !== "all") {
    searchParams.set("published", input.publishedFilter);
  }

  if (input?.tag) {
    searchParams.set("tag", input.tag);
  }

  if (input?.status) {
    searchParams.set("status", input.status);
  }

  const queryString = searchParams.toString();

  return queryString ? `/admin/insights?${queryString}` : "/admin/insights";
}

function revalidateInsightRoutes(slug: string) {
  revalidatePath("/");
  revalidatePath("/insights");
  revalidatePath(`/insights/${slug}`);
  revalidatePath("/admin/insights");
  revalidatePath(`/admin/insights/${slug}`);
}

export async function getAdminInsightsListData(input?: {
  publishedFilter?: string;
  tag?: string;
}): Promise<AdminInsightsListData> {
  await requireCurrentAdminAccess("/admin/insights");

  const selectedPublishedFilter = publishedFilterSchema.safeParse(
    input?.publishedFilter,
  ).success
    ? (input?.publishedFilter as "all" | "published" | "draft")
    : "all";
  const selectedTag = input?.tag?.trim() ?? "";
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "cover_image_url, excerpt, id, published, published_at, slug, tags, title, updated_at",
    )
    .order("published", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error("Could not load admin insights list.");
  }

  const allPosts = (data ?? []).map((post) => ({
    coverImageUrl: post.cover_image_url,
    excerpt: post.excerpt,
    id: post.id,
    published: post.published,
    publishedAt: post.published_at,
    slug: post.slug,
    tags: post.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [],
    title: post.title,
    updatedAt: post.updated_at,
  }));
  const tags = collectDistinctTags(allPosts);
  const selectedTagKey = normalizeTag(selectedTag);

  const posts = allPosts.filter((post) => {
    const publishedMatches =
      selectedPublishedFilter === "all"
        ? true
        : selectedPublishedFilter === "published"
          ? post.published
          : !post.published;
    const tagMatches = selectedTagKey
      ? post.tags.some((tag) => normalizeTag(tag) === selectedTagKey)
      : true;

    return publishedMatches && tagMatches;
  });

  return {
    draftCount: allPosts.filter((post) => !post.published).length,
    filteredCount: posts.length,
    posts,
    publishedCount: allPosts.filter((post) => post.published).length,
    selectedPublishedFilter,
    selectedTag,
    tags,
    totalCount: allPosts.length,
  };
}

export async function getAdminInsightBySlug(
  slug: string,
): Promise<AdminInsightRecord | null> {
  await requireCurrentAdminAccess(`/admin/insights/${slug}`);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "cover_image_url, excerpt, id, published, published_at, slug, tags, title, updated_at",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    coverImageUrl: data.cover_image_url,
    excerpt: data.excerpt,
    id: data.id,
    published: data.published,
    publishedAt: data.published_at,
    slug: data.slug,
    tags: data.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [],
    title: data.title,
    updatedAt: data.updated_at,
  };
}

export async function toggleAdminInsightPublished(formData: FormData) {
  "use server";

  await requireCurrentAdminAccess("/admin/insights");

  const parsedInput = publishActionSchema.safeParse({
    currentPublished: formData.get("currentPublished"),
    currentPublishedAt: formData.get("currentPublishedAt"),
    postId: formData.get("postId"),
    publishedFilter: formData.get("publishedFilter"),
    slug: formData.get("slug"),
    tagFilter: formData.get("tagFilter"),
  });

  if (!parsedInput.success) {
    redirect(buildInsightsReturnPath({ status: "invalid-action" }));
  }

  const {
    currentPublished,
    currentPublishedAt,
    postId,
    publishedFilter,
    slug,
    tagFilter,
  } = parsedInput.data;
  const nextPublished = currentPublished !== "true";
  const nextPublishedAt = nextPublished
    ? currentPublishedAt || new Date().toISOString()
    : null;
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("posts")
    .update({
      published: nextPublished,
      published_at: nextPublishedAt,
    })
    .eq("id", postId);

  if (error) {
    redirect(
      buildInsightsReturnPath({
        publishedFilter,
        status: "update-error",
        tag: tagFilter,
      }),
    );
  }

  revalidateInsightRoutes(slug);

  redirect(
    buildInsightsReturnPath({
      publishedFilter,
      status: "publish-updated",
      tag: tagFilter,
    }),
  );
}
