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
  deleteManagedCaseStudyObjects,
  ensureUniqueCaseStudySlug,
  extractManagedCaseStudyObjectPathFromUrl,
  isFileEntry,
  normalizeMetricsRows,
  normalizeStringEntry,
  readCaseStudyEditorFormData,
  revalidateWorkRoutes,
  uploadCaseStudyImage,
} from "./helpers";
import { caseStudyUpdateSchema } from "./schemas";

export async function updateAdminCaseStudy(
  _prevState: AdminCaseStudyEditorState,
  formData: FormData,
): Promise<AdminCaseStudyEditorState> {
  "use server";

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
  const galleryImageFiles = rawInput.galleryImages.filter(isFileEntry);
  const keptExistingGalleryUrls = rawInput.existingGalleryUrls
    .map((entry) => normalizeStringEntry(entry).trim())
    .filter(Boolean);
  const uploadedObjectPaths: string[] = [];

  try {
    let nextCoverImageUrl =
      parsedInput.data.removeCoverImage && !coverImageFile
        ? null
        : existingCaseStudy.coverImageUrl;

    if (coverImageFile) {
      const uploadResult = await uploadCaseStudyImage({
        file: coverImageFile,
        kind: "cover",
        slug: normalizedInput.payload.slug,
      });

      uploadedObjectPaths.push(uploadResult.objectPath);
      nextCoverImageUrl = uploadResult.publicUrl;
    }

    const uploadedGalleryUrls: string[] = [];

    for (const file of galleryImageFiles) {
      const uploadResult = await uploadCaseStudyImage({
        file,
        kind: "gallery",
        slug: normalizedInput.payload.slug,
      });

      uploadedObjectPaths.push(uploadResult.objectPath);
      uploadedGalleryUrls.push(uploadResult.publicUrl);
    }

    const nextGalleryUrls = [
      ...keptExistingGalleryUrls,
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

    const galleryUrlsToDelete = existingCaseStudy.galleryUrls
      .filter((url) => !keptExistingGalleryUrls.includes(url))
      .map(extractManagedCaseStudyObjectPathFromUrl)
      .filter((value): value is string => Boolean(value));
    const coverUrlToDelete =
      existingCaseStudy.coverImageUrl &&
      (parsedInput.data.removeCoverImage || Boolean(coverImageFile))
        ? extractManagedCaseStudyObjectPathFromUrl(
            existingCaseStudy.coverImageUrl,
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
