import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import {
  type AdminCaseStudyEditorFieldErrors,
  type AdminCaseStudyEditorRecord,
  type AdminCaseStudyEditorState,
  type AdminCaseStudyMetricRow,
} from "@/lib/admin/work-editor";
import { publicEnv } from "@/lib/env/public";
import type { Database, Json } from "@/lib/supabase/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  buildStorageObjectPath,
  getPublicStorageObjectUrl,
  isValidStorageObjectPath,
  storageBuckets,
  validateStorageUploadInput,
} from "@/lib/supabase/storage";

const returnQuerySchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : ""),
  z.string().max(200),
);

const publishedFilterSchema = z.enum(["all", "published", "draft"]);

const publishActionSchema = z.object({
  caseStudyId: z.string().uuid(),
  currentPublished: z.enum(["true", "false"]),
  industryFilter: returnQuerySchema,
  publishedFilter: publishedFilterSchema,
  slug: z.string().trim().min(1).max(200),
});

const CASE_STUDY_TITLE_MAX_LENGTH = 140;
const CASE_STUDY_SLUG_MAX_LENGTH = 160;
const CASE_STUDY_CLIENT_MAX_LENGTH = 120;
const CASE_STUDY_INDUSTRY_MAX_LENGTH = 120;
const CASE_STUDY_TEXT_MAX_LENGTH = 5000;
const CASE_STUDY_OUTCOMES_MAX_LENGTH = 4000;
const CASE_STUDY_SERVICES_LIMIT = 12;
const CASE_STUDY_SERVICE_MAX_LENGTH = 120;
const CASE_STUDY_METRICS_LIMIT = 12;
const CASE_STUDY_METRIC_LABEL_MAX_LENGTH = 80;
const CASE_STUDY_METRIC_VALUE_MAX_LENGTH = 120;
const SEO_TITLE_MAX_LENGTH = 70;
const SEO_DESCRIPTION_MAX_LENGTH = 160;

const reservedCaseStudySlugs = new Set(["new"]);
const caseStudyBucketId = storageBuckets.caseStudies.id;

const optionalCaseStudyString = (maxLength: number) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().max(maxLength).optional(),
  );

const caseStudyEditorSchema = z.object({
  approach: optionalCaseStudyString(CASE_STUDY_TEXT_MAX_LENGTH),
  challenge: optionalCaseStudyString(CASE_STUDY_TEXT_MAX_LENGTH),
  clientName: optionalCaseStudyString(CASE_STUDY_CLIENT_MAX_LENGTH),
  currentSlug: z.string().trim().min(1).max(CASE_STUDY_SLUG_MAX_LENGTH),
  industry: optionalCaseStudyString(CASE_STUDY_INDUSTRY_MAX_LENGTH),
  outcomes: optionalCaseStudyString(CASE_STUDY_OUTCOMES_MAX_LENGTH),
  published: z.boolean(),
  removeCoverImage: z.boolean(),
  seoDescription: optionalCaseStudyString(SEO_DESCRIPTION_MAX_LENGTH),
  seoTitle: optionalCaseStudyString(SEO_TITLE_MAX_LENGTH),
  serviceLines: optionalCaseStudyString(
    CASE_STUDY_SERVICES_LIMIT * (CASE_STUDY_SERVICE_MAX_LENGTH + 1),
  ),
  caseStudyId: z.string().uuid(),
  slug: optionalCaseStudyString(CASE_STUDY_SLUG_MAX_LENGTH),
  title: z
    .string()
    .trim()
    .min(2, "Enter a case study title.")
    .max(
      CASE_STUDY_TITLE_MAX_LENGTH,
      `Keep the title under ${CASE_STUDY_TITLE_MAX_LENGTH} characters.`,
    ),
});

type CaseStudyEditorInput = z.infer<typeof caseStudyEditorSchema>;

export interface AdminCaseStudyListItem {
  clientName: string | null;
  coverImageUrl: string | null;
  galleryCount: number;
  id: string;
  industry: string | null;
  published: boolean;
  slug: string;
  title: string;
  updatedAt: string;
}

