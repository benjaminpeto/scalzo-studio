import type { Database } from "@/lib/supabase/database.types";
import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type {
  AdminInsightEditorFieldErrors,
  AdminInsightEditorState,
} from "@/interfaces/admin/insight-editor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { getAdminInsightBySlug } from "./get-admin-insight-by-slug";
import {
  buildInsightEditorFieldErrors,
  buildNormalizedInsightPayload,
  createActionErrorState,
  createActionSuccessState,
  deleteManagedBlogObjects,
  ensureUniqueInsightSlug,
  extractManagedBlogObjectPathFromUrl,
  isFileEntry,
  normalizeStringEntry,
  readInsightEditorFormData,
  revalidateInsightRoutes,
  syncInsightImageAltText,
  uploadBlogImage,
} from "./helpers";
import { insightUpdateSchema, POST_IMAGE_ALT_MAX_LENGTH } from "./schemas";

export async function updateAdminInsight(
  _prevState: AdminInsightEditorState,
  formData: FormData,
): Promise<AdminInsightEditorState> {
  "use server";

  const rawInput = readInsightEditorFormData(formData);
  const currentSlug = normalizeStringEntry(rawInput.currentSlug);

  await requireCurrentAdminAccess(
    currentSlug ? `/admin/insights/${currentSlug}` : "/admin/insights",
  );

  const parsedInput = insightUpdateSchema.safeParse({
    contentMd: normalizeStringEntry(rawInput.contentMd),
    currentSlug,
    excerpt: normalizeStringEntry(rawInput.excerpt),
    postId: normalizeStringEntry(rawInput.postId),
    published: rawInput.published,
    removeCoverImage: rawInput.removeCoverImage,
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

  try {
    const slugExists = await ensureUniqueInsightSlug({
      postId: parsedInput.data.postId,
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
  } catch (error) {
    console.error("Admin insight slug validation failed", error);

    return createActionErrorState(
      "The post could not be validated right now. Try again.",
    );
  }

  const existingPost = await getAdminInsightBySlug(currentSlug);

  if (!existingPost || existingPost.id !== parsedInput.data.postId) {
    return createActionErrorState(
      "That post could not be found anymore. Refresh and try again.",
    );
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

  try {
    const keepsExistingCoverImage =
      Boolean(existingPost.coverImage) &&
      !parsedInput.data.removeCoverImage &&
      !coverImageFile;

    if ((coverImageFile || keepsExistingCoverImage) && !coverImageAlt) {
      return createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          coverImageAlt: coverImageFile
            ? "Enter alt text for the cover image."
            : "Enter alt text before keeping the current cover image.",
        },
      );
    }

    let nextCoverImageUrl =
      parsedInput.data.removeCoverImage && !coverImageFile
        ? null
        : (existingPost.coverImage?.src ?? null);

    if (coverImageFile) {
      const uploadResult = await uploadBlogImage({
        altText: coverImageAlt,
        file: coverImageFile,
        kind: "cover",
        slug: normalizedInput.payload.slug,
      });

      uploadedObjectPaths.push(uploadResult.objectPath);
      nextCoverImageUrl = uploadResult.publicUrl;
    }

    if (keepsExistingCoverImage && existingPost.coverImage?.src) {
      await syncInsightImageAltText({
        altText: coverImageAlt,
        publicUrl: existingPost.coverImage.src,
      });
    }

    const nextPublishedAt = normalizedInput.payload.published
      ? (existingPost.publishedAt ?? normalizedInput.payload.publishedAt)
      : null;
    const updatePayload: Database["public"]["Tables"]["posts"]["Update"] = {
      content_md: normalizedInput.payload.contentMd,
      cover_image_url: nextCoverImageUrl,
      excerpt: normalizedInput.payload.excerpt,
      published: normalizedInput.payload.published,
      published_at: nextPublishedAt,
      seo_description: normalizedInput.payload.seoDescription,
      seo_title: normalizedInput.payload.seoTitle,
      slug: normalizedInput.payload.slug,
      tags: normalizedInput.payload.tags,
      title: normalizedInput.payload.title,
    };
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("posts")
      .update(updatePayload)
      .eq("id", parsedInput.data.postId)
      .select("slug")
      .maybeSingle();

    if (error || !data) {
      await deleteManagedBlogObjects(uploadedObjectPaths).catch(
        (cleanupError) => {
          console.error(
            "Admin insight upload cleanup failed after update error",
            cleanupError,
          );
        },
      );

      console.error("Admin insight update failed", {
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        message: error?.message,
        postId: parsedInput.data.postId,
        slug: normalizedInput.payload.slug,
      });

      return createActionErrorState(
        "The post changes could not be saved right now. Try again.",
      );
    }

    const coverUrlToDelete =
      existingPost.coverImage?.src &&
      (parsedInput.data.removeCoverImage || Boolean(coverImageFile))
        ? extractManagedBlogObjectPathFromUrl(existingPost.coverImage.src)
        : null;

    if (coverUrlToDelete) {
      await deleteManagedBlogObjects([coverUrlToDelete]).catch(
        (cleanupError) => {
          console.error(
            "Admin insight cover cleanup failed after save",
            cleanupError,
          );
        },
      );
    }

    revalidateInsightRoutes(currentSlug);

    if (normalizedInput.payload.slug !== currentSlug) {
      revalidateInsightRoutes(normalizedInput.payload.slug);
    }

    return createActionSuccessState({
      message: "Post changes saved. Refreshing the editor.",
      redirectTo: `/admin/insights/${normalizedInput.payload.slug}?status=saved`,
    });
  } catch (error) {
    await deleteManagedBlogObjects(uploadedObjectPaths).catch(
      (cleanupError) => {
        console.error(
          "Admin insight upload cleanup failed after exception",
          cleanupError,
        );
      },
    );

    const message =
      error instanceof Error
        ? error.message
        : "The post changes could not be saved right now. Try again.";
    const fieldErrors: AdminInsightEditorFieldErrors = {};

    if (message.includes("image")) {
      fieldErrors.coverImage = message;
    }

    console.error("Admin insight update threw an unexpected error", error);

    return createActionErrorState(
      message === "Invalid image upload."
        ? "Check the highlighted fields and try again."
        : message,
      fieldErrors,
    );
  }
}
