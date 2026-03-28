import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";

import { getFallbackInsightTags } from "./helpers";

export async function getInsightTags() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("tags")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error || !data?.length) {
    return getFallbackInsightTags();
  }

  const tags = Array.from(
    new Set(
      data.flatMap((entry) =>
        (entry.tags ?? []).map((tag) => tag.trim()).filter(Boolean),
      ),
    ),
  );

  return tags.length ? tags : getFallbackInsightTags();
}
