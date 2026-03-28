import "server-only";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type { AdminTestimonialsListData } from "@/interfaces/admin/testimonial-editor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  filterAdminTestimonials,
  getTestimonialSearchText,
  summarizeAdminTestimonials,
} from "./helpers";
import { featuredFilterSchema, publishedFilterSchema } from "./schemas";

export async function getAdminTestimonialsListData(input?: {
  featuredFilter?: string;
  publishedFilter?: string;
  query?: string;
}): Promise<AdminTestimonialsListData> {
  await requireCurrentAdminAccess("/admin/testimonials");

  const query = input?.query?.trim() ?? "";
  const selectedPublishedFilter = publishedFilterSchema.safeParse(
    input?.publishedFilter,
  ).success
    ? (input?.publishedFilter as "all" | "published" | "draft")
    : "all";
  const selectedFeaturedFilter = featuredFilterSchema.safeParse(
    input?.featuredFilter,
  ).success
    ? (input?.featuredFilter as "all" | "featured" | "standard")
    : "all";
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(
      "avatar_url, company, featured, id, name, published, quote, role, updated_at",
    )
    .order("featured", { ascending: false })
    .order("published", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error("Could not load admin testimonials list.");
  }

  const allTestimonials = (data ?? []).map((testimonial) => ({
    avatarUrl: testimonial.avatar_url,
    company: testimonial.company,
    featured: testimonial.featured,
    id: testimonial.id,
    name: testimonial.name,
    published: testimonial.published,
    quote: testimonial.quote,
    role: testimonial.role,
    searchText: getTestimonialSearchText({
      company: testimonial.company,
      name: testimonial.name,
      quote: testimonial.quote,
      role: testimonial.role,
    }),
    updatedAt: testimonial.updated_at,
  }));
  const testimonials = filterAdminTestimonials(allTestimonials, {
    featuredFilter: selectedFeaturedFilter,
    publishedFilter: selectedPublishedFilter,
    query,
  });
  const counts = summarizeAdminTestimonials(
    allTestimonials.map((testimonial) => ({
      avatarUrl: testimonial.avatarUrl,
      company: testimonial.company,
      featured: testimonial.featured,
      id: testimonial.id,
      name: testimonial.name,
      published: testimonial.published,
      quote: testimonial.quote,
      role: testimonial.role,
      updatedAt: testimonial.updatedAt,
    })),
  );

  return {
    featuredCount: counts.featuredCount,
    filteredCount: testimonials.length,
    publishedCount: counts.publishedCount,
    query,
    selectedFeaturedFilter,
    selectedPublishedFilter,
    testimonials,
    totalCount: counts.totalCount,
  };
}
