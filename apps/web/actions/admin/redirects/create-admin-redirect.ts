"use server";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type { Database } from "@/lib/supabase/database.types";
import type {
  AdminRedirectEditorFieldErrors,
  AdminRedirectEditorState,
} from "@/interfaces/admin/redirect-editor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  buildNormalizedRedirectPayload,
  buildRedirectEditorFieldErrors,
  createActionErrorState,
  createActionSuccessState,
  ensureUniqueRedirectFromPath,
  findInverseRedirect,
  isInverseRedirectLoop,
  readRedirectEditorFormData,
  revalidateRedirectRoutes,
} from "./helpers";
import { redirectEditorSchema } from "./schemas";

export async function createAdminRedirect(
  _prevState: AdminRedirectEditorState,
  formData: FormData,
): Promise<AdminRedirectEditorState> {
  await requireCurrentAdminAccess("/admin/redirects/new");

  const rawInput = readRedirectEditorFormData(formData);
  const parsedInput = redirectEditorSchema.safeParse({
    fromPath: rawInput.fromPath,
    statusCode: rawInput.statusCode,
    toPath: rawInput.toPath,
  });

  if (!parsedInput.success) {
    return createActionErrorState(
      "Check the highlighted fields and try again.",
      buildRedirectEditorFieldErrors(parsedInput.error),
    );
  }

  const normalizedInput = buildNormalizedRedirectPayload(parsedInput.data);

  if (normalizedInput.errorState || !normalizedInput.payload) {
    return normalizedInput.errorState as AdminRedirectEditorState;
  }

  try {
    const fromPathExists = await ensureUniqueRedirectFromPath({
      fromPath: normalizedInput.payload.fromPath,
    });

    if (fromPathExists) {
      return createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          fromPath: "That source path is already in use by another redirect.",
        },
      );
    }

    const inverseRedirect = await findInverseRedirect({
      fromPath: normalizedInput.payload.fromPath,
      toPath: normalizedInput.payload.toPath,
    });

    if (
      isInverseRedirectLoop({
        fromPath: normalizedInput.payload.fromPath,
        inverseRedirect,
        toPath: normalizedInput.payload.toPath,
      })
    ) {
      return createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          toPath:
            "This would create a direct redirect loop with an existing reverse rule.",
        },
      );
    }

    const insertPayload: Database["public"]["Tables"]["redirects"]["Insert"] = {
      from_path: normalizedInput.payload.fromPath,
      status_code: normalizedInput.payload.statusCode,
      to_path: normalizedInput.payload.toPath,
    };
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("redirects")
      .insert(insertPayload)
      .select("id")
      .maybeSingle();

    if (error || !data) {
      if (error?.code === "23505") {
        return createActionErrorState(
          "Check the highlighted fields and try again.",
          {
            fromPath: "That source path is already in use by another redirect.",
          },
        );
      }

      console.error("Admin redirect create failed", {
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        message: error?.message,
      });

      return createActionErrorState(
        "The redirect could not be created right now. Try again.",
      );
    }

    revalidateRedirectRoutes(data.id);

    return createActionSuccessState({
      message: "Redirect created. Redirecting to the editor.",
      redirectTo: `/admin/redirects/${data.id}?status=created`,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "The redirect could not be created right now. Try again.";
    const fieldErrors: AdminRedirectEditorFieldErrors = {};

    console.error("Admin redirect create threw an unexpected error", error);

    return createActionErrorState(message, fieldErrors);
  }
}
