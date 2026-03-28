import { redirect } from "next/navigation";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { buildServicesReturnPath, revalidateServiceRoutes } from "./helpers";
import { moveActionSchema } from "./schemas";

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
