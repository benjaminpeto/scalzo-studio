import "server-only";

import { fallbackServicesIndexEntries } from "@/constants/services/content";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { cloneFallbackServices } from "./helpers";

export async function getServicesIndexEntries() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("services")
    .select("deliverables, order_index, slug, summary, title")
    .eq("published", true)
    .order("order_index", { ascending: true });

  if (error || !data?.length) {
    return cloneFallbackServices();
  }

  return data.map((service, index) => ({
    deliverables: service.deliverables?.length
      ? service.deliverables
      : [...(fallbackServicesIndexEntries[index]?.deliverables ?? [])],
    outcome:
      fallbackServicesIndexEntries.find(
        (fallback) => fallback.slug === service.slug,
      )?.outcome ??
      fallbackServicesIndexEntries[index]?.outcome ??
      "Designed to make the offer easier to understand and easier to trust.",
    slug: service.slug,
    summary:
      service.summary ??
      fallbackServicesIndexEntries.find(
        (fallback) => fallback.slug === service.slug,
      )?.summary ??
      fallbackServicesIndexEntries[index]?.summary ??
      "",
    title: service.title,
  }));
}