export interface AdminCaseStudiesListData {
  caseStudies: AdminCaseStudyListItem[];
  draftCount: number;
  filteredCount: number;
  industries: string[];
  publishedCount: number;
  selectedIndustry: string;
  selectedPublishedFilter: "all" | "published" | "draft";
  totalCount: number;
}

function createActionErrorState(
  message: string,
  fieldErrors: AdminCaseStudyEditorFieldErrors = {},
): AdminCaseStudyEditorState {
  return {
    fieldErrors,
    message,
    redirectTo: null,
    status: "error",
  };
}

function createActionSuccessState(input: {
  message: string;
  redirectTo: string;
}): AdminCaseStudyEditorState {
  return {
    fieldErrors: {},
    message: input.message,
    redirectTo: input.redirectTo,
    status: "success",
  };
}

function buildWorkReturnPath(input?: {
  industry?: string;
  publishedFilter?: "all" | "published" | "draft";
  status?: string;
}) {
  const searchParams = new URLSearchParams();

  if (input?.publishedFilter && input.publishedFilter !== "all") {
    searchParams.set("published", input.publishedFilter);
  }

  if (input?.industry) {
    searchParams.set("industry", input.industry);
  }

  if (input?.status) {
    searchParams.set("status", input.status);
  }

  const queryString = searchParams.toString();

  return queryString ? `/admin/work?${queryString}` : "/admin/work";
}

function revalidateWorkRoutes(slug: string) {
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath(`/work/${slug}`);
  revalidatePath("/admin/work");
  revalidatePath(`/admin/work/${slug}`);
}

