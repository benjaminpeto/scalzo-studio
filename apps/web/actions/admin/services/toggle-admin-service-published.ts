"use server";

import { redirect } from "next/navigation";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { buildServicesReturnPath, revalidateServiceRoutes } from "./helpers";
import { publishActionSchema } from "./schemas";

export async function toggleAdminServicePublished(formData: FormData) {
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
