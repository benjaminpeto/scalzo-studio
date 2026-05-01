"use server";

import "server-only";

import { NextResponse, type NextRequest } from "next/server";

import { normalizeComparableRedirectPath } from "@/actions/redirects/helpers";
import { serverFeatureFlags } from "@/lib/env/server";
import type { Database } from "@/lib/supabase/database.types";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

type RuntimeRedirectRecord = Pick<
  Database["public"]["Tables"]["redirects"]["Row"],
  "from_path" | "status_code" | "to_path"
>;

const RUNTIME_REDIRECT_EXCLUDED_PREFIXES = [
  "/admin",
  "/protected",
  "/auth",
  "/api",
] as const;

function copyResponseCookies(source: NextResponse, target: NextResponse) {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie);
  }
}

function pickMatchedRedirect(input: {
  candidates: string[];
  redirects: RuntimeRedirectRecord[];
}) {
  const redirectsByFromPath = new Map(
    input.redirects.map((redirectRecord) => [
      redirectRecord.from_path,
      redirectRecord,
    ]),
  );

  for (const candidate of input.candidates) {
    const matchedRedirect = redirectsByFromPath.get(candidate);

    if (matchedRedirect) {
      return matchedRedirect;
    }
  }

  return null;
}

export function shouldBypassRuntimeRedirectLookup(input: {
  method: string;
  pathname: string;
}) {
  const method = input.method.toUpperCase();

  if (method !== "GET" && method !== "HEAD") {
    return true;
  }

  return RUNTIME_REDIRECT_EXCLUDED_PREFIXES.some((prefix) => {
    return input.pathname === prefix || input.pathname.startsWith(`${prefix}/`);
  });
}

export function buildRuntimeRedirectLookupCandidates(input: {
  pathname: string;
  search?: string;
}) {
  const pathnameOnly = normalizeComparableRedirectPath(input.pathname);

  if (pathnameOnly.error || !pathnameOnly.value) {
    return [];
  }

  const exactPath = input.search
    ? normalizeComparableRedirectPath(`${input.pathname}${input.search}`)
    : null;

  return [
    ...new Set(
      [exactPath?.value ?? null, pathnameOnly.value].filter(
        (value): value is string => Boolean(value),
      ),
    ),
  ];
}

export async function getRuntimeRedirectResponse(input: {
  request: NextRequest;
  response: NextResponse;
}) {
  if (
    shouldBypassRuntimeRedirectLookup({
      method: input.request.method,
      pathname: input.request.nextUrl.pathname,
    })
  ) {
    return null;
  }

  const candidates = buildRuntimeRedirectLookupCandidates({
    pathname: input.request.nextUrl.pathname,
    search: input.request.nextUrl.search,
  });

  if (!candidates.length || !serverFeatureFlags.serviceRoleEnabled) {
    return null;
  }

  try {
    const supabase = createServiceRoleSupabaseClient();
    const { data, error } = await supabase
      .from("redirects")
      .select("from_path, status_code, to_path")
      .in("from_path", candidates);

    if (error) {
      console.error("Runtime redirect lookup failed", {
        code: error.code,
        details: error.details,
        hint: error.hint,
        message: error.message,
      });

      return null;
    }

    const matchedRedirect = pickMatchedRedirect({
      candidates,
      redirects: data ?? [],
    });

    if (!matchedRedirect) {
      return null;
    }

    const normalizedDestination = normalizeComparableRedirectPath(
      matchedRedirect.to_path,
    );
    const currentRequestTarget = candidates[0];

    if (
      normalizedDestination.error ||
      !normalizedDestination.value ||
      normalizedDestination.value === currentRequestTarget
    ) {
      console.error("Runtime redirect skipped because it resolves to itself", {
        fromPath: matchedRedirect.from_path,
        requestTarget: currentRequestTarget,
        toPath: matchedRedirect.to_path,
      });

      return null;
    }

    const redirectResponse = NextResponse.redirect(
      new URL(matchedRedirect.to_path, input.request.nextUrl.origin),
      matchedRedirect.status_code,
    );

    copyResponseCookies(input.response, redirectResponse);

    return redirectResponse;
  } catch (error) {
    console.error("Runtime redirect lookup threw an unexpected error", error);

    return null;
  }
}