function normalizeStringEntry(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function normalizeOptionalText(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizeCaseStudySlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeLines(input: {
  itemLimit: number;
  itemMaxLength: number;
  value?: string;
}) {
  const items = (input.value ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (items.length > input.itemLimit) {
    return {
      error: `Keep this list to ${input.itemLimit} items or fewer.`,
      items: [] as string[],
    };
  }

  const tooLongItem = items.find((item) => item.length > input.itemMaxLength);

  if (tooLongItem) {
    return {
      error: `Each entry must stay under ${input.itemMaxLength} characters.`,
      items: [] as string[],
    };
  }

  return {
    error: null,
    items,
  };
}

function normalizeMetricsRows(input: {
  labels: FormDataEntryValue[];
  values: FormDataEntryValue[];
}) {
  const rows: AdminCaseStudyMetricRow[] = [];
  const labels = input.labels.map((entry) =>
    normalizeStringEntry(entry).trim(),
  );
  const values = input.values.map((entry) =>
    normalizeStringEntry(entry).trim(),
  );
  const rowCount = Math.max(labels.length, values.length);
  const seenLabels = new Set<string>();

  if (rowCount > CASE_STUDY_METRICS_LIMIT) {
    return {
      error: `Keep the metrics list to ${CASE_STUDY_METRICS_LIMIT} rows or fewer.`,
      metrics: null as Record<string, string> | null,
      rows,
    };
  }

  for (let index = 0; index < rowCount; index += 1) {
    const label = labels[index] ?? "";
    const value = values[index] ?? "";

    if (!label && !value) {
      continue;
    }

    if (!label || !value) {
      return {
        error: "Each metric row needs both a label and a value.",
        metrics: null,
        rows,
      };
    }

    if (label.length > CASE_STUDY_METRIC_LABEL_MAX_LENGTH) {
      return {
        error: `Metric labels must stay under ${CASE_STUDY_METRIC_LABEL_MAX_LENGTH} characters.`,
        metrics: null,
        rows,
      };
    }

    if (value.length > CASE_STUDY_METRIC_VALUE_MAX_LENGTH) {
      return {
        error: `Metric values must stay under ${CASE_STUDY_METRIC_VALUE_MAX_LENGTH} characters.`,
        metrics: null,
        rows,
      };
    }

    const normalizedLabel = label.toLowerCase();

    if (seenLabels.has(normalizedLabel)) {
      return {
        error: "Metric labels must be unique.",
        metrics: null,
        rows,
      };
    }

    seenLabels.add(normalizedLabel);
    rows.push({ label, value });
  }

  return {
    error: null,
    metrics: Object.fromEntries(
      rows.map((row) => [row.label, row.value]),
    ) as Record<string, string>,
    rows,
  };
}

function buildCaseStudyEditorFieldErrors(
  error: z.ZodError<CaseStudyEditorInput>,
): AdminCaseStudyEditorFieldErrors {
  const fieldErrors: AdminCaseStudyEditorFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (
      typeof field === "string" &&
      field !== "caseStudyId" &&
      field !== "currentSlug" &&
      field !== "removeCoverImage" &&
      !fieldErrors[field as keyof AdminCaseStudyEditorFieldErrors]
    ) {
      if (field === "serviceLines") {
        fieldErrors.services = issue.message;
      } else {
        fieldErrors[field as keyof AdminCaseStudyEditorFieldErrors] =
          issue.message;
      }
    }
  }

  return fieldErrors;
}

function readCaseStudyEditorFormData(formData: FormData) {
  return {
    approach: formData.get("approach"),
    caseStudyId: formData.get("caseStudyId"),
    challenge: formData.get("challenge"),
    clientName: formData.get("clientName"),
    coverImage: formData.get("coverImage"),
    currentSlug: formData.get("currentSlug"),
    existingGalleryUrls: formData.getAll("existingGalleryUrl"),
    galleryImages: formData.getAll("galleryImages"),
    industry: formData.get("industry"),
    metricLabels: formData.getAll("metricLabel"),
    metricValues: formData.getAll("metricValue"),
    outcomes: formData.get("outcomes"),
    published: formData.has("published"),
    removeCoverImage: formData.has("removeCoverImage"),
    seoDescription: formData.get("seoDescription"),
    seoTitle: formData.get("seoTitle"),
    serviceLines: formData.get("services"),
    slug: formData.get("slug"),
    title: formData.get("title"),
  };
}

function buildEditorMetricsRows(value: Json | null): AdminCaseStudyMetricRow[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  return Object.entries(value as Record<string, unknown>)
    .filter((entry): entry is [string, string] => typeof entry[1] === "string")
    .map(([label, value]) => ({ label, value }));
}

function isFileEntry(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0 && Boolean(value.name);
}

function buildUniqueStorageFileName(fileName: string) {
  return `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${fileName}`;
}

async function ensureUniqueCaseStudySlug(input: {
  caseStudyId: string;
  slug: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select("id")
    .eq("slug", input.slug)
    .neq("id", input.caseStudyId)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error("Could not validate the case study slug.");
  }

  return Boolean(data);
}

function extractManagedCaseStudyObjectPathFromUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const supabaseUrl = new URL(publicEnv.supabaseUrl);

    if (
      parsedUrl.protocol !== supabaseUrl.protocol ||
      parsedUrl.hostname !== supabaseUrl.hostname ||
      parsedUrl.port !== supabaseUrl.port
    ) {
      return null;
    }

    const expectedPrefix = `/storage/v1/object/public/${caseStudyBucketId}/`;

    if (!parsedUrl.pathname.startsWith(expectedPrefix)) {
      return null;
    }

    const objectPath = decodeURIComponent(
      parsedUrl.pathname.slice(expectedPrefix.length),
    );

    return isValidStorageObjectPath(caseStudyBucketId, objectPath)
      ? objectPath
      : null;
  } catch {
    return null;
  }
}

