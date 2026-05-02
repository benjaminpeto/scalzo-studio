"use server";

import "server-only";

import {
  fallbackInsightArticles,
  fallbackInsightImage,
} from "@/constants/insights/content";
import { formatPublishedDate, titleCaseFromSlug } from "@/lib/content/format";
import type { Locale } from "@/lib/i18n/routing";
import {
  extractInsightHeadings,
  extractInsightImageUrls,
} from "@/lib/insights/markdown";
import { resolveCmsImageAssetMap } from "@/lib/media-assets/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { buildFallbackInsightContent } from "./helpers";

export async function getInsightDetailPageData(
  slug: string,
  options?: {
    includeDraft?: boolean;
    locale?: Locale;
  },
) {
  const isEs = options?.locale === "es";
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("posts")
    .select(
      "content_md, content_md_es, cover_image_url, created_at, excerpt, excerpt_es, published, published_at, seo_description, seo_description_es, seo_title, seo_title_es, slug, tags, title, title_es, updated_at",
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
    (isEs ? post?.title_es || post?.title : post?.title) ??
    fallbackEntry?.title ??
    titleCaseFromSlug(slug);
  const imageAssets = await resolveCmsImageAssetMap([
    {
      fallbackAlt:
        fallbackEntry?.image.alt ?? `Cover image for ${resolvedTitle}`,
      url: post?.cover_image_url,
    },
  ]);
  const resolvedImage =
    (post?.cover_image_url ? imageAssets[post.cover_image_url] : undefined) ??
    fallbackEntry?.image ??
    fallbackInsightImage;
  const resolvedRawContent = isEs
    ? post?.content_md_es || post?.content_md
    : post?.content_md;
  const resolvedContent =
    resolvedRawContent ??
    fallbackEntry?.content ??
    buildFallbackInsightContent(resolvedTitle, resolvedImage.src);
  const contentImages = await resolveCmsImageAssetMap(
    extractInsightImageUrls(resolvedContent).map((url) => ({
      fallbackAlt: "Article illustration",
      url,
    })),
  );

  return {
    content: resolvedContent,
    contentImages,
    date: formatPublishedDate(
      post?.published_at ?? post?.created_at ?? null,
      fallbackEntry?.date ?? "Editorial note",
    ),
    excerpt:
      (isEs ? post?.excerpt_es || post?.excerpt : post?.excerpt) ??
      fallbackEntry?.excerpt ??
      "Editorial note on how positioning, content structure, and visual signals shape the quality of the first impression.",
    headings: extractInsightHeadings(resolvedContent),
    image: resolvedImage,
    published: post?.published ?? true,
    publishedAt: post?.published_at ?? null,
    seoDescription: isEs
      ? ((post?.seo_description_es || post?.seo_description) ??
        fallbackEntry?.seoDescription ??
        null)
      : (post?.seo_description ?? fallbackEntry?.seoDescription ?? null),
    seoTitle: isEs
      ? ((post?.seo_title_es || post?.seo_title) ??
        fallbackEntry?.seoTitle ??
        null)
      : (post?.seo_title ?? fallbackEntry?.seoTitle ?? null),
    slug,
    tags: post?.tags?.filter((tag): tag is string => Boolean(tag?.trim())) ?? [
      ...(fallbackEntry?.tags ?? ["Editorial"]),
    ],
    title: resolvedTitle,
    updatedAt:
      post?.updated_at ?? post?.published_at ?? post?.created_at ?? null,
  };
}
