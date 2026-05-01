"use server";

import "server-only";

import { serviceGroups as fallbackServiceGroups } from "@/constants/home/content";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { cloneFallbackServiceGroups } from "./helpers";

export async function getHomeServices() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("services")
    .select("deliverables, order_index, summary, title")
    .eq("published", true)
    .order("order_index", { ascending: true })
    .limit(fallbackServiceGroups.length);

  if (error || !data?.length) {
    return cloneFallbackServiceGroups();
  }

  return data.map((service, index) => ({
    intro: service.summary ?? fallbackServiceGroups[index]?.intro ?? "",
    items: service.deliverables?.slice(0, 3) ?? [
      ...(fallbackServiceGroups[index]?.items ?? []),
    ],
    title: service.title,
  }));
}