async function deleteManagedCaseStudyObjects(objectPaths: string[]) {
  const uniquePaths = Array.from(new Set(objectPaths.filter(Boolean)));

  if (!uniquePaths.length) {
    return;
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.storage
    .from(caseStudyBucketId)
    .remove(uniquePaths);

  if (error) {
    throw error;
  }
}

async function uploadCaseStudyImage(input: {
  file: File;
  kind: "cover" | "gallery";
  slug: string;
}) {
  const objectPath = buildStorageObjectPath({
    bucketId: caseStudyBucketId,
    fileName: buildUniqueStorageFileName(input.file.name),
    kind: input.kind,
    slug: input.slug,
  });
  const validationResult = validateStorageUploadInput({
    bucketId: caseStudyBucketId,
    contentType: input.file.type,
    fileSizeBytes: input.file.size,
    objectPath,
  });

  if (!validationResult.isValid) {
    throw new Error(validationResult.issues[0] ?? "Invalid image upload.");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.storage
    .from(caseStudyBucketId)
    .upload(objectPath, input.file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return {
    objectPath,
    publicUrl: getPublicStorageObjectUrl(
      supabase,
      caseStudyBucketId,
      objectPath,
    ),
  };
}

function buildPublishedAtValue(input: {
  currentPublishedAt: string | null;
  nextPublished: boolean;
}) {
  if (!input.nextPublished) {
    return null;
  }

  return input.currentPublishedAt ?? new Date().toISOString();
}

export async function getAdminCaseStudiesListData(input?: {
  industry?: string;
  publishedFilter?: string;
}): Promise<AdminCaseStudiesListData> {
  await requireCurrentAdminAccess("/admin/work");

  const selectedPublishedFilter = publishedFilterSchema.safeParse(
    input?.publishedFilter,
  ).success
    ? (input?.publishedFilter as "all" | "published" | "draft")
    : "all";
  const selectedIndustry = input?.industry?.trim() ?? "";
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select(
      "client_name, cover_image_url, gallery_urls, id, industry, published, published_at, slug, title, updated_at",
    )
    .order("published", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error("Could not load admin case studies list.");
  }

  const allCaseStudies = (data ?? []).map((caseStudy) => ({
    clientName: caseStudy.client_name,
    coverImageUrl: caseStudy.cover_image_url,
    galleryCount: caseStudy.gallery_urls?.length ?? 0,
    id: caseStudy.id,
    industry: caseStudy.industry,
    published: caseStudy.published,
    publishedAt: caseStudy.published_at,
    slug: caseStudy.slug,
    title: caseStudy.title,
    updatedAt: caseStudy.updated_at,
  }));

  const industries = Array.from(
    new Set(
      allCaseStudies
        .map((caseStudy) => caseStudy.industry?.trim() ?? "")
        .filter(Boolean),
    ),
  ).sort((left, right) =>
    left.localeCompare(right, "en", { sensitivity: "base" }),
  );

  const caseStudies = allCaseStudies.filter((caseStudy) => {
    const publishedMatches =
      selectedPublishedFilter === "all"
        ? true
        : selectedPublishedFilter === "published"
          ? caseStudy.published
          : !caseStudy.published;
    const industryMatches = selectedIndustry
      ? caseStudy.industry?.trim() === selectedIndustry
      : true;

    return publishedMatches && industryMatches;
  });

  return {
    caseStudies,
    draftCount: allCaseStudies.filter((caseStudy) => !caseStudy.published)
      .length,
    filteredCount: caseStudies.length,
    industries,
    publishedCount: allCaseStudies.filter((caseStudy) => caseStudy.published)
      .length,
    selectedIndustry,
    selectedPublishedFilter,
    totalCount: allCaseStudies.length,
  };
}

export async function getAdminCaseStudyBySlug(
  slug: string,
): Promise<AdminCaseStudyEditorRecord | null> {
  await requireCurrentAdminAccess(`/admin/work/${slug}`);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select(
      "approach, challenge, client_name, cover_image_url, gallery_urls, id, industry, outcomes, outcomes_metrics, published, published_at, seo_description, seo_title, services, slug, title, updated_at",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    approach: data.approach ?? "",
    challenge: data.challenge ?? "",
    clientName: data.client_name ?? "",
    coverImageUrl: data.cover_image_url,
    galleryUrls: data.gallery_urls ?? [],
    id: data.id,
    industry: data.industry ?? "",
    metrics: buildEditorMetricsRows(data.outcomes_metrics),
    outcomes: data.outcomes ?? "",
    published: data.published,
    publishedAt: data.published_at,
    seoDescription: data.seo_description ?? "",
    seoTitle: data.seo_title ?? "",
    services: data.services ?? [],
    slug: data.slug,
    title: data.title,
    updatedAt: data.updated_at,
  };
}

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

  const parsedInput = caseStudyEditorSchema.safeParse({
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

  const servicesResult = normalizeLines({
    itemLimit: CASE_STUDY_SERVICES_LIMIT,
    itemMaxLength: CASE_STUDY_SERVICE_MAX_LENGTH,
    value: parsedInput.data.serviceLines,
  });

  if (servicesResult.error) {
    return createActionErrorState(
      "Check the highlighted fields and try again.",
      {
        services: servicesResult.error,
      },
    );
  }

  const metricsResult = normalizeMetricsRows({
    labels: rawInput.metricLabels,
    values: rawInput.metricValues,
  });

  if (metricsResult.error) {
    return createActionErrorState(
      "Check the highlighted fields and try again.",
      {
        metrics: metricsResult.error,
      },
    );
  }

  const normalizedSlug = normalizeCaseStudySlug(
    parsedInput.data.slug?.trim() || parsedInput.data.title,
  );

  if (!normalizedSlug) {
    return createActionErrorState(
      "Check the highlighted fields and try again.",
      {
        slug: "Enter a slug or title that can be converted into a route segment.",
      },
    );
  }

  if (reservedCaseStudySlugs.has(normalizedSlug)) {
    return createActionErrorState(
      "Check the highlighted fields and try again.",
      {
        slug: "This slug is reserved for an internal admin route.",
      },
    );
  }

  try {
    const slugExists = await ensureUniqueCaseStudySlug({
      caseStudyId: parsedInput.data.caseStudyId,
      slug: normalizedSlug,
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
        slug: normalizedSlug,
      });

      uploadedObjectPaths.push(uploadResult.objectPath);
      nextCoverImageUrl = uploadResult.publicUrl;
    }

    const uploadedGalleryUrls: string[] = [];

    for (const file of galleryImageFiles) {
      const uploadResult = await uploadCaseStudyImage({
        file,
        kind: "gallery",
        slug: normalizedSlug,
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
      nextPublished: parsedInput.data.published,
    });
    const updatePayload: Database["public"]["Tables"]["case_studies"]["Update"] =
      {
        approach: normalizeOptionalText(parsedInput.data.approach),
        challenge: normalizeOptionalText(parsedInput.data.challenge),
        client_name: normalizeOptionalText(parsedInput.data.clientName),
        cover_image_url: nextCoverImageUrl,
        gallery_urls: nextGalleryUrls,
        industry: normalizeOptionalText(parsedInput.data.industry),
        outcomes: normalizeOptionalText(parsedInput.data.outcomes),
        outcomes_metrics:
          metricsResult.rows.length > 0 ? (metricsResult.metrics as Json) : {},
        published: parsedInput.data.published,
        published_at: nextPublishedAt,
        seo_description: normalizeOptionalText(parsedInput.data.seoDescription),
        seo_title: normalizeOptionalText(parsedInput.data.seoTitle),
        services: servicesResult.items,
        slug: normalizedSlug,
        title: parsedInput.data.title.trim(),
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
        slug: normalizedSlug,
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

    if (normalizedSlug !== currentSlug) {
      revalidateWorkRoutes(normalizedSlug);
    }

    return createActionSuccessState({
      message: "Case study changes saved. Refreshing the editor.",
      redirectTo: `/admin/work/${normalizedSlug}?status=saved`,
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

export async function toggleAdminCaseStudyPublished(formData: FormData) {
  "use server";

  await requireCurrentAdminAccess("/admin/work");

  const parsedInput = publishActionSchema.safeParse({
    caseStudyId: formData.get("caseStudyId"),
    currentPublished: formData.get("currentPublished"),
    industryFilter: formData.get("industryFilter"),
    publishedFilter: formData.get("publishedFilter"),
    slug: formData.get("slug"),
  });

  if (!parsedInput.success) {
    redirect(buildWorkReturnPath({ status: "invalid-action" }));
  }

  const {
    caseStudyId,
    currentPublished,
    industryFilter,
    publishedFilter,
    slug,
  } = parsedInput.data;
  const nextPublished = currentPublished !== "true";
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("case_studies")
    .update({
      published: nextPublished,
      published_at: nextPublished ? new Date().toISOString() : null,
    })
    .eq("id", caseStudyId);

  if (error) {
    redirect(
      buildWorkReturnPath({
        industry: industryFilter,
        publishedFilter,
        status: "update-error",
      }),
    );
  }

  revalidateWorkRoutes(slug);

  redirect(
    buildWorkReturnPath({
      industry: industryFilter,
      publishedFilter,
      status: "publish-updated",
    }),
  );
}
