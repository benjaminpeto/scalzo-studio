"use server";

import "server-only";

import { fallbackServicesIndexEntries } from "@/constants/services/content";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getServiceDetailStaticSlugs() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("services")
    .select("slug")
    .eq("published", true)
    .order("order_index", { ascending: true });

  const slugs = new Set<string>(
    fallbackServicesIndexEntries.map((item) => item.slug),
  );

  data?.forEach((item) => {
    if (item.slug) {
      slugs.add(item.slug);
    }
  });

  return [...slugs];
}
