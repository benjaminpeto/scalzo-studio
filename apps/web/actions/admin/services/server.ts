import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import {
  type AdminServiceEditorFieldErrors,
  type AdminServiceEditorRecord,
  type AdminServiceEditorState,
} from "@/lib/admin/service-editor";
import type { Database } from "@/lib/supabase/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const returnQuerySchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : ""),
  z.string().max(200),
);

const publishActionSchema = z.object({
  currentPublished: z.enum(["true", "false"]),
  searchQuery: returnQuerySchema,
  serviceId: z.string().uuid(),
  slug: z.string().trim().min(1).max(200),
});

const moveActionSchema = z.object({
  direction: z.enum(["up", "down"]),
  searchQuery: returnQuerySchema,
  serviceId: z.string().uuid(),
});

const SERVICE_TITLE_MAX_LENGTH = 140;
const SERVICE_SLUG_MAX_LENGTH = 160;
const SERVICE_SUMMARY_MAX_LENGTH = 320;
const SERVICE_CONTENT_MAX_LENGTH = 24000;
const SERVICE_DELIVERABLE_MAX_LENGTH = 160;
const SERVICE_DELIVERABLE_LIMIT = 24;
const SEO_TITLE_MAX_LENGTH = 70;
const SEO_DESCRIPTION_MAX_LENGTH = 160;

const reservedServiceSlugs = new Set(["new"]);

const optionalServiceString = (maxLength: number) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().max(maxLength).optional(),
  );

const serviceEditorSchema = z.object({
  contentMd: optionalServiceString(SERVICE_CONTENT_MAX_LENGTH),
  deliverables: optionalServiceString(
    SERVICE_DELIVERABLE_LIMIT * (SERVICE_DELIVERABLE_MAX_LENGTH + 1),
  ),
  published: z.boolean(),
  seoDescription: optionalServiceString(SEO_DESCRIPTION_MAX_LENGTH),
  seoTitle: optionalServiceString(SEO_TITLE_MAX_LENGTH),
  slug: optionalServiceString(SERVICE_SLUG_MAX_LENGTH),
  summary: optionalServiceString(SERVICE_SUMMARY_MAX_LENGTH),
  title: z
    .string()
    .trim()
    .min(2, "Enter a service title.")
    .max(
      SERVICE_TITLE_MAX_LENGTH,
      `Keep the title under ${SERVICE_TITLE_MAX_LENGTH} characters.`,
    ),
});

const serviceUpdateSchema = serviceEditorSchema.extend({
  currentSlug: z.string().trim().min(1).max(SERVICE_SLUG_MAX_LENGTH),
  serviceId: z.string().uuid(),
});

type ServiceEditorInput = z.infer<typeof serviceEditorSchema>;
type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>;

export interface AdminServiceListItem {
  deliverablesCount: number;
  id: string;
  orderIndex: number;
  published: boolean;
  slug: string;
  summary: string | null;
  title: string;
  updatedAt: string;
}

export interface AdminServicesListData {
  draftCount: number;
  filteredCount: number;
  publishedCount: number;
  query: string;
  services: AdminServiceListItem[];
  totalCount: number;
}

function createActionErrorState(
  message: string,
  fieldErrors: AdminServiceEditorFieldErrors = {},
): AdminServiceEditorState {
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
}): AdminServiceEditorState {
  return {
    fieldErrors: {},
    message: input.message,
    redirectTo: input.redirectTo,
    status: "success",
  };
}

