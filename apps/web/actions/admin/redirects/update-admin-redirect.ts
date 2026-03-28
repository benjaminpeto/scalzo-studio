import type { Database } from "@/lib/supabase/database.types";
import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type {
  AdminRedirectEditorFieldErrors,
  AdminRedirectEditorState,
} from "@/interfaces/admin/redirect-editor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { getAdminRedirectById } from "./get-admin-redirect-by-id";
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
import { redirectUpdateSchema } from "./schemas";

export async function updateAdminRedirect(
  _prevState: AdminRedirectEditorState,
  formData: FormData,
): Promise<AdminRedirectEditorState> {
  "use server";

  const rawInput = readRedirectEditorFormData(formData);
  const redirectId =
    typeof rawInput.redirectId === "string" ? rawInput.redirectId : "";

  await requireCurrentAdminAccess(
    redirectId ? `/admin/redirects/${redirectId}` : "/admin/redirects",
  );

  const parsedInput = redirectUpdateSchema.safeParse({
    fromPath: rawInput.fromPath,
    redirectId,
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

  const existingRedirect = await getAdminRedirectById(
    parsedInput.data.redirectId,
  );

  if (!existingRedirect) {
    return createActionErrorState(
      "That redirect could not be found anymore. Refresh and try again.",
    );
  }

  try {
    const fromPathExists = await ensureUniqueRedirectFromPath({
      fromPath: normalizedInput.payload.fromPath,
      redirectId: parsedInput.data.redirectId,
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
      redirectId: parsedInput.data.redirectId,
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

    const updatePayload: Database["public"]["Tables"]["redirects"]["Update"] = {
      from_path: normalizedInput.payload.fromPath,
      status_code: normalizedInput.payload.statusCode,
      to_path: normalizedInput.payload.toPath,
    };
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("redirects")
      .update(updatePayload)
      .eq("id", parsedInput.data.redirectId)
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

      console.error("Admin redirect update failed", {
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        message: error?.message,
        redirectId: parsedInput.data.redirectId,
      });

      return createActionErrorState(
        "The redirect changes could not be saved right now. Try again.",
      );
    }

    revalidateRedirectRoutes([
      parsedInput.data.redirectId,
      existingRedirect.id,
    ]);

    return createActionSuccessState({
      message: "Redirect changes saved. Refreshing the editor.",
      redirectTo: `/admin/redirects/${parsedInput.data.redirectId}?status=saved`,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "The redirect changes could not be saved right now. Try again.";
    const fieldErrors: AdminRedirectEditorFieldErrors = {};

    console.error("Admin redirect update threw an unexpected error", error);

    return createActionErrorState(message, fieldErrors);
  }
}
