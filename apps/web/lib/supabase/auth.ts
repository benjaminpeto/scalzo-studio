import "server-only";

import type { JwtPayload } from "@supabase/supabase-js";

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
  isAdmin: boolean;
  user: CurrentUser | null;
  userId: string | null;
}

type ServerSupabaseClient = Awaited<
  ReturnType<typeof createServerSupabaseClient>
>;

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

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();

  return resolveCurrentUser(supabase);
}

export async function getCurrentUserAdminState(): Promise<CurrentUserAdminState> {
  const supabase = await createServerSupabaseClient();
  const user = await resolveCurrentUser(supabase);

  if (!user) {
    return {
      isAdmin: false,
      user: null,
      userId: null,
    };
  }

  const { data: adminRow, error: adminError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    isAdmin: !adminError && Boolean(adminRow),
    user,
    userId: user.id,
  };
}

export async function isCurrentUserAdmin() {
  const { isAdmin } = await getCurrentUserAdminState();

  return isAdmin;
}
