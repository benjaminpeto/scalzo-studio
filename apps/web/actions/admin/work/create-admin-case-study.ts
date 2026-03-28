import type { Database } from "@/lib/supabase/database.types";
import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type {
  AdminCaseStudyEditorFieldErrors,
  AdminCaseStudyEditorState,
} from "@/interfaces/admin/work-editor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  buildCaseStudyEditorFieldErrors,
  buildNormalizedCaseStudyPayload,
  buildPublishedAtValue,
  createActionErrorState,
  createActionSuccessState,
  deleteManagedCaseStudyObjects,
  ensureUniqueCaseStudySlug,
  isFileEntry,
  normalizeMetricsRows,
  normalizeStringEntry,
  readCaseStudyEditorFormData,
  revalidateWorkRoutes,
  uploadCaseStudyImage,
} from "./helpers";
import { caseStudyCreateSchema } from "./schemas";

export async function createAdminCaseStudy(
  _prevState: AdminCaseStudyEditorState,
  formData: FormData,
): Promise<AdminCaseStudyEditorState> {
  "use server";

  await requireCurrentAdminAccess("/admin/work/new");

  const rawInput = readCaseStudyEditorFormData(formData);
  const parsedInput = caseStudyCreateSchema.safeParse({
    approach: normalizeStringEntry(rawInput.approach),
    challenge: normalizeStringEntry(rawInput.challenge),
    clientName: normalizeStringEntry(rawInput.clientName),
    industry: normalizeStringEntry(rawInput.industry),
    outcomes: normalizeStringEntry(rawInput.outcomes),
    published: rawInput.published,
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

  const coverImageFile = isFileEntry(rawInput.coverImage)
    ? rawInput.coverImage
    : null;
  const galleryImageFiles = rawInput.galleryImages.filter(isFileEntry);
  const uploadedObjectPaths: string[] = [];

  try {
    const slugExists = await ensureUniqueCaseStudySlug({
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

    let coverImageUrl: string | null = null;

    if (coverImageFile) {
      const uploadResult = await uploadCaseStudyImage({
        file: coverImageFile,
        kind: "cover",
        slug: normalizedInput.payload.slug,
      });

      uploadedObjectPaths.push(uploadResult.objectPath);
      coverImageUrl = uploadResult.publicUrl;
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

    const insertPayload: Database["public"]["Tables"]["case_studies"]["Insert"] =
      {
        approach: normalizedInput.payload.approach,
        challenge: normalizedInput.payload.challenge,
        client_name: normalizedInput.payload.clientName,
        cover_image_url: coverImageUrl,
        gallery_urls: uploadedGalleryUrls,
        industry: normalizedInput.payload.industry,
        outcomes: normalizedInput.payload.outcomes,
        outcomes_metrics: normalizedInput.payload.metrics,
        published: normalizedInput.payload.published,
        published_at: buildPublishedAtValue({
          currentPublishedAt: null,
          nextPublished: normalizedInput.payload.published,
        }),
        seo_description: normalizedInput.payload.seoDescription,
        seo_title: normalizedInput.payload.seoTitle,
        services: normalizedInput.payload.services,
        slug: normalizedInput.payload.slug,
        title: normalizedInput.payload.title,
      };
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("case_studies").insert(insertPayload);

    if (error) {
      await deleteManagedCaseStudyObjects(uploadedObjectPaths).catch(
        (cleanupError) => {
          console.error(
            "Admin case study upload cleanup failed after create error",
            cleanupError,
          );
        },
      );

      console.error("Admin case study create failed", {
        code: error.code,
        details: error.details,
        hint: error.hint,
        message: error.message,
        slug: normalizedInput.payload.slug,
      });

      return createActionErrorState(
        "The case study could not be created right now. Try again.",
      );
    }

    revalidateWorkRoutes(normalizedInput.payload.slug);

    return createActionSuccessState({
      message: "Case study created. Redirecting to the editor.",
      redirectTo: `/admin/work/${normalizedInput.payload.slug}?status=created`,
    });
  } catch (error) {
    await deleteManagedCaseStudyObjects(uploadedObjectPaths).catch(
      (cleanupError) => {
        console.error(
          "Admin case study upload cleanup failed after create exception",
          cleanupError,
        );
      },
    );

    const message =
      error instanceof Error
        ? error.message
        : "The case study could not be created right now. Try again.";
    const fieldErrors: AdminCaseStudyEditorFieldErrors = {};

    if (message.includes("image")) {
      fieldErrors.coverImage = message;
      fieldErrors.galleryImages = message;
    }

    console.error("Admin case study create threw an unexpected error", error);

    return createActionErrorState(
      message === "Invalid image upload."
        ? "Check the highlighted fields and try again."
        : message,
      fieldErrors,
    );
  }
}
