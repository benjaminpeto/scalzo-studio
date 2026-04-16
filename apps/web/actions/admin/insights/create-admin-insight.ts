"use server";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type { Database } from "@/lib/supabase/database.types";
import type {
  AdminInsightEditorFieldErrors,
  AdminInsightEditorState,
} from "@/interfaces/admin/insight-editor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  buildInsightEditorFieldErrors,
  buildNormalizedInsightPayload,
  createActionErrorState,
  createActionSuccessState,
  ensureUniqueInsightSlug,
  isFileEntry,
  normalizeStringEntry,
  readInsightEditorFormData,
  revalidateInsightRoutes,
} from "./helpers";
import { sanitizeMarkdownUrls } from "@/lib/markdown/sanitize";

import { deleteManagedBlogObjects, uploadBlogImage } from "./storage";
import { insightEditorSchema, POST_IMAGE_ALT_MAX_LENGTH } from "./schemas";

export async function createAdminInsight(
  _prevState: AdminInsightEditorState,
  formData: FormData,
): Promise<AdminInsightEditorState> {
  await requireCurrentAdminAccess("/admin/insights/new");

  const rawInput = readInsightEditorFormData(formData);
  const parsedInput = insightEditorSchema.safeParse({
    contentMd: normalizeStringEntry(rawInput.contentMd),
    excerpt: normalizeStringEntry(rawInput.excerpt),
    published: rawInput.published,
    seoDescription: normalizeStringEntry(rawInput.seoDescription),
    seoTitle: normalizeStringEntry(rawInput.seoTitle),
    slug: normalizeStringEntry(rawInput.slug),
    tagLines: normalizeStringEntry(rawInput.tagLines),
    title: normalizeStringEntry(rawInput.title),
  });

  if (!parsedInput.success) {
    return createActionErrorState(
      "Check the highlighted fields and try again.",
      buildInsightEditorFieldErrors(parsedInput.error),
    );
  }

  const normalizedInput = buildNormalizedInsightPayload(parsedInput.data);

  if (normalizedInput.errorState || !normalizedInput.payload) {
    return normalizedInput.errorState as AdminInsightEditorState;
  }

  const coverImageFile = isFileEntry(rawInput.coverImage)
    ? rawInput.coverImage
    : null;
  const coverImageAlt = normalizeStringEntry(rawInput.coverImageAlt).trim();
  const uploadedObjectPaths: string[] = [];

  if (coverImageAlt.length > POST_IMAGE_ALT_MAX_LENGTH) {
    return createActionErrorState(
      "Check the highlighted fields and try again.",
      {
        coverImageAlt: `Keep alt text under ${POST_IMAGE_ALT_MAX_LENGTH} characters.`,
      },
    );
  }

  if (coverImageFile && !coverImageAlt) {
    return createActionErrorState(
      "Check the highlighted fields and try again.",
      {
        coverImageAlt: "Enter alt text for the cover image.",
      },
    );
  }

  try {
    const slugExists = await ensureUniqueInsightSlug({
      slug: normalizedInput.payload.slug,
    });

    if (slugExists) {
      return createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          slug: "That slug is already in use by another post.",
        },
      );
    }

    let coverImageUrl: string | null = null;

    if (coverImageFile) {
      const uploadResult = await uploadBlogImage({
        altText: coverImageAlt,
        file: coverImageFile,
        kind: "cover",
        slug: normalizedInput.payload.slug,
      });

      uploadedObjectPaths.push(uploadResult.objectPath);
      coverImageUrl = uploadResult.publicUrl;
    }

    const insertPayload: Database["public"]["Tables"]["posts"]["Insert"] = {
      content_md: sanitizeMarkdownUrls(normalizedInput.payload.contentMd),
      cover_image_url: coverImageUrl,
      excerpt: normalizedInput.payload.excerpt,
      published: normalizedInput.payload.published,
      published_at: normalizedInput.payload.publishedAt,
      seo_description: normalizedInput.payload.seoDescription,
      seo_title: normalizedInput.payload.seoTitle,
      slug: normalizedInput.payload.slug,
      tags: normalizedInput.payload.tags,
      title: normalizedInput.payload.title,
    };
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("posts").insert(insertPayload);

    if (error) {
      await deleteManagedBlogObjects(uploadedObjectPaths).catch(
        (cleanupError) => {
          console.error(
            "Admin insight upload cleanup failed after create error",
            cleanupError,
          );
        },
      );

      console.error("Admin insight create failed", {
        code: error.code,
        details: error.details,
        hint: error.hint,
        message: error.message,
        slug: normalizedInput.payload.slug,
      });

      return createActionErrorState(
        "The post could not be created right now. Try again.",
      );
    }

    revalidateInsightRoutes(normalizedInput.payload.slug);

    return createActionSuccessState({
      message: "Post created. Redirecting to the editor.",
      redirectTo: `/admin/insights/${normalizedInput.payload.slug}?status=created`,
    });
  } catch (error) {
    await deleteManagedBlogObjects(uploadedObjectPaths).catch(
      (cleanupError) => {
        console.error(
          "Admin insight upload cleanup failed after create exception",
          cleanupError,
        );
      },
    );

    const message =
      error instanceof Error
        ? error.message
        : "The post could not be created right now. Try again.";
    const fieldErrors: AdminInsightEditorFieldErrors = {};

    if (message.includes("image")) {
      fieldErrors.coverImage = message;
    }

    console.error("Admin insight create threw an unexpected error", error);

    return createActionErrorState(
      message === "Invalid image upload."
        ? "Check the highlighted fields and try again."
        : message,
      fieldErrors,
    );
  }
}
