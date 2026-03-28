import { redirect } from "next/navigation";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  buildTestimonialsReturnPath,
  revalidateTestimonialRoutes,
} from "./helpers";
import { publishActionSchema } from "./schemas";

export async function toggleAdminTestimonialPublished(formData: FormData) {
  "use server";

  await requireCurrentAdminAccess("/admin/testimonials");

  const parsedInput = publishActionSchema.safeParse({
    currentPublished: formData.get("currentPublished"),
    featuredFilter: formData.get("featuredFilter"),
    publishedFilter: formData.get("publishedFilter"),
    searchQuery: formData.get("searchQuery"),
    testimonialId: formData.get("testimonialId"),
  });

  if (!parsedInput.success) {
    redirect(buildTestimonialsReturnPath({ status: "invalid-action" }));
  }

  const {
    currentPublished,
    featuredFilter,
    publishedFilter,
    searchQuery,
    testimonialId,
  } = parsedInput.data;
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("testimonials")
    .update({
      published: currentPublished !== "true",
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
      status: "publish-updated",
    }),
  );
}
