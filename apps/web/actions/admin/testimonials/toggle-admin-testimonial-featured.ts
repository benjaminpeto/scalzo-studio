"use server";

import { redirect } from "next/navigation";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  buildTestimonialsReturnPath,
  revalidateTestimonialRoutes,
} from "./helpers";
import { featureActionSchema } from "./schemas";

export async function toggleAdminTestimonialFeatured(formData: FormData) {
  await requireCurrentAdminAccess("/admin/testimonials");

  const parsedInput = featureActionSchema.safeParse({
    currentFeatured: formData.get("currentFeatured"),
    featuredFilter: formData.get("featuredFilter"),
    publishedFilter: formData.get("publishedFilter"),
    searchQuery: formData.get("searchQuery"),
    testimonialId: formData.get("testimonialId"),
  });

  if (!parsedInput.success) {
    redirect(buildTestimonialsReturnPath({ status: "invalid-action" }));
  }

  const {
    currentFeatured,
    featuredFilter,
    publishedFilter,
    searchQuery,
    testimonialId,
  } = parsedInput.data;
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("testimonials")
    .update({
      featured: currentFeatured !== "true",
    })
    .eq("id", testimonialId);

  if (error) {
    redirect(
      buildTestimonialsReturnPath({
        featuredFilter,
        publishedFilter,
        query: searchQuery,
        status: "update-error",
      }),
    );
  }

  revalidateTestimonialRoutes(testimonialId);

  redirect(
    buildTestimonialsReturnPath({
      featuredFilter,
      publishedFilter,
      query: searchQuery,
      status: "featured-updated",
    }),
  );
}
