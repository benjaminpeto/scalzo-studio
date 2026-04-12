"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type { AdminLeadEditorState } from "@/interfaces/admin/lead-editor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { createActionErrorState, createActionSuccessState } from "./helpers";
import { leadUpdateSchema } from "./schemas";

export async function updateAdminLead(
  _prevState: AdminLeadEditorState,
  formData: FormData,
): Promise<AdminLeadEditorState> {
  const leadId =
    typeof formData.get("leadId") === "string"
      ? (formData.get("leadId") as string)
      : "";

  await requireCurrentAdminAccess(
    leadId ? `/admin/leads/${leadId}` : "/admin/leads",
  );

  const parsedInput = leadUpdateSchema.safeParse({
    internalNotes: formData.get("internalNotes") ?? "",
    leadId,
    status: formData.get("status"),
  });

  if (!parsedInput.success) {
    const fieldErrors: { status?: string; internalNotes?: string } = {};

    for (const issue of parsedInput.error.issues) {
      const field = issue.path[0];
      if (field === "status" && !fieldErrors.status) {
        fieldErrors.status = issue.message;
      } else if (field === "internalNotes" && !fieldErrors.internalNotes) {
        fieldErrors.internalNotes = issue.message;
      }
    }

    return createActionErrorState(
      "Check the highlighted fields and try again.",
      fieldErrors,
    );
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("leads")
    .update({
      internal_notes: parsedInput.data.internalNotes ?? null,
      status: parsedInput.data.status,
    })
    .eq("id", parsedInput.data.leadId);

  if (error) {
    return createActionErrorState(
      "The lead could not be updated right now. Try again.",
    );
  }

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${parsedInput.data.leadId}`);

  return createActionSuccessState({
    message: "Lead status and notes saved. Refreshing the page.",
    redirectTo: `/admin/leads/${parsedInput.data.leadId}?status=saved`,
  });
}
