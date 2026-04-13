import "server-only";

import {
  fallbackInsightArticles,
  fallbackInsightImage,
  fallbackInsightIndexEntries,
} from "@/constants/insights/content";
import type { InsightDetailPageData } from "@/interfaces/insights/content";
import { titleCaseFromSlug } from "@/lib/content/format";
import { extractInsightHeadings } from "@/lib/insights/markdown";
import { matchesSelectedInsightTag } from "@/lib/insights/tags";

export function cloneFallbackInsightEntries() {
  return fallbackInsightIndexEntries.map((entry) => ({
    date: entry.date,
    excerpt: entry.excerpt,
    image: entry.image,
    seoDescription: entry.seoDescription,
    seoTitle: entry.seoTitle,
    slug: entry.slug,
    tags: [...entry.tags],
    title: entry.title,
  }));
}

export function buildFallbackInsightContent(title: string, image: string) {
  return `A published editorial note on how clearer structure, stronger proof, and calmer visual pacing improve the first impression of ${title.toLowerCase()}.

## The core point

This article exists to turn an abstract design concern into a practical page decision.

![Article illustration](${image})

## Why it matters

The more clearly a page introduces the offer, the easier it becomes to trust the business behind it.

## What to take away

Small structural changes usually do more for credibility than simply adding more copy.`;
}

export function getFallbackInsightEntries(selectedTag: string | null = null) {
  return cloneFallbackInsightEntries().filter((entry) =>
    matchesSelectedInsightTag(entry, selectedTag),
  );
}

export function getFallbackInsightTags() {
  return Array.from(
    new Set(
      fallbackInsightIndexEntries.flatMap((entry) =>
        entry.tags.map((tag) => tag.trim()).filter(Boolean),
      ),
    ),
  );
}

export function getFallbackInsightDetailPageData(
  slug: string,
): InsightDetailPageData {
  const fallbackEntry = fallbackInsightArticles.find(
    (entry) => entry.slug === slug,
  );

  if (fallbackEntry) {
    return {
      ...fallbackEntry,
      contentImages: {},
      headings: extractInsightHeadings(fallbackEntry.content),
      published: true,
      publishedAt: fallbackEntry.publishedAt,
      tags: [...fallbackEntry.tags],
      updatedAt: fallbackEntry.updatedAt,
    };
  }

  const title = titleCaseFromSlug(slug);
  const content = buildFallbackInsightContent(title, fallbackInsightImage.src);

  return {
    content,
    contentImages: {},
    date: "Editorial note",
    excerpt:
      "A published note on how sharper positioning, stronger proof, and calmer page structure improve the first impression.",
    headings: extractInsightHeadings(content),
    image: fallbackInsightImage,
    published: true,
    publishedAt: null,
    seoDescription: null,
    seoTitle: null,
    slug,
    tags: ["Editorial"],
    title,
    updatedAt: null,
  };
}
