"use server";

import type { Database, Json } from "@/lib/supabase/database.types";
import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type {
  AdminCaseStudyEditorFieldErrors,
  AdminCaseStudyEditorState,
} from "@/interfaces/admin/work-editor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { getAdminCaseStudyBySlug } from "./get-admin-case-study-by-slug";
import {
  buildCaseStudyEditorFieldErrors,
  buildNormalizedCaseStudyPayload,
  buildPublishedAtValue,
  createActionErrorState,
  createActionSuccessState,
  ensureUniqueCaseStudySlug,
  isFileEntry,
  normalizeMetricsRows,
  normalizeStringEntry,
  readCaseStudyEditorFormData,
  revalidateWorkRoutes,
} from "./helpers";
import {
  buildExistingGalleryImageAltEntries,
  deleteManagedCaseStudyObjects,
  extractManagedCaseStudyObjectPathFromUrl,
  syncCaseStudyImageAltText,
  uploadCaseStudyImage,
} from "./storage";
import {
  CASE_STUDY_IMAGE_ALT_MAX_LENGTH,
  caseStudyUpdateSchema,
} from "./schemas";

export async function updateAdminCaseStudy(
  _prevState: AdminCaseStudyEditorState,
  formData: FormData,
): Promise<AdminCaseStudyEditorState> {
  const rawInput = readCaseStudyEditorFormData(formData);
  const currentSlug = normalizeStringEntry(rawInput.currentSlug);

  await requireCurrentAdminAccess(
    currentSlug ? `/admin/work/${currentSlug}` : "/admin/work",
  );

  const parsedInput = caseStudyUpdateSchema.safeParse({
    approach: normalizeStringEntry(rawInput.approach),
    caseStudyId: normalizeStringEntry(rawInput.caseStudyId),
    challenge: normalizeStringEntry(rawInput.challenge),
    clientName: normalizeStringEntry(rawInput.clientName),
    currentSlug,
    industry: normalizeStringEntry(rawInput.industry),
    outcomes: normalizeStringEntry(rawInput.outcomes),
    published: rawInput.published,
    removeCoverImage: rawInput.removeCoverImage,
    seoDescription: normalizeStringEntry(rawInput.seoDescription),
    seoTitle: normalizeStringEntry(rawInput.seoTitle),
    serviceLines: normalizeStringEntry(rawInput.serviceLines),
    slug: normalizeStringEntry(rawInput.slug),
    title: normalizeStringEntry(rawInput.title),
  });

  if (!parsedInput.success) {
    return createActionErrorState(
      "Check the highlighted fields and try again.",
      buildCaseStudyEditorFieldErrors(parsedInput.error),
    );
  }

  const metricsResult = normalizeMetricsRows({
    labels: rawInput.metricLabels,
    values: rawInput.metricValues,
  });
  const normalizedInput = buildNormalizedCaseStudyPayload(
    parsedInput.data,
    metricsResult,
  );

  if (normalizedInput.errorState || !normalizedInput.payload) {
    return normalizedInput.errorState as AdminCaseStudyEditorState;
  }

  try {
    const slugExists = await ensureUniqueCaseStudySlug({
      caseStudyId: parsedInput.data.caseStudyId,
      slug: normalizedInput.payload.slug,
    });

    if (slugExists) {
      return createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          slug: "That slug is already in use by another case study.",
        },
      );
    }
  } catch (error) {
    console.error("Admin case study slug validation failed", error);

    return createActionErrorState(
      "The case study could not be validated right now. Try again.",
    );
  }

  const existingCaseStudy = await getAdminCaseStudyBySlug(currentSlug);

  if (
    !existingCaseStudy ||
    existingCaseStudy.id !== parsedInput.data.caseStudyId
  ) {
    return createActionErrorState(
      "That case study could not be found anymore. Refresh and try again.",
    );
  }

  const coverImageFile = isFileEntry(rawInput.coverImage)
    ? rawInput.coverImage
    : null;
  const coverImageAlt = normalizeStringEntry(rawInput.coverImageAlt).trim();
  const existingGalleryEntries = buildExistingGalleryImageAltEntries({
    alts: rawInput.existingGalleryAlts,
    urls: rawInput.existingGalleryUrls,
  });
  const keptExistingGalleryUrlSet = new Set(
    rawInput.keptGalleryUrls
      .map((entry) => normalizeStringEntry(entry).trim())
      .filter(Boolean),
  );
  const keptExistingGalleryEntries = existingGalleryEntries.filter((entry) =>
    keptExistingGalleryUrlSet.has(entry.url),
  );
  const galleryImageUploads = rawInput.galleryImages
    .map((entry, index) => ({
      alt: normalizeStringEntry(rawInput.galleryImageAlts[index]).trim(),
      file: isFileEntry(entry) ? entry : null,
    }))
    .filter((entry): entry is { alt: string; file: File } =>
      Boolean(entry.file),
    );
  const uploadedObjectPaths: string[] = [];

  if (coverImageAlt.length > CASE_STUDY_IMAGE_ALT_MAX_LENGTH) {
    return createActionErrorState(
      "Check the highlighted fields and try again.",
      {
        coverImageAlt: `Keep alt text under ${CASE_STUDY_IMAGE_ALT_MAX_LENGTH} characters.`,
      },
    );
  }

  if (
    existingGalleryEntries.some(
      (entry) => entry.alt.length > CASE_STUDY_IMAGE_ALT_MAX_LENGTH,
    ) ||
    galleryImageUploads.some(
      (entry) => entry.alt.length > CASE_STUDY_IMAGE_ALT_MAX_LENGTH,
    )
  ) {
    return createActionErrorState(
      "Check the highlighted fields and try again.",
      {
        galleryImageAlts: `Keep each gallery alt text entry under ${CASE_STUDY_IMAGE_ALT_MAX_LENGTH} characters.`,
      },
    );
  }

  try {
    const keepsExistingCoverImage =
      Boolean(existingCaseStudy.coverImage) &&
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

    if (keptExistingGalleryEntries.some((entry) => !entry.alt)) {
      return createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          galleryImageAlts:
            "Enter alt text for each gallery image you keep attached.",
        },
      );
    }

    if (galleryImageUploads.some((entry) => !entry.alt)) {
      return createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          galleryImageAlts: "Enter alt text for each gallery image upload.",
        },
      );
    }

    let nextCoverImageUrl =
      parsedInput.data.removeCoverImage && !coverImageFile
        ? null
        : (existingCaseStudy.coverImage?.src ?? null);

    if (coverImageFile) {
      const uploadResult = await uploadCaseStudyImage({
        altText: coverImageAlt,
        file: coverImageFile,
        kind: "cover",
        slug: normalizedInput.payload.slug,
      });

      uploadedObjectPaths.push(uploadResult.objectPath);
      nextCoverImageUrl = uploadResult.publicUrl;
    }

    const uploadedGalleryUrls: string[] = [];

    for (const entry of galleryImageUploads) {
      const uploadResult = await uploadCaseStudyImage({
        altText: entry.alt,
        file: entry.file,
        kind: "gallery",
        slug: normalizedInput.payload.slug,
      });

      uploadedObjectPaths.push(uploadResult.objectPath);
      uploadedGalleryUrls.push(uploadResult.publicUrl);
    }

    if (keepsExistingCoverImage && existingCaseStudy.coverImage?.src) {
      await syncCaseStudyImageAltText({
        altText: coverImageAlt,
        publicUrl: existingCaseStudy.coverImage.src,
      });
    }

    await Promise.all(
      keptExistingGalleryEntries.map((entry) =>
        syncCaseStudyImageAltText({
          altText: entry.alt,
          publicUrl: entry.url,
        }),
      ),
    );

    const nextGalleryUrls = [
      ...keptExistingGalleryEntries.map((entry) => entry.url),
      ...uploadedGalleryUrls,
    ];
    const nextPublishedAt = buildPublishedAtValue({
      currentPublishedAt: existingCaseStudy.publishedAt,
      nextPublished: normalizedInput.payload.published,
    });
    const updatePayload: Database["public"]["Tables"]["case_studies"]["Update"] =
      {
        approach: normalizedInput.payload.approach,
        challenge: normalizedInput.payload.challenge,
        client_name: normalizedInput.payload.clientName,
        cover_image_url: nextCoverImageUrl,
        gallery_urls: nextGalleryUrls,
        industry: normalizedInput.payload.industry,
        outcomes: normalizedInput.payload.outcomes,
        outcomes_metrics:
          metricsResult.rows.length > 0
            ? (normalizedInput.payload.metrics as Json)
            : {},
        published: normalizedInput.payload.published,
        published_at: nextPublishedAt,
        seo_description: normalizedInput.payload.seoDescription,
        seo_title: normalizedInput.payload.seoTitle,
        services: normalizedInput.payload.services,
        slug: normalizedInput.payload.slug,
        title: normalizedInput.payload.title,
      };
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("case_studies")
      .update(updatePayload)
      .eq("id", parsedInput.data.caseStudyId)
      .select("slug")
      .maybeSingle();

    if (error || !data) {
      await deleteManagedCaseStudyObjects(uploadedObjectPaths).catch(
        (cleanupError) => {
          console.error(
            "Admin case study upload cleanup failed after update error",
            cleanupError,
          );
        },
      );

      console.error("Admin case study update failed", {
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        message: error?.message,
        caseStudyId: parsedInput.data.caseStudyId,
        slug: normalizedInput.payload.slug,
      });

      return createActionErrorState(
        "The case study changes could not be saved right now. Try again.",
      );
    }

    const galleryUrlsToDelete = existingCaseStudy.galleryImages
      .map((image) => image.src)
      .filter((url) => !keptExistingGalleryUrlSet.has(url))
      .map(extractManagedCaseStudyObjectPathFromUrl)
      .filter((value): value is string => Boolean(value));
    const coverUrlToDelete =
      existingCaseStudy.coverImage?.src &&
      (parsedInput.data.removeCoverImage || Boolean(coverImageFile))
        ? extractManagedCaseStudyObjectPathFromUrl(
            existingCaseStudy.coverImage.src,
          )
        : null;
    const objectPathsToDelete = [
      ...galleryUrlsToDelete,
      ...(coverUrlToDelete ? [coverUrlToDelete] : []),
    ];

    if (objectPathsToDelete.length) {
      await deleteManagedCaseStudyObjects(objectPathsToDelete).catch(
        (cleanupError) => {
          console.error(
            "Admin case study cleanup failed after save",
            cleanupError,
          );
        },
      );
    }

    revalidateWorkRoutes(currentSlug);

    if (normalizedInput.payload.slug !== currentSlug) {
      revalidateWorkRoutes(normalizedInput.payload.slug);
    }

    return createActionSuccessState({
      message: "Case study changes saved. Refreshing the editor.",
      redirectTo: `/admin/work/${normalizedInput.payload.slug}?status=saved`,
    });
  } catch (error) {
    await deleteManagedCaseStudyObjects(uploadedObjectPaths).catch(
      (cleanupError) => {
        console.error(
          "Admin case study upload cleanup failed after exception",
          cleanupError,
        );
      },
    );

    const message =
      error instanceof Error
        ? error.message
        : "The case study changes could not be saved right now. Try again.";
    const fieldErrors: AdminCaseStudyEditorFieldErrors = {};

    if (message.includes("image")) {
      fieldErrors.coverImage = message;
    }

    console.error("Admin case study update threw an unexpected error", error);

    return createActionErrorState(
      message === "Invalid image upload."
        ? "Check the highlighted fields and try again."
        : message,
      fieldErrors,
    );
  }
}
