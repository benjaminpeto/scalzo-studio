import "server-only";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type { AdminInsightsListData } from "@/interfaces/admin/insight-editor";
import { normalizeInsightTag } from "@/lib/insights/tags";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { collectDistinctTags } from "./helpers";
import { publishedFilterSchema } from "./schemas";

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
  const selectedTagKey = normalizeInsightTag(selectedTag);

  const posts = allPosts.filter((post) => {
    const publishedMatches =
      selectedPublishedFilter === "all"
        ? true
        : selectedPublishedFilter === "published"
          ? post.published
          : !post.published;
    const tagMatches = selectedTagKey
      ? post.tags.some((tag) => normalizeInsightTag(tag) === selectedTagKey)
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
