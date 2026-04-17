import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";

import { updateSession } from "@/actions/session/server";
import { routing } from "./lib/i18n/routing";

const intlMiddleware = createMiddleware(routing);

function isLocaleRoute(pathname: string): boolean {
  return (
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/auth") &&
    !pathname.startsWith("/ingest")
  );
}

export async function proxy(request: NextRequest) {
  const sessionResponse = await updateSession(request);

  // Session-level redirects (runtime DB redirects, auth guard) take priority
  if (sessionResponse.status >= 300 && sessionResponse.status < 400) {
    return sessionResponse;
  }

  if (isLocaleRoute(request.nextUrl.pathname)) {
    const intlResponse = intlMiddleware(request);

    // Carry auth cookies from the session refresh into the locale response
    for (const cookie of sessionResponse.cookies.getAll()) {
      intlResponse.cookies.set(cookie.name, cookie.value, cookie);
    }

    return intlResponse;
  }

  return sessionResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/",
  ],
};
