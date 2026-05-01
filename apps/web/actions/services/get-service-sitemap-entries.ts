"use server";

import "server-only";

import { fallbackServicesIndexEntries } from "@/constants/services/content";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface ServiceSitemapEntry {
  lastModified?: string;
  slug: string;
}

export async function getServiceSitemapEntries(): Promise<
  ServiceSitemapEntry[]
> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("services")
    .select("slug, updated_at")
    .eq("published", true)
    .order("order_index", { ascending: true });

  const entries = new Map<string, ServiceSitemapEntry>(
    fallbackServicesIndexEntries.map((entry) => [
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
      lastModified: entry.updated_at ?? undefined,
      slug: entry.slug,
    });
  });

  return [...entries.values()];
}
