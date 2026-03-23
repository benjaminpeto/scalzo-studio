import "server-only";

import { redirect } from "next/navigation";

import {
  ADMIN_AUTH_ACCESS_DENIED_MESSAGE,
  normalizeAuthRedirectPath,
} from "@/lib/supabase/auth-flow";
import {
  getCurrentUserAdminState,
  isUserIdAdmin,
  type CurrentUserAdminState,
  type RequestSupabaseClient,
} from "@/lib/supabase/auth";

export const ADMIN_APP_ROUTE_PREFIX = "/admin";
export const LEGACY_PROTECTED_ROUTE_PREFIX = "/protected";

interface AuthorizedAdminState extends CurrentUserAdminState {
  errorMessage: null;
  isAdmin: true;
  user: NonNullable<CurrentUserAdminState["user"]>;
  userId: string;
}

function buildLoginRedirectPath(input: {
  errorMessage?: string | null;
  nextPath?: string | null;
}) {
  const searchParams = new URLSearchParams();

  if (input.errorMessage) {
    searchParams.set("error", input.errorMessage);
  } else if (input.nextPath) {
    searchParams.set("next", normalizeAuthRedirectPath(input.nextPath));
  }

  const queryString = searchParams.toString();

  return queryString ? `/auth/login?${queryString}` : "/auth/login";
}

export function isAdminAppRoute(pathname: string) {
  return (
    pathname.startsWith(ADMIN_APP_ROUTE_PREFIX) ||
    pathname.startsWith(LEGACY_PROTECTED_ROUTE_PREFIX)
  );
}

export async function requireCurrentAdminAccess(
  nextPath = ADMIN_APP_ROUTE_PREFIX,
): Promise<AuthorizedAdminState> {
  const adminState = await getCurrentUserAdminState();

  if (!adminState.user) {
    redirect(
      buildLoginRedirectPath({
        nextPath,
      }),
    );
  }

  if (!adminState.isAdmin) {
    redirect(
      buildLoginRedirectPath({
        errorMessage:
          adminState.errorMessage ?? ADMIN_AUTH_ACCESS_DENIED_MESSAGE,
      }),
    );
  }

  return {
    ...adminState,
    errorMessage: null,
    isAdmin: true,
    user: adminState.user,
    userId: adminState.user.id,
  };
}

export async function getAdminAppRouteRedirect(input: {
  pathname: string;
  supabase: RequestSupabaseClient;
  userId: string;
}) {
  if (!isAdminAppRoute(input.pathname)) {
    return null;
  }

  const isAdmin = await isUserIdAdmin(input.supabase, input.userId);

  if (isAdmin) {
    return null;
  }

  await input.supabase.auth.signOut();

  return buildLoginRedirectPath({
    errorMessage: ADMIN_AUTH_ACCESS_DENIED_MESSAGE,
  });
}
