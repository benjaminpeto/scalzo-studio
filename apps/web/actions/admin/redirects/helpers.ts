import { revalidatePath } from "next/cache";
import { z } from "zod";

import { normalizeInternalRedirectPath } from "@/actions/redirects/helpers";
import type {
  AdminRedirectEditorFieldErrors,
  AdminRedirectEditorState,
  AdminRedirectListItem,
} from "@/interfaces/admin/redirect-editor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { RedirectEditorInput, RedirectUpdateInput } from "./schemas";

export { normalizeInternalRedirectPath } from "@/actions/redirects/helpers";

type RedirectWithSearchText = AdminRedirectListItem & {
  searchText: string;
};

export function createActionErrorState(
  message: string,
  fieldErrors: AdminRedirectEditorFieldErrors = {},
): AdminRedirectEditorState {
  return {
    fieldErrors,
    message,
    redirectTo: null,
    status: "error",
  };
}

export function createActionSuccessState(input: {
  message: string;
  redirectTo: string;
}): AdminRedirectEditorState {
  return {
    fieldErrors: {},
    message: input.message,
    redirectTo: input.redirectTo,
    status: "success",
  };
}

export function readRedirectEditorFormData(formData: FormData) {
  return {
    fromPath: formData.get("fromPath"),
    redirectId: formData.get("redirectId"),
    statusCode: formData.get("statusCode"),
    toPath: formData.get("toPath"),
  };
}

export function buildRedirectEditorFieldErrors(
  error: z.ZodError<RedirectEditorInput | RedirectUpdateInput>,
): AdminRedirectEditorFieldErrors {
  const fieldErrors: AdminRedirectEditorFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (
      typeof field === "string" &&
      field !== "redirectId" &&
      !fieldErrors[field as keyof AdminRedirectEditorFieldErrors]
    ) {
      fieldErrors[field as keyof AdminRedirectEditorFieldErrors] =
        issue.message;
    }
  }

  return fieldErrors;
}

export function buildRedirectsReturnPath(input?: {
  query?: string;
  status?: string;
  statusCodeFilter?: "all" | "301" | "302";
}) {
  const searchParams = new URLSearchParams();

  if (input?.query) {
    searchParams.set("q", input.query);
  }

  if (input?.statusCodeFilter && input.statusCodeFilter !== "all") {
    searchParams.set("statusCode", input.statusCodeFilter);
  }

  if (input?.status) {
    searchParams.set("status", input.status);
  }

  const queryString = searchParams.toString();

  return queryString ? `/admin/redirects?${queryString}` : "/admin/redirects";
}

export function getRedirectSearchText(redirectRecord: {
  fromPath: string;
  toPath: string;
}) {
  return `${redirectRecord.fromPath} ${redirectRecord.toPath}`.toLowerCase();
}

export function summarizeAdminRedirects(redirects: AdminRedirectListItem[]) {
  return {
    status301Count: redirects.filter(
      (redirectRecord) => redirectRecord.statusCode === 301,
    ).length,
    status302Count: redirects.filter(
      (redirectRecord) => redirectRecord.statusCode === 302,
    ).length,
    totalCount: redirects.length,
  };
}

export function filterAdminRedirects(
  redirects: RedirectWithSearchText[],
  input: {
    query: string;
    statusCodeFilter: "all" | "301" | "302";
  },
) {
  const normalizedQuery = input.query.trim().toLowerCase();

  return redirects
    .filter((redirectRecord) => {
      const queryMatches = normalizedQuery
        ? redirectRecord.searchText.includes(normalizedQuery)
        : true;
      const statusMatches =
        input.statusCodeFilter === "all"
          ? true
          : String(redirectRecord.statusCode) === input.statusCodeFilter;

      return queryMatches && statusMatches;
    })
    .map((redirectRecord) => ({
      fromPath: redirectRecord.fromPath,
      id: redirectRecord.id,
      statusCode: redirectRecord.statusCode,
      toPath: redirectRecord.toPath,
      updatedAt: redirectRecord.updatedAt,
    }));
}

export function revalidateRedirectRoutes(ids: string | string[]) {
  const redirectIds = Array.isArray(ids) ? ids : [ids];

  revalidatePath("/admin/redirects");
  revalidatePath("/admin/redirects/new");

  for (const redirectId of new Set(redirectIds.filter(Boolean))) {
    revalidatePath(`/admin/redirects/${redirectId}`);
  }
}

export function isSelfRedirectLoop(input: {
  fromPath: string;
  toPath: string;
}) {
  return input.fromPath === input.toPath;
}

export function isInverseRedirectLoop(input: {
  fromPath: string;
  inverseRedirect: {
    fromPath: string;
    toPath: string;
  } | null;
  toPath: string;
}) {
  return Boolean(
    input.inverseRedirect &&
    input.inverseRedirect.fromPath === input.toPath &&
    input.inverseRedirect.toPath === input.fromPath,
  );
}

export async function ensureUniqueRedirectFromPath(input: {
  fromPath: string;
  redirectId?: string;
}) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("redirects")
    .select("id")
    .eq("from_path", input.fromPath);

  if (input.redirectId) {
    query = query.neq("id", input.redirectId);
  }

  const { data, error } = await query.limit(1).maybeSingle();

  if (error) {
    throw new Error("Could not validate the redirect source path.");
  }

  return Boolean(data);
}

export async function findInverseRedirect(input: {
  fromPath: string;
  redirectId?: string;
  toPath: string;
}) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("redirects")
    .select("from_path, to_path")
    .eq("from_path", input.toPath)
    .eq("to_path", input.fromPath);

  if (input.redirectId) {
    query = query.neq("id", input.redirectId);
  }

  const { data, error } = await query.limit(1).maybeSingle();

  if (error) {
    throw new Error("Could not validate redirect loop rules.");
  }

  return data
    ? {
        fromPath: data.from_path,
        toPath: data.to_path,
      }
    : null;
}

export function buildNormalizedRedirectPayload(
  input: RedirectEditorInput | RedirectUpdateInput,
) {
  const normalizedFromPath = normalizeInternalRedirectPath(input.fromPath);
  const normalizedToPath = normalizeInternalRedirectPath(input.toPath);
  const fieldErrors: AdminRedirectEditorFieldErrors = {};

  if (normalizedFromPath.error) {
    fieldErrors.fromPath = normalizedFromPath.error;
  }

  if (normalizedToPath.error) {
    fieldErrors.toPath = normalizedToPath.error;
  }

  if (fieldErrors.fromPath || fieldErrors.toPath) {
    return {
      errorState: createActionErrorState(
        "Check the highlighted fields and try again.",
        fieldErrors,
      ),
      payload: null,
    };
  }

  if (
    isSelfRedirectLoop({
      fromPath: normalizedFromPath.value as string,
      toPath: normalizedToPath.value as string,
    })
  ) {
    return {
      errorState: createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          toPath:
            "The destination path cannot match the source path after normalization.",
        },
      ),
      payload: null,
    };
  }

  return {
    errorState: null,
    payload: {
      fromPath: normalizedFromPath.value as string,
      statusCode: Number(input.statusCode) as 301 | 302,
      toPath: normalizedToPath.value as string,
    },
  };
}
