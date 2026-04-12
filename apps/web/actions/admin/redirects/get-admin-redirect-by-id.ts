"use server";

import "server-only";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type { AdminRedirectEditorRecord } from "@/interfaces/admin/redirect-editor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAdminRedirectById(
  id: string,
): Promise<AdminRedirectEditorRecord | null> {
  await requireCurrentAdminAccess(`/admin/redirects/${id}`);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("redirects")
    .select("from_path, id, status_code, to_path, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    fromPath: data.from_path,
    id: data.id,
    statusCode: data.status_code as 301 | 302,
    toPath: data.to_path,
    updatedAt: data.updated_at,
  };
}
