"use server";

import type { Database } from "@/lib/supabase/database.types";
import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type {
  AdminTestimonialEditorFieldErrors,
  AdminTestimonialEditorState,
} from "@/interfaces/admin/testimonial-editor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { getAdminTestimonialById } from "./get-admin-testimonial-by-id";
import {
  buildNormalizedTestimonialPayload,
  buildTestimonialEditorFieldErrors,
  createActionErrorState,
  createActionSuccessState,
  deleteManagedTestimonialAvatarObjects,
  extractManagedTestimonialAvatarObjectPathFromUrl,
  isFileEntry,
  normalizeStringEntry,
  readTestimonialEditorFormData,
  revalidateTestimonialRoutes,
  syncTestimonialAvatarAltText,
  uploadTestimonialAvatar,
} from "./helpers";
import {
  TESTIMONIAL_IMAGE_ALT_MAX_LENGTH,
  testimonialUpdateSchema,
} from "./schemas";

export async function updateAdminTestimonial(
  _prevState: AdminTestimonialEditorState,
  formData: FormData,
): Promise<AdminTestimonialEditorState> {
  const rawInput = readTestimonialEditorFormData(formData);
  const testimonialId = normalizeStringEntry(rawInput.testimonialId);

  await requireCurrentAdminAccess(
    testimonialId
      ? `/admin/testimonials/${testimonialId}`
      : "/admin/testimonials",
  );

  const parsedInput = testimonialUpdateSchema.safeParse({
    company: normalizeStringEntry(rawInput.company),
    featured: rawInput.featured,
    name: normalizeStringEntry(rawInput.name),
    published: rawInput.published,
    quote: normalizeStringEntry(rawInput.quote),
    removeAvatar: rawInput.removeAvatar,
    role: normalizeStringEntry(rawInput.role),
    testimonialId,
  });

  if (!parsedInput.success) {
    return createActionErrorState(
      "Check the highlighted fields and try again.",
      buildTestimonialEditorFieldErrors(parsedInput.error),
    );
  }

  const normalizedInput = buildNormalizedTestimonialPayload(parsedInput.data);
  const existingTestimonial = await getAdminTestimonialById(
    parsedInput.data.testimonialId,
  );

  if (!existingTestimonial) {
    return createActionErrorState(
      "That testimonial could not be found anymore. Refresh and try again.",
    );
  }

  const avatarFile = isFileEntry(rawInput.avatar) ? rawInput.avatar : null;
  const avatarAlt = normalizeStringEntry(rawInput.avatarAlt).trim();
  const uploadedObjectPaths: string[] = [];

  if (avatarAlt.length > TESTIMONIAL_IMAGE_ALT_MAX_LENGTH) {
    return createActionErrorState(
      "Check the highlighted fields and try again.",
      {
        avatarAlt: `Keep alt text under ${TESTIMONIAL_IMAGE_ALT_MAX_LENGTH} characters.`,
      },
    );
  }

  try {
    const keepsExistingAvatar =
      Boolean(existingTestimonial.avatar) &&
      !parsedInput.data.removeAvatar &&
      !avatarFile;

    if ((avatarFile || keepsExistingAvatar) && !avatarAlt) {
      return createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          avatarAlt: avatarFile
            ? "Enter alt text for the avatar image."
            : "Enter alt text before keeping the current avatar.",
        },
      );
    }

    let nextAvatarUrl =
      parsedInput.data.removeAvatar && !avatarFile
        ? null
        : (existingTestimonial.avatar?.src ?? null);

    if (avatarFile) {
      const uploadResult = await uploadTestimonialAvatar({
        altText: avatarAlt,
        file: avatarFile,
        testimonialId: parsedInput.data.testimonialId,
      });

      uploadedObjectPaths.push(uploadResult.objectPath);
      nextAvatarUrl = uploadResult.publicUrl;
    }

    if (keepsExistingAvatar && existingTestimonial.avatar?.src) {
      await syncTestimonialAvatarAltText({
        altText: avatarAlt,
        publicUrl: existingTestimonial.avatar.src,
      });
    }

    const updatePayload: Database["public"]["Tables"]["testimonials"]["Update"] =
      {
        avatar_url: nextAvatarUrl,
        company: normalizedInput.payload.company,
        featured: normalizedInput.payload.featured,
        name: normalizedInput.payload.name,
        published: normalizedInput.payload.published,
        quote: normalizedInput.payload.quote,
        role: normalizedInput.payload.role,
      };
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("testimonials")
      .update(updatePayload)
      .eq("id", parsedInput.data.testimonialId)
      .select("id")
      .maybeSingle();

    if (error || !data) {
      await deleteManagedTestimonialAvatarObjects(uploadedObjectPaths).catch(
        (cleanupError) => {
          console.error(
            "Admin testimonial avatar cleanup failed after update error",
            cleanupError,
          );
        },
      );

      console.error("Admin testimonial update failed", {
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        message: error?.message,
        testimonialId: parsedInput.data.testimonialId,
      });

      return createActionErrorState(
        "The testimonial changes could not be saved right now. Try again.",
      );
    }

    const avatarObjectPathToDelete =
      existingTestimonial.avatar?.src &&
      (parsedInput.data.removeAvatar || Boolean(avatarFile))
        ? extractManagedTestimonialAvatarObjectPathFromUrl(
            existingTestimonial.avatar.src,
          )
        : null;

    if (avatarObjectPathToDelete) {
      await deleteManagedTestimonialAvatarObjects([
        avatarObjectPathToDelete,
      ]).catch((cleanupError) => {
        console.error(
          "Admin testimonial avatar cleanup failed after save",
          cleanupError,
        );
      });
    }

    revalidateTestimonialRoutes(parsedInput.data.testimonialId);

    return createActionSuccessState({
      message: "Testimonial changes saved. Refreshing the editor.",
      redirectTo: `/admin/testimonials/${parsedInput.data.testimonialId}?status=saved`,
    });
  } catch (error) {
    await deleteManagedTestimonialAvatarObjects(uploadedObjectPaths).catch(
      (cleanupError) => {
        console.error(
          "Admin testimonial avatar cleanup failed after exception",
          cleanupError,
        );
      },
    );

    const message =
      error instanceof Error
        ? error.message
        : "The testimonial changes could not be saved right now. Try again.";
    const fieldErrors: AdminTestimonialEditorFieldErrors = {};

    if (
      message.includes("image") ||
      message.includes("content type") ||
      message.includes("File size")
    ) {
      fieldErrors.avatar = message;
    }

    console.error("Admin testimonial update threw an unexpected error", error);

    return createActionErrorState(
      message === "Invalid image upload."
        ? "Check the highlighted fields and try again."
        : message,
      fieldErrors,
    );
  }
}
