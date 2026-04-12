"use server";

import "server-only";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type { AdminRedirectsListData } from "@/interfaces/admin/redirect-editor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  filterAdminRedirects,
  getRedirectSearchText,
  summarizeAdminRedirects,
} from "./helpers";
import { statusCodeFilterSchema } from "./schemas";

export async function getAdminRedirectsListData(input?: {
  query?: string;
  statusCodeFilter?: string;
}): Promise<AdminRedirectsListData> {
  await requireCurrentAdminAccess("/admin/redirects");

  const query = input?.query?.trim() ?? "";
  const selectedStatusCodeFilter = statusCodeFilterSchema.safeParse(
    input?.statusCodeFilter,
  ).success
    ? (input?.statusCodeFilter as "all" | "301" | "302")
    : "all";
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("redirects")
    .select("from_path, id, status_code, to_path, updated_at")
    .order("updated_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Could not load admin redirects list.");
  }

  const allRedirects = (data ?? []).map((redirectRecord) => ({
    fromPath: redirectRecord.from_path,
    id: redirectRecord.id,
    searchText: getRedirectSearchText({
      fromPath: redirectRecord.from_path,
      toPath: redirectRecord.to_path,
    }),
    statusCode: redirectRecord.status_code as 301 | 302,
    toPath: redirectRecord.to_path,
    updatedAt: redirectRecord.updated_at,
  }));
  const redirects = filterAdminRedirects(allRedirects, {
    query,
    statusCodeFilter: selectedStatusCodeFilter,
  });
  const counts = summarizeAdminRedirects(
    allRedirects.map((redirectRecord) => ({
      fromPath: redirectRecord.fromPath,
      id: redirectRecord.id,
      statusCode: redirectRecord.statusCode,
      toPath: redirectRecord.toPath,
      updatedAt: redirectRecord.updatedAt,
    })),
  );

  return {
    filteredCount: redirects.length,
    query,
    redirects,
    selectedStatusCodeFilter,
    status301Count: counts.status301Count,
    status302Count: counts.status302Count,
    totalCount: counts.totalCount,
  };
}
