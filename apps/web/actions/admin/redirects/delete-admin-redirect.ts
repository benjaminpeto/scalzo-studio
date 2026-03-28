import { redirect } from "next/navigation";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { buildRedirectsReturnPath, revalidateRedirectRoutes } from "./helpers";
import { deleteActionSchema } from "./schemas";

export async function deleteAdminRedirect(formData: FormData) {
  "use server";

  const parsedInput = deleteActionSchema.safeParse({
    confirmDelete: formData.get("confirmDelete"),
    redirectId: formData.get("redirectId"),
  });

  if (!parsedInput.success) {
    redirect(buildRedirectsReturnPath({ status: "invalid-action" }));
  }

  await requireCurrentAdminAccess(
    `/admin/redirects/${parsedInput.data.redirectId}`,
  );

  const supabase = await createServerSupabaseClient();
  const { data: existingRedirect, error: loadError } = await supabase
    .from("redirects")
    .select("id")
    .eq("id", parsedInput.data.redirectId)
    .maybeSingle();

  if (loadError || !existingRedirect) {
    redirect(buildRedirectsReturnPath({ status: "redirect-missing" }));
  }

  const { error } = await supabase
    .from("redirects")
    .delete()
    .eq("id", parsedInput.data.redirectId);

  if (error) {
    redirect(buildRedirectsReturnPath({ status: "update-error" }));
  }

  revalidateRedirectRoutes(parsedInput.data.redirectId);

  redirect(buildRedirectsReturnPath({ status: "deleted" }));
}
