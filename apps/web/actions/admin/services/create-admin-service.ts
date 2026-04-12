"use server";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type { AdminServiceEditorState } from "@/interfaces/admin/service-editor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  buildNormalizedServicePayload,
  buildServiceEditorFieldErrors,
  createActionErrorState,
  createActionSuccessState,
  ensureUniqueServiceSlug,
  getNextServiceOrderIndex,
  normalizeStringEntry,
  readServiceEditorFormData,
  revalidateServiceRoutes,
  type ServiceInsertPayload,
} from "./helpers";
import { serviceEditorSchema } from "./schemas";

export async function createAdminService(
  _prevState: AdminServiceEditorState,
  formData: FormData,
): Promise<AdminServiceEditorState> {
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
    const insertPayload: ServiceInsertPayload = {
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
