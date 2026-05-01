"use server";

import "server-only";

import { NextResponse, type NextRequest } from "next/server";

import {
  getAdminAppRouteRedirect,
  isAdminAppRoute,
} from "@/actions/admin/server";
import { getRuntimeRedirectResponse } from "@/actions/session/runtime-redirects";
import { normalizeAuthRedirectPath } from "@/lib/supabase/auth-flow";
import { createProxySupabaseContext } from "@/lib/supabase/proxy";

function buildAnonymousLoginRedirect(request: NextRequest) {
  const loginUrl = request.nextUrl.clone();
  const requestPath =
    request.nextUrl.pathname +
    (request.nextUrl.search ? request.nextUrl.search : "");

  loginUrl.pathname = "/auth/login";
  loginUrl.searchParams.set("next", normalizeAuthRedirectPath(requestPath));

  return loginUrl;
}

function copyResponseCookies(source: NextResponse, target: NextResponse) {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie);
  }
}

function buildProxyRedirectResponse(input: {
  proxyResponse: NextResponse;
  redirectUrl: URL;
  status?: 301 | 302 | 307 | 308;
}) {
  const response = NextResponse.redirect(input.redirectUrl, input.status);

  copyResponseCookies(input.proxyResponse, response);

  return response;
}

export async function updateSession(request: NextRequest) {
  const proxyContext = createProxySupabaseContext(request);

  const runtimeRedirectResponse = await getRuntimeRedirectResponse({
    request,
    response: proxyContext.response,
  });

  if (runtimeRedirectResponse) {
    return runtimeRedirectResponse;
  }

  if (!isAdminAppRoute(request.nextUrl.pathname)) {
    return proxyContext.response;
  }

  const { data } = await proxyContext.supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    return buildProxyRedirectResponse({
      proxyResponse: proxyContext.response,
      redirectUrl: buildAnonymousLoginRedirect(request),
    });
  }

  const adminRedirectPath = await getAdminAppRouteRedirect({
    pathname: request.nextUrl.pathname,
    supabase: proxyContext.supabase,
    userId: user.sub,
  });

  if (adminRedirectPath) {
    return buildProxyRedirectResponse({
      proxyResponse: proxyContext.response,
      redirectUrl: new URL(adminRedirectPath, request.nextUrl.origin),
    });
  }

  return proxyContext.response;
}
