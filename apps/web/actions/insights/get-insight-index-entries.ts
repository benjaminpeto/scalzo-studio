"use server";

import "server-only";

import {
  fallbackInsightImage,
  fallbackInsightIndexEntries,
} from "@/constants/insights/content";
import { formatPublishedDate } from "@/lib/content/format";
import { matchesSelectedInsightTag } from "@/lib/insights/tags";
import { resolveCmsImageAssetMap } from "@/lib/media-assets/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { getFallbackInsightEntries } from "./helpers";

export async function getInsightIndexEntries(
  selectedTag: string | null = null,
) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "cover_image_url, created_at, excerpt, published_at, seo_description, seo_title, slug, tags, title, updated_at",
    )
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (error || !data?.length) {
    return getFallbackInsightEntries(selectedTag);
  }

  const imageAssets = await resolveCmsImageAssetMap(
    data.map((entry, index) => ({
      fallbackAlt:
        fallbackInsightIndexEntries[index]?.image.alt ??
        `Cover image for ${entry.title}`,
      url: entry.cover_image_url,
    })),
  );

  return data
    .map((entry, index) => ({
      date: formatPublishedDate(
        entry.published_at ?? entry.created_at,
        fallbackInsightIndexEntries[index]?.date ?? "",
      ),
      excerpt:
        entry.excerpt ??
        fallbackInsightIndexEntries[index]?.excerpt ??
        "Editorial note on how positioning, content structure, and visual signals shape the quality of the first impression.",
      image:
        (entry.cover_image_url
          ? imageAssets[entry.cover_image_url]
          : undefined) ??
        fallbackInsightIndexEntries[index]?.image ??
        fallbackInsightImage,
      seoDescription: entry.seo_description,
      seoTitle: entry.seo_title,
      slug: entry.slug,
      tags: entry.tags?.filter((tag): tag is string =>
        Boolean(tag?.trim()),
      ) ?? [...(fallbackInsightIndexEntries[index]?.tags ?? ["Editorial"])],
      title: entry.title,
    }))
    .filter((entry) => matchesSelectedInsightTag(entry, selectedTag));
}
