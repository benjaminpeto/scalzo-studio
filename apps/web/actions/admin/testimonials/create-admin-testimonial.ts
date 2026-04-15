"use server";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type { Database } from "@/lib/supabase/database.types";
import type {
  AdminTestimonialEditorFieldErrors,
  AdminTestimonialEditorState,
} from "@/interfaces/admin/testimonial-editor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  buildNormalizedTestimonialPayload,
  buildTestimonialEditorFieldErrors,
  createActionErrorState,
  createActionSuccessState,
  isFileEntry,
  normalizeStringEntry,
  readTestimonialEditorFormData,
  revalidateTestimonialRoutes,
} from "./helpers";
import {
  deleteManagedTestimonialAvatarObjects,
  uploadTestimonialAvatar,
} from "./storage";
import {
  TESTIMONIAL_IMAGE_ALT_MAX_LENGTH,
  testimonialEditorSchema,
} from "./schemas";

export async function createAdminTestimonial(
  _prevState: AdminTestimonialEditorState,
  formData: FormData,
): Promise<AdminTestimonialEditorState> {
  await requireCurrentAdminAccess("/admin/testimonials/new");

  const rawInput = readTestimonialEditorFormData(formData);
  const parsedInput = testimonialEditorSchema.safeParse({
    company: normalizeStringEntry(rawInput.company),
    featured: rawInput.featured,
    name: normalizeStringEntry(rawInput.name),
    published: rawInput.published,
    quote: normalizeStringEntry(rawInput.quote),
    role: normalizeStringEntry(rawInput.role),
  });

  if (!parsedInput.success) {
    return createActionErrorState(
      "Check the highlighted fields and try again.",
      buildTestimonialEditorFieldErrors(parsedInput.error),
    );
  }

  const normalizedInput = buildNormalizedTestimonialPayload(parsedInput.data);
  const avatarFile = isFileEntry(rawInput.avatar) ? rawInput.avatar : null;
  const avatarAlt = normalizeStringEntry(rawInput.avatarAlt).trim();
  const uploadedObjectPaths: string[] = [];
  const testimonialId = crypto.randomUUID();

  if (avatarAlt.length > TESTIMONIAL_IMAGE_ALT_MAX_LENGTH) {
    return createActionErrorState(
      "Check the highlighted fields and try again.",
      {
        avatarAlt: `Keep alt text under ${TESTIMONIAL_IMAGE_ALT_MAX_LENGTH} characters.`,
      },
    );
  }

  if (avatarFile && !avatarAlt) {
    return createActionErrorState(
      "Check the highlighted fields and try again.",
      {
        avatarAlt: "Enter alt text for the avatar image.",
      },
    );
  }

  try {
    let avatarUrl: string | null = null;

    if (avatarFile) {
      const uploadResult = await uploadTestimonialAvatar({
        altText: avatarAlt,
        file: avatarFile,
        testimonialId,
      });

      uploadedObjectPaths.push(uploadResult.objectPath);
      avatarUrl = uploadResult.publicUrl;
    }

    const insertPayload: Database["public"]["Tables"]["testimonials"]["Insert"] =
      {
        avatar_url: avatarUrl,
        company: normalizedInput.payload.company,
        featured: normalizedInput.payload.featured,
        id: testimonialId,
        name: normalizedInput.payload.name,
        published: normalizedInput.payload.published,
        quote: normalizedInput.payload.quote,
        role: normalizedInput.payload.role,
      };
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("testimonials").insert(insertPayload);

    if (error) {
      await deleteManagedTestimonialAvatarObjects(uploadedObjectPaths).catch(
        (cleanupError) => {
          console.error(
            "Admin testimonial avatar cleanup failed after create error",
            cleanupError,
          );
        },
      );

      console.error("Admin testimonial create failed", {
        code: error.code,
        details: error.details,
        hint: error.hint,
        message: error.message,
        testimonialId,
      });

      return createActionErrorState(
        "The testimonial could not be created right now. Try again.",
      );
    }

    revalidateTestimonialRoutes(testimonialId);

    return createActionSuccessState({
      message: "Testimonial created. Redirecting to the editor.",
      redirectTo: `/admin/testimonials/${testimonialId}?status=created`,
    });
  } catch (error) {
    await deleteManagedTestimonialAvatarObjects(uploadedObjectPaths).catch(
      (cleanupError) => {
        console.error(
          "Admin testimonial avatar cleanup failed after create exception",
          cleanupError,
        );
      },
    );

    const message =
      error instanceof Error
        ? error.message
        : "The testimonial could not be created right now. Try again.";
    const fieldErrors: AdminTestimonialEditorFieldErrors = {};

    if (
      message.includes("image") ||
      message.includes("content type") ||
      message.includes("File size")
    ) {
      fieldErrors.avatar = message;
    }

    console.error("Admin testimonial create threw an unexpected error", error);

    return createActionErrorState(
      message === "Invalid image upload."
        ? "Check the highlighted fields and try again."
        : message,
      fieldErrors,
    );
  }
}
