import "server-only";

import {
  fallbackInsightArticles,
  fallbackInsightImage,
} from "@/constants/insights/content";
import { formatPublishedDate, titleCaseFromSlug } from "@/lib/content/format";
import { extractInsightHeadings } from "@/lib/insights/markdown";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { buildFallbackInsightContent } from "./helpers";

export async function getInsightDetailPageData(
  slug: string,
  options?: {
    includeDraft?: boolean;
  },
) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("posts")
    .select(
      "content_md, cover_image_url, created_at, excerpt, published, published_at, seo_description, seo_title, slug, tags, title, updated_at",
    )
    .eq("slug", slug);

  if (!options?.includeDraft) {
    query = query.eq("published", true);
  }

  const { data: post, error } = await query.maybeSingle();

  const fallbackEntry = fallbackInsightArticles.find(
    (entry) => entry.slug === slug,
  );

  if ((error || !post) && !fallbackEntry) {
    return null;
  }

  const resolvedTitle =
    post?.title ?? fallbackEntry?.title ?? titleCaseFromSlug(slug);
  const resolvedImage =
    post?.cover_image_url ?? fallbackEntry?.image ?? fallbackInsightImage;
  const resolvedContent =
    post?.content_md ??
    fallbackEntry?.content ??
    buildFallbackInsightContent(resolvedTitle, resolvedImage);

  return {
    content: resolvedContent,
    date: formatPublishedDate(
      post?.published_at ?? post?.created_at ?? null,
      fallbackEntry?.date ?? "Editorial note",
    ),
    excerpt:
      post?.excerpt ??
      fallbackEntry?.excerpt ??
      "Editorial note on how positioning, content structure, and visual signals shape the quality of the first impression.",
    headings: extractInsightHeadings(resolvedContent),
    image: resolvedImage,
    published: post?.published ?? true,
    publishedAt: post?.published_at ?? null,
    seoDescription:
      post?.seo_description ?? fallbackEntry?.seoDescription ?? null,
    seoTitle: post?.seo_title ?? fallbackEntry?.seoTitle ?? null,
    slug,
    tags: post?.tags?.filter((tag): tag is string => Boolean(tag?.trim())) ?? [
      ...(fallbackEntry?.tags ?? ["Editorial"]),
    ],
    title: resolvedTitle,
    updatedAt:
      post?.updated_at ?? post?.published_at ?? post?.created_at ?? null,
  };
}
