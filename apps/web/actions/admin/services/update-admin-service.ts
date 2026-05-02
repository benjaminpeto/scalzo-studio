"use server";

import type { AdminServiceEditorState } from "@/interfaces/admin/service-editor";
import { requireCurrentAdminAccess } from "@/actions/admin/server";
import { sanitizeMarkdownUrls } from "@/lib/markdown/sanitize";
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
    contentMdEs: normalizeStringEntry(rawInput.contentMdEs),
    currentSlug,
    deliverables: normalizeStringEntry(rawInput.deliverables),
    published: rawInput.published,
    seoDescription: normalizeStringEntry(rawInput.seoDescription),
    seoDescriptionEs: normalizeStringEntry(rawInput.seoDescriptionEs),
    seoTitle: normalizeStringEntry(rawInput.seoTitle),
    seoTitleEs: normalizeStringEntry(rawInput.seoTitleEs),
    serviceId: normalizeStringEntry(rawInput.serviceId),
    slug: normalizeStringEntry(rawInput.slug),
    summary: normalizeStringEntry(rawInput.summary),
    summaryEs: normalizeStringEntry(rawInput.summaryEs),
    title: normalizeStringEntry(rawInput.title),
    titleEs: normalizeStringEntry(rawInput.titleEs),
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
      content_md: normalizedInput.payload.contentMd
        ? sanitizeMarkdownUrls(normalizedInput.payload.contentMd)
        : null,
      content_md_es: normalizedInput.payload.contentMdEs
        ? sanitizeMarkdownUrls(normalizedInput.payload.contentMdEs)
        : null,
      deliverables: normalizedInput.payload.deliverables,
      published: normalizedInput.payload.published,
      seo_description: normalizedInput.payload.seoDescription,
      seo_description_es: normalizedInput.payload.seoDescriptionEs,
      seo_title: normalizedInput.payload.seoTitle,
      seo_title_es: normalizedInput.payload.seoTitleEs,
      slug: normalizedInput.payload.slug,
      summary: normalizedInput.payload.summary,
      summary_es: normalizedInput.payload.summaryEs,
      title: normalizedInput.payload.title,
      title_es: normalizedInput.payload.titleEs,
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
