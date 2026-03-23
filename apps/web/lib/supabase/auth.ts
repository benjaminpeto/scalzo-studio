import "server-only";

import type { JwtPayload } from "@supabase/supabase-js";

import { ADMIN_AUTH_ACCESS_DENIED_MESSAGE } from "@/lib/supabase/auth-flow";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type CurrentUserClaims = JwtPayload & {
  email?: string;
  sub: string;
};

export interface CurrentUser {
  claims: CurrentUserClaims;
  email: string | null;
  id: string;
}

export interface CurrentUserAdminState {
  errorMessage: string | null;
  isAdmin: boolean;
  user: CurrentUser | null;
  userId: string | null;
}

type ServerSupabaseClient = Awaited<
  ReturnType<typeof createServerSupabaseClient>
>;

async function getAdminStateForUserId(
  supabase: ServerSupabaseClient,
  userId: string,
) {
  const { data: adminRow, error: adminError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  return !adminError && Boolean(adminRow);
}

async function resolveCurrentUser(
  supabase: ServerSupabaseClient,
): Promise<CurrentUser | null> {
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (error || !claims?.sub) {
    return null;
  }

  const currentUserClaims = claims as CurrentUserClaims;

  return {
    claims: currentUserClaims,
    email:
      typeof currentUserClaims.email === "string"
        ? currentUserClaims.email
        : null,
    id: currentUserClaims.sub,
  };
}

export async function getCurrentUser(supabase?: ServerSupabaseClient) {
  const resolvedSupabase = supabase ?? (await createServerSupabaseClient());

  return resolveCurrentUser(resolvedSupabase);
}

export async function getCurrentUserAdminState(
  supabase?: ServerSupabaseClient,
): Promise<CurrentUserAdminState> {
  const resolvedSupabase = supabase ?? (await createServerSupabaseClient());
  const user = await resolveCurrentUser(resolvedSupabase);

  if (!user) {
    return {
      errorMessage: null,
      isAdmin: false,
      user: null,
      userId: null,
    };
  }

  const isAdmin = await getAdminStateForUserId(resolvedSupabase, user.id);

  return {
    errorMessage: isAdmin ? null : ADMIN_AUTH_ACCESS_DENIED_MESSAGE,
    isAdmin,
    user,
    userId: user.id,
  };
}

export async function isCurrentUserAdmin() {
  const { isAdmin } = await getCurrentUserAdminState();

  return isAdmin;
}
