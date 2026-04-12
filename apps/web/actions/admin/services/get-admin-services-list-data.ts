"use server";

import "server-only";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type { AdminServicesListData } from "@/interfaces/admin/service-editor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { getServiceSearchText } from "./helpers";

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
