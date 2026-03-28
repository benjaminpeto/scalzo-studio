import { redirect } from "next/navigation";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  buildTestimonialsReturnPath,
  deleteManagedTestimonialAvatarObjects,
  extractManagedTestimonialAvatarObjectPathFromUrl,
  revalidateTestimonialRoutes,
} from "./helpers";
import { deleteActionSchema } from "./schemas";

export async function deleteAdminTestimonial(formData: FormData) {
  "use server";

  const parsedInput = deleteActionSchema.safeParse({
    confirmDelete: formData.get("confirmDelete"),
    testimonialId: formData.get("testimonialId"),
  });

  if (!parsedInput.success) {
    redirect(buildTestimonialsReturnPath({ status: "invalid-action" }));
  }

  await requireCurrentAdminAccess(
    `/admin/testimonials/${parsedInput.data.testimonialId}`,
  );

  const supabase = await createServerSupabaseClient();
  const { data: existingTestimonial, error: loadError } = await supabase
    .from("testimonials")
    .select("avatar_url, id")
    .eq("id", parsedInput.data.testimonialId)
    .maybeSingle();

  if (loadError || !existingTestimonial) {
    redirect(buildTestimonialsReturnPath({ status: "testimonial-missing" }));
  }

  const avatarObjectPath = existingTestimonial.avatar_url
    ? extractManagedTestimonialAvatarObjectPathFromUrl(
        existingTestimonial.avatar_url,
      )
    : null;
  const { error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", parsedInput.data.testimonialId);

  if (error) {
    redirect(buildTestimonialsReturnPath({ status: "update-error" }));
  }

  if (avatarObjectPath) {
    await deleteManagedTestimonialAvatarObjects([avatarObjectPath]).catch(
      (cleanupError) => {
        console.error(
          "Admin testimonial avatar cleanup failed after delete",
          cleanupError,
        );
      },
    );
  }

  revalidateTestimonialRoutes(parsedInput.data.testimonialId);

  redirect(buildTestimonialsReturnPath({ status: "deleted" }));
}
