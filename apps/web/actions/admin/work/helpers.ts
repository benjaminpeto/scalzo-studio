import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  buildAdminReturnPath,
  buildZodFieldErrors,
  createEditorActionStateBuilders,
  normalizeKebabSlug,
  normalizeLineSeparatedEntries,
  normalizeOptionalText,
  normalizeStringEntry,
} from "@/actions/admin/shared/helpers";
export {
  isFileEntry,
  normalizeLineSeparatedEntries,
  normalizeOptionalText,
  normalizeStringEntry,
} from "@/actions/admin/shared/helpers";
import type {
  AdminCaseStudyEditorFieldErrors,
  AdminCaseStudyEditorState,
  AdminCaseStudyMetricRow,
} from "@/interfaces/admin/work-editor";
import type { Json } from "@/lib/supabase/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  CASE_STUDY_METRIC_LABEL_MAX_LENGTH,
  CASE_STUDY_METRICS_LIMIT,
  CASE_STUDY_METRIC_VALUE_MAX_LENGTH,
  CASE_STUDY_SERVICE_MAX_LENGTH,
  CASE_STUDY_SERVICES_LIMIT,
  type CaseStudyCreateInput,
  type CaseStudyUpdateInput,
  reservedCaseStudySlugs,
} from "./schemas";

const caseStudyActionStateBuilders = createEditorActionStateBuilders<
  AdminCaseStudyEditorFieldErrors,
  AdminCaseStudyEditorState
>();

export const createActionErrorState =
  caseStudyActionStateBuilders.createActionErrorState;
export const createActionSuccessState =
  caseStudyActionStateBuilders.createActionSuccessState;

export function buildWorkReturnPath(input?: {
  industry?: string;
  publishedFilter?: "all" | "published" | "draft";
  status?: string;
}) {
  return buildAdminReturnPath({
    basePath: "/admin/work",
    params: [
      {
        key: "published",
        value: input?.publishedFilter,
        valueToSkip: "all",
      },
      { key: "industry", value: input?.industry },
      { key: "status", value: input?.status },
    ],
  });
}

export function revalidateWorkRoutes(slug: string) {
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath(`/work/${slug}`);
  revalidatePath("/admin/work");
  revalidatePath("/admin/work/new");
  revalidatePath(`/admin/work/${slug}`);
}

export function normalizeLines(input: {
  itemLimit: number;
  itemMaxLength: number;
  value?: string;
}) {
  return normalizeLineSeparatedEntries(input);
}

export function normalizeMetricsRows(input: {
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

export function buildCaseStudyEditorFieldErrors(
  error: z.ZodError<CaseStudyCreateInput | CaseStudyUpdateInput>,
): AdminCaseStudyEditorFieldErrors {
  return buildZodFieldErrors({
    error,
    fieldAliases: {
      serviceLines: "services",
    },
    ignoredFields: ["caseStudyId", "currentSlug", "removeCoverImage"],
  });
}

export function readCaseStudyEditorFormData(formData: FormData) {
  return {
    approach: formData.get("approach"),
    caseStudyId: formData.get("caseStudyId"),
    challenge: formData.get("challenge"),
    clientName: formData.get("clientName"),
    coverImage: formData.get("coverImage"),
    coverImageAlt: formData.get("coverImageAlt"),
    currentSlug: formData.get("currentSlug"),
    existingGalleryUrls: formData.getAll("existingGalleryUrl"),
    existingGalleryAlts: formData.getAll("existingGalleryAlt"),
    galleryImageAlts: formData.getAll("galleryImageAlt"),
    galleryImages: formData.getAll("galleryImage"),
    industry: formData.get("industry"),
    keptGalleryUrls: formData.getAll("keptGalleryUrl"),
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

export function buildEditorMetricsRows(
  value: Json | null,
): AdminCaseStudyMetricRow[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  return Object.entries(value as Record<string, unknown>)
    .filter((entry): entry is [string, string] => typeof entry[1] === "string")
    .map(([label, value]) => ({ label, value }));
}

export async function ensureUniqueCaseStudySlug(input: {
  caseStudyId?: string;
  slug: string;
}) {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from("case_studies").select("id").eq("slug", input.slug);

  if (input.caseStudyId) {
    query = query.neq("id", input.caseStudyId);
  }

  const { data, error } = await query.limit(1).maybeSingle();

  if (error) {
    throw new Error("Could not validate the case study slug.");
  }

  return Boolean(data);
}

export function buildPublishedAtValue(input: {
  currentPublishedAt: string | null;
  nextPublished: boolean;
}) {
  if (!input.nextPublished) {
    return null;
  }

  return input.currentPublishedAt ?? new Date().toISOString();
}

export function buildNormalizedCaseStudyPayload(
  input: CaseStudyCreateInput | CaseStudyUpdateInput,
  metricsResult: ReturnType<typeof normalizeMetricsRows>,
) {
  const servicesResult = normalizeLines({
    itemLimit: CASE_STUDY_SERVICES_LIMIT,
    itemMaxLength: CASE_STUDY_SERVICE_MAX_LENGTH,
    value: input.serviceLines,
  });

  if (servicesResult.error) {
    return {
      errorState: createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          services: servicesResult.error,
        },
      ),
      payload: null,
    };
  }

  if (metricsResult.error) {
    return {
      errorState: createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          metrics: metricsResult.error,
        },
      ),
      payload: null,
    };
  }

  const normalizedSlug = normalizeKebabSlug(input.slug?.trim() || input.title);

  if (!normalizedSlug) {
    return {
      errorState: createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          slug: "Enter a slug or title that can be converted into a route segment.",
        },
      ),
      payload: null,
    };
  }

  if (reservedCaseStudySlugs.has(normalizedSlug)) {
    return {
      errorState: createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          slug: "This slug is reserved for an internal admin route.",
        },
      ),
      payload: null,
    };
  }

  return {
    errorState: null,
    payload: {
      approach: normalizeOptionalText(input.approach),
      challenge: normalizeOptionalText(input.challenge),
      clientName: normalizeOptionalText(input.clientName),
      industry: normalizeOptionalText(input.industry),
      metrics: metricsResult.metrics,
      outcomes: normalizeOptionalText(input.outcomes),
      published: input.published,
      seoDescription: normalizeOptionalText(input.seoDescription),
      seoTitle: normalizeOptionalText(input.seoTitle),
      services: servicesResult.items,
      slug: normalizedSlug,
      title: input.title.trim(),
    },
  };
}
