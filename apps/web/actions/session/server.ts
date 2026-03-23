import "server-only";

import { NextResponse, type NextRequest } from "next/server";

import {
  getAdminAppRouteRedirect,
  isAdminAppRoute,
} from "@/actions/admin/server";
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

export async function updateSession(request: NextRequest) {
  const proxyContext = createProxySupabaseContext(request);
  if (!isAdminAppRoute(request.nextUrl.pathname)) {
    return proxyContext.response;
  }

  const { data } = await proxyContext.supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    return NextResponse.redirect(buildAnonymousLoginRedirect(request));
  }

  const adminRedirectPath = await getAdminAppRouteRedirect({
    pathname: request.nextUrl.pathname,
    supabase: proxyContext.supabase,
    userId: user.sub,
  });

  if (adminRedirectPath) {
    return NextResponse.redirect(
      new URL(adminRedirectPath, request.nextUrl.origin),
    );
  }

  return proxyContext.response;
}
