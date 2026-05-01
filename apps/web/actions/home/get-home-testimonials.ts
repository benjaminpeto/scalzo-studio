"use server";

import "server-only";

import { testimonials as fallbackTestimonials } from "@/constants/home/content";
import { resolveCmsImageAssetMap } from "@/lib/media-assets/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { cloneFallbackTestimonials } from "./helpers";

export async function getHomeTestimonials() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("avatar_url, company, featured, name, quote, role, updated_at")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(fallbackTestimonials.length);

  if (error || !data?.length) {
    return cloneFallbackTestimonials();
  }

  const avatarAssets = await resolveCmsImageAssetMap(
    data.map((testimonial) => ({
      fallbackAlt: `Portrait of ${testimonial.name}`,
      url: testimonial.avatar_url,
    })),
  );

  return data.map((testimonial, index) => ({
    company:
      testimonial.company ??
      fallbackTestimonials[index]?.company ??
      "Scalzo Studio client",
    image: testimonial.avatar_url
      ? avatarAssets[testimonial.avatar_url]
      : fallbackTestimonials[index]?.image,
    name: testimonial.name,
    quote: testimonial.quote,
    role: testimonial.role ?? fallbackTestimonials[index]?.role ?? "Client",
  }));
}
