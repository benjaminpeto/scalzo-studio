"use server";

import type { AdminServiceEditorState } from "@/interfaces/admin/service-editor";
import { requireCurrentAdminAccess } from "@/actions/admin/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  buildNormalizedServicePayload,
  buildServiceEditorFieldErrors,
  createActionErrorState,
  createActionSuccessState,
  ensureUniqueServiceSlug,
  normalizeStringEntry,
  readServiceEditorFormData,
  revalidateServiceRoutes,
  type ServiceUpdatePayload,
} from "./helpers";
import { serviceUpdateSchema } from "./schemas";

export async function updateAdminService(
  _prevState: AdminServiceEditorState,
  formData: FormData,
): Promise<AdminServiceEditorState> {
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
    const updatePayload: ServiceUpdatePayload = {
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
