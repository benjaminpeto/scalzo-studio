import "server-only";

import { journalEntries as fallbackJournalEntries } from "@/constants/home/content";
import { formatPublishedDate } from "@/lib/content/format";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  cloneFallbackJournalEntries,
  fallbackHomeJournalImage,
} from "./helpers";

export async function getHomeJournalEntries() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "cover_image_url, created_at, excerpt, published_at, slug, tags, title",
    )
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(fallbackJournalEntries.length);

  if (error || !data?.length) {
    return cloneFallbackJournalEntries();
  }

  return data.map((entry, index) => ({
    category:
      entry.tags?.[0] ?? fallbackJournalEntries[index]?.category ?? "Editorial",
    date: formatPublishedDate(
      entry.published_at ?? entry.created_at,
      fallbackJournalEntries[index]?.date ?? "",
    ),
    excerpt: entry.excerpt ?? fallbackJournalEntries[index]?.excerpt ?? "",
    image:
      entry.cover_image_url ??
      fallbackJournalEntries[index]?.image ??
      fallbackHomeJournalImage,
    slug: entry.slug,
    title: entry.title,
  }));
}