function normalizeStringEntry(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function readServiceEditorFormData(formData: FormData) {
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

function buildServiceEditorFieldErrors(
  error: z.ZodError<ServiceEditorInput | ServiceUpdateInput>,
): AdminServiceEditorFieldErrors {
  const fieldErrors: AdminServiceEditorFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (
      typeof field === "string" &&
      field !== "serviceId" &&
      field !== "currentSlug" &&
      !fieldErrors[field as keyof AdminServiceEditorFieldErrors]
    ) {
      fieldErrors[field as keyof AdminServiceEditorFieldErrors] = issue.message;
    }
  }

  return fieldErrors;
}

function normalizeServiceSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeOptionalText(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizeDeliverables(value?: string) {
  const deliverables = (value ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (deliverables.length > SERVICE_DELIVERABLE_LIMIT) {
    return {
      deliverables: [],
      error: `Keep the deliverables list to ${SERVICE_DELIVERABLE_LIMIT} items or fewer.`,
    };
  }

  const tooLongItem = deliverables.find(
    (item) => item.length > SERVICE_DELIVERABLE_MAX_LENGTH,
  );

  if (tooLongItem) {
    return {
      deliverables: [],
      error: `Each deliverable must stay under ${SERVICE_DELIVERABLE_MAX_LENGTH} characters.`,
    };
  }

  return {
    deliverables,
    error: null,
  };
}

function buildServicesReturnPath(input?: { query?: string; status?: string }) {
  const searchParams = new URLSearchParams();

  if (input?.query) {
    searchParams.set("q", input.query);
  }

  if (input?.status) {
    searchParams.set("status", input.status);
  }

  const queryString = searchParams.toString();

  return queryString ? `/admin/services?${queryString}` : "/admin/services";
}

function getServiceSearchText(service: {
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

function revalidateServiceRoutes(slugs: string | string[]) {
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

export async function getAdminServicesListData(
  rawQuery = "",
): Promise<AdminServicesListData> {
  await requireCurrentAdminAccess("/admin/services");

  const query = rawQuery.trim();
  const normalizedQuery = query.toLowerCase();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("services")
    .select(
      "deliverables, id, order_index, published, slug, summary, title, updated_at",
    )
    .order("order_index", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error("Could not load admin services list.");
  }

  const allServices = (data ?? []).map((service) => ({
    deliverablesCount: service.deliverables?.length ?? 0,
    id: service.id,
    orderIndex: service.order_index,
    published: service.published,
    searchText: getServiceSearchText({
      deliverables: service.deliverables,
      slug: service.slug,
      summary: service.summary,
      title: service.title,
    }),
    slug: service.slug,
    summary: service.summary,
    title: service.title,
    updatedAt: service.updated_at,
  }));

  const services = (
    normalizedQuery
      ? allServices.filter((service) =>
          service.searchText.includes(normalizedQuery),
        )
      : allServices
  ).map((service) => ({
    deliverablesCount: service.deliverablesCount,
    id: service.id,
    orderIndex: service.orderIndex,
    published: service.published,
    slug: service.slug,
    summary: service.summary,
    title: service.title,
    updatedAt: service.updatedAt,
  }));

  return {
    draftCount: allServices.filter((service) => !service.published).length,
    filteredCount: services.length,
    publishedCount: allServices.filter((service) => service.published).length,
    query,
    services,
    totalCount: allServices.length,
  };
}

export async function getAdminServiceBySlug(
  slug: string,
): Promise<AdminServiceEditorRecord | null> {
  await requireCurrentAdminAccess(`/admin/services/${slug}`);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("services")
    .select(
      "content_md, deliverables, id, order_index, published, seo_description, seo_title, slug, summary, title, updated_at",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    contentMd: data.content_md ?? "",
    deliverables: data.deliverables ?? [],
    id: data.id,
    orderIndex: data.order_index,
    published: data.published,
    seoDescription: data.seo_description ?? "",
    seoTitle: data.seo_title ?? "",
    slug: data.slug,
    summary: data.summary ?? "",
    title: data.title,
    updatedAt: data.updated_at,
  };
}

async function ensureUniqueServiceSlug(input: {
  serviceId?: string;
  slug: string;
}) {
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

async function getNextServiceOrderIndex() {
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

function buildNormalizedServicePayload(input: ServiceEditorInput) {
  const derivedSlugSource = input.slug?.trim() || input.title;
  const normalizedSlug = normalizeServiceSlug(derivedSlugSource);

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
    },
  };
}

export async function createAdminService(
  _prevState: AdminServiceEditorState,
  formData: FormData,
): Promise<AdminServiceEditorState> {
  "use server";

  await requireCurrentAdminAccess("/admin/services/new");

  const rawInput = readServiceEditorFormData(formData);
  const parsedInput = serviceEditorSchema.safeParse({
    contentMd: normalizeStringEntry(rawInput.contentMd),
    deliverables: normalizeStringEntry(rawInput.deliverables),
    published: rawInput.published,
    seoDescription: normalizeStringEntry(rawInput.seoDescription),
    seoTitle: normalizeStringEntry(rawInput.seoTitle),
    slug: normalizeStringEntry(rawInput.slug),
    summary: normalizeStringEntry(rawInput.summary),
    title: normalizeStringEntry(rawInput.title),
  });

  if (!parsedInput.success) {
    return createActionErrorState(
      "Check the highlighted fields and try again.",
      buildServiceEditorFieldErrors(parsedInput.error),
    );
  }

  const normalizedInput = buildNormalizedServicePayload(parsedInput.data);

  if (normalizedInput.errorState || !normalizedInput.payload) {
    return normalizedInput.errorState as AdminServiceEditorState;
  }

  try {
    const slugExists = await ensureUniqueServiceSlug({
      slug: normalizedInput.payload.slug,
    });

    if (slugExists) {
      return createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          slug: "That slug is already in use by another service.",
        },
      );
    }

    const nextOrderIndex = await getNextServiceOrderIndex();
    const supabase = await createServerSupabaseClient();
    const insertPayload: Database["public"]["Tables"]["services"]["Insert"] = {
      content_md: normalizedInput.payload.contentMd,
      deliverables: normalizedInput.payload.deliverables,
      order_index: nextOrderIndex,
      published: normalizedInput.payload.published,
      seo_description: normalizedInput.payload.seoDescription,
      seo_title: normalizedInput.payload.seoTitle,
      slug: normalizedInput.payload.slug,
      summary: normalizedInput.payload.summary,
      title: normalizedInput.payload.title,
    };
    const { error } = await supabase.from("services").insert(insertPayload);

    if (error) {
      console.error("Admin service create failed", {
        code: error.code,
        details: error.details,
        hint: error.hint,
        message: error.message,
        slug: normalizedInput.payload.slug,
      });

      return createActionErrorState(
        "The service could not be created right now. Try again.",
      );
    }

    revalidateServiceRoutes(normalizedInput.payload.slug);

    return createActionSuccessState({
      message: "Service created. Redirecting to the editor.",
      redirectTo: `/admin/services/${normalizedInput.payload.slug}?status=created`,
    });
  } catch (error) {
    console.error("Admin service create threw an unexpected error", error);

    return createActionErrorState(
      "The service could not be created right now. Try again.",
    );
  }
}

export async function updateAdminService(
  _prevState: AdminServiceEditorState,
  formData: FormData,
): Promise<AdminServiceEditorState> {
  "use server";

  const rawInput = readServiceEditorFormData(formData);
  const currentSlug = normalizeStringEntry(rawInput.currentSlug);

  await requireCurrentAdminAccess(
    currentSlug ? `/admin/services/${currentSlug}` : "/admin/services",
  );

  const parsedInput = serviceUpdateSchema.safeParse({
    contentMd: normalizeStringEntry(rawInput.contentMd),
    currentSlug,
    deliverables: normalizeStringEntry(rawInput.deliverables),
    published: rawInput.published,
    seoDescription: normalizeStringEntry(rawInput.seoDescription),
    seoTitle: normalizeStringEntry(rawInput.seoTitle),
    serviceId: normalizeStringEntry(rawInput.serviceId),
    slug: normalizeStringEntry(rawInput.slug),
    summary: normalizeStringEntry(rawInput.summary),
    title: normalizeStringEntry(rawInput.title),
  });

  if (!parsedInput.success) {
    return createActionErrorState(
      "Check the highlighted fields and try again.",
      buildServiceEditorFieldErrors(parsedInput.error),
    );
  }

  const normalizedInput = buildNormalizedServicePayload(parsedInput.data);

  if (normalizedInput.errorState || !normalizedInput.payload) {
    return normalizedInput.errorState as AdminServiceEditorState;
  }

  try {
    const slugExists = await ensureUniqueServiceSlug({
      serviceId: parsedInput.data.serviceId,
      slug: normalizedInput.payload.slug,
    });

    if (slugExists) {
      return createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          slug: "That slug is already in use by another service.",
        },
      );
    }

    const supabase = await createServerSupabaseClient();
    const updatePayload: Database["public"]["Tables"]["services"]["Update"] = {
      content_md: normalizedInput.payload.contentMd,
      deliverables: normalizedInput.payload.deliverables,
      published: normalizedInput.payload.published,
      seo_description: normalizedInput.payload.seoDescription,
      seo_title: normalizedInput.payload.seoTitle,
      slug: normalizedInput.payload.slug,
      summary: normalizedInput.payload.summary,
      title: normalizedInput.payload.title,
    };
    const { data, error } = await supabase
      .from("services")
      .update(updatePayload)
      .eq("id", parsedInput.data.serviceId)
      .select("slug")
      .maybeSingle();

    if (error || !data) {
      console.error("Admin service update failed", {
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        message: error?.message,
        serviceId: parsedInput.data.serviceId,
        slug: normalizedInput.payload.slug,
      });

      return createActionErrorState(
        "The service changes could not be saved right now. Try again.",
      );
    }

    revalidateServiceRoutes([
      parsedInput.data.currentSlug,
      normalizedInput.payload.slug,
    ]);

    return createActionSuccessState({
      message: "Service changes saved. Refreshing the editor.",
      redirectTo: `/admin/services/${normalizedInput.payload.slug}?status=saved`,
    });
  } catch (error) {
    console.error("Admin service update threw an unexpected error", error);

    return createActionErrorState(
      "The service changes could not be saved right now. Try again.",
    );
  }
}

export async function toggleAdminServicePublished(formData: FormData) {
  "use server";

  await requireCurrentAdminAccess("/admin/services");

  const parsedInput = publishActionSchema.safeParse({
    currentPublished: formData.get("currentPublished"),
    searchQuery: formData.get("searchQuery"),
    serviceId: formData.get("serviceId"),
    slug: formData.get("slug"),
  });

  if (!parsedInput.success) {
    redirect(buildServicesReturnPath({ status: "invalid-action" }));
  }

  const { currentPublished, searchQuery, serviceId, slug } = parsedInput.data;
  const nextPublished = currentPublished !== "true";
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("services")
    .update({ published: nextPublished })
    .eq("id", serviceId);

  if (error) {
    redirect(
      buildServicesReturnPath({
        query: searchQuery,
        status: "update-error",
      }),
    );
  }

  revalidateServiceRoutes(slug);

  redirect(
    buildServicesReturnPath({
      query: searchQuery,
      status: "publish-updated",
    }),
  );
}

export async function moveAdminServiceOrder(formData: FormData) {
  "use server";

  await requireCurrentAdminAccess("/admin/services");

  const parsedInput = moveActionSchema.safeParse({
    direction: formData.get("direction"),
    searchQuery: formData.get("searchQuery"),
    serviceId: formData.get("serviceId"),
  });

  if (!parsedInput.success) {
    redirect(buildServicesReturnPath({ status: "invalid-action" }));
  }

  const { direction, searchQuery, serviceId } = parsedInput.data;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, order_index, slug, updated_at")
    .order("order_index", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error || !data?.length) {
    redirect(
      buildServicesReturnPath({
        query: searchQuery,
        status: "update-error",
      }),
    );
  }

  const currentIndex = data.findIndex((service) => service.id === serviceId);

  if (currentIndex < 0) {
    redirect(
      buildServicesReturnPath({
        query: searchQuery,
        status: "service-missing",
      }),
    );
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= data.length) {
    redirect(
      buildServicesReturnPath({
        query: searchQuery,
        status: "order-edge",
      }),
    );
  }

  const reorderedServices = [...data];
  const [currentService] = reorderedServices.splice(currentIndex, 1);
  reorderedServices.splice(targetIndex, 0, currentService);

  const updates = reorderedServices
    .map((service, index) => ({
      id: service.id,
      orderIndex: index,
      slug: service.slug,
      shouldUpdate: service.order_index !== index,
    }))
    .filter((service) => service.shouldUpdate);

  for (const service of updates) {
    const { error: updateError } = await supabase
      .from("services")
      .update({ order_index: service.orderIndex })
      .eq("id", service.id);

    if (updateError) {
      redirect(
        buildServicesReturnPath({
          query: searchQuery,
          status: "update-error",
        }),
      );
    }

    revalidateServiceRoutes(service.slug);
  }

  redirect(
    buildServicesReturnPath({
      query: searchQuery,
      status: "order-updated",
    }),
  );
}
