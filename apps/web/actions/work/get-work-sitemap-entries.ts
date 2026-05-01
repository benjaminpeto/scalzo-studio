"use server";

import "server-only";

import { fallbackWorkIndexEntries } from "@/constants/work/content";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { WorkSitemapEntry } from "@/interfaces/work/content";

export async function getWorkSitemapEntries(): Promise<WorkSitemapEntry[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("case_studies")
    .select("published_at, slug, updated_at")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });

  const entries = new Map<string, WorkSitemapEntry>(
    fallbackWorkIndexEntries.map((entry) => [
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
      lastModified: entry.updated_at ?? entry.published_at ?? undefined,
      slug: entry.slug,
    });
  });

  return [...entries.values()];
}
