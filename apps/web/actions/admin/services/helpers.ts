import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  buildAdminReturnPath,
  buildZodFieldErrors,
  createEditorActionStateBuilders,
  normalizeKebabSlug,
  normalizeLineSeparatedEntries,
  normalizeOptionalText,
} from "@/actions/admin/shared/helpers";
export {
  normalizeLineSeparatedEntries,
  normalizeOptionalText,
  normalizeStringEntry,
} from "@/actions/admin/shared/helpers";
import type {
  AdminServiceEditorFieldErrors,
  AdminServiceEditorState,
} from "@/interfaces/admin/service-editor";
import type { Database } from "@/lib/supabase/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  reservedServiceSlugs,
  SERVICE_DELIVERABLE_LIMIT,
  SERVICE_DELIVERABLE_MAX_LENGTH,
  type ServiceEditorInput,
  type ServiceUpdateInput,
} from "./schemas";

const serviceActionStateBuilders = createEditorActionStateBuilders<
  AdminServiceEditorFieldErrors,
  AdminServiceEditorState
>();

export const createActionErrorState =
  serviceActionStateBuilders.createActionErrorState;
export const createActionSuccessState =
  serviceActionStateBuilders.createActionSuccessState;

export function readServiceEditorFormData(formData: FormData) {
  return {
    contentMd: formData.get("contentMd"),
    currentSlug: formData.get("currentSlug"),
    deliverables: formData.get("deliverables"),
    published: formData.has("published"),
    seoDescription: formData.get("seoDescription"),
    seoTitle: formData.get("seoTitle"),
    serviceId: formData.get("serviceId"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    title: formData.get("title"),
  };
}

export function buildServiceEditorFieldErrors(
  error: z.ZodError<ServiceEditorInput | ServiceUpdateInput>,
): AdminServiceEditorFieldErrors {
  return buildZodFieldErrors({
    error,
    ignoredFields: ["serviceId", "currentSlug"],
  });
}

export function normalizeDeliverables(value?: string) {
  const normalizedEntries = normalizeLineSeparatedEntries({
    itemLimit: SERVICE_DELIVERABLE_LIMIT,
    itemMaxLength: SERVICE_DELIVERABLE_MAX_LENGTH,
    limitErrorMessage: `Keep the deliverables list to ${SERVICE_DELIVERABLE_LIMIT} items or fewer.`,
    maxLengthErrorMessage: `Each deliverable must stay under ${SERVICE_DELIVERABLE_MAX_LENGTH} characters.`,
    value,
  });

  if (normalizedEntries.error) {
    return {
      deliverables: [] as string[],
      error: normalizedEntries.error,
    };
  }

  return {
    deliverables: normalizedEntries.items,
    error: null,
  };
}

export function buildServicesReturnPath(input?: {
  query?: string;
  status?: string;
}) {
  return buildAdminReturnPath({
    basePath: "/admin/services",
    params: [
      { key: "q", value: input?.query },
      { key: "status", value: input?.status },
    ],
  });
}

export function getServiceSearchText(service: {
  deliverables: string[] | null;
  slug: string;
  summary: string | null;
  title: string;
}) {
  return [
    service.title,
    service.slug,
    service.summary,
    service.deliverables?.join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function revalidateServiceRoutes(slugs: string | string[]) {
  const slugList = Array.isArray(slugs) ? slugs : [slugs];

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/admin/services");
  revalidatePath("/admin/services/new");

  for (const slug of new Set(slugList.filter(Boolean))) {
    revalidatePath(`/services/${slug}`);
    revalidatePath(`/admin/services/${slug}`);
  }
}

export async function ensureUniqueServiceSlug(input: {
  serviceId?: string;
  slug: string;
}) {
  "use server";
  const supabase = await createServerSupabaseClient();
  let query = supabase.from("services").select("id").eq("slug", input.slug);

  if (input.serviceId) {
    query = query.neq("id", input.serviceId);
  }

  const { data, error } = await query.limit(1).maybeSingle();

  if (error) {
    throw new Error("Could not validate the service slug.");
  }

  return Boolean(data);
}

export async function getNextServiceOrderIndex() {
  "use server";
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("services")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error("Could not determine the next service order.");
  }

  return (data?.order_index ?? -1) + 1;
}

export function buildNormalizedServicePayload(input: ServiceEditorInput) {
  const derivedSlugSource = input.slug?.trim() || input.title;
  const normalizedSlug = normalizeKebabSlug(derivedSlugSource);

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

  if (reservedServiceSlugs.has(normalizedSlug)) {
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

  const normalizedDeliverables = normalizeDeliverables(input.deliverables);

  if (normalizedDeliverables.error) {
    return {
      errorState: createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          deliverables: normalizedDeliverables.error,
        },
      ),
      payload: null,
    };
  }

  return {
    errorState: null,
    payload: {
      contentMd: normalizeOptionalText(input.contentMd),
      deliverables: normalizedDeliverables.deliverables,
      published: input.published,
      seoDescription: normalizeOptionalText(input.seoDescription),
      seoTitle: normalizeOptionalText(input.seoTitle),
      slug: normalizedSlug,
      summary: normalizeOptionalText(input.summary),
      title: input.title.trim(),
    } satisfies {
      contentMd: string | null;
      deliverables: string[];
      published: boolean;
      seoDescription: string | null;
      seoTitle: string | null;
      slug: string;
      summary: string | null;
      title: string;
    },
  };
}

export type ServiceInsertPayload =
  Database["public"]["Tables"]["services"]["Insert"];
export type ServiceUpdatePayload =
  Database["public"]["Tables"]["services"]["Update"];
