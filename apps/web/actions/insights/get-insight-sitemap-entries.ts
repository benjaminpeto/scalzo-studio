import "server-only";

import { fallbackInsightArticles } from "@/constants/insights/content";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface InsightSitemapEntry {
  lastModified?: string;
  slug: string;
}

export async function getInsightSitemapEntries(): Promise<
  InsightSitemapEntry[]
> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("posts")
    .select("created_at, published_at, slug, updated_at")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });

  const entries = new Map<string, InsightSitemapEntry>(
    fallbackInsightArticles.map((entry) => [
      entry.slug,
      {
        slug: entry.slug,
      },
    ]),
  );

  data?.forEach((entry) => {
    if (!entry.slug) {
      return;
    }

    entries.set(entry.slug, {
      lastModified:
        entry.updated_at ?? entry.published_at ?? entry.created_at ?? undefined,
      slug: entry.slug,
    });
  });

  return [...entries.values()];
}
