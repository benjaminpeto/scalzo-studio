import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
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

function revalidateServiceRoutes(slug: string) {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath(`/services/${slug}`);
  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${slug}`);
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

export async function getAdminServiceBySlug(slug: string) {
  await requireCurrentAdminAccess(`/admin/services/${slug}`);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, order_index, published, slug, title, updated_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    orderIndex: data.order_index,
    published: data.published,
    slug: data.slug,
    title: data.title,
    updatedAt: data.updated_at,
  };
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
