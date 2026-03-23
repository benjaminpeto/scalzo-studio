import "server-only";

import { NextResponse, type NextRequest } from "next/server";

import {
  getAdminAppRouteRedirect,
  isAdminAppRoute,
} from "@/actions/admin/server";
import { normalizeAuthRedirectPath } from "@/lib/supabase/auth-flow";
import { createProxySupabaseContext } from "@/lib/supabase/proxy";

function isAnonymousPublicRoute(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login")
  );
}

function buildAnonymousLoginRedirect(request: NextRequest) {
  const loginUrl = request.nextUrl.clone();

  loginUrl.pathname = "/auth/login";
  loginUrl.searchParams.set(
    "next",
    normalizeAuthRedirectPath(request.nextUrl.pathname),
  );

  return loginUrl;
}

export async function updateSession(request: NextRequest) {
  const proxyContext = createProxySupabaseContext(request);
  const { data } = await proxyContext.supabase.auth.getClaims();
  const user = data?.claims;

  if (!user && !isAnonymousPublicRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(buildAnonymousLoginRedirect(request));
  }

  if (user && isAdminAppRoute(request.nextUrl.pathname)) {
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
  }

  return proxyContext.response;
}
