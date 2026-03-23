import "server-only";

import { type EmailOtpType } from "@supabase/supabase-js";

import {
  ADMIN_AUTH_ACCESS_DENIED_MESSAGE,
  normalizeAuthRedirectPath,
} from "@/lib/supabase/auth-flow";
import { getCurrentUserAdminState } from "@/lib/supabase/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type ServerSupabaseClient = Awaited<
  ReturnType<typeof createServerSupabaseClient>
>;

function buildLoginErrorRedirect(message: string) {
  return `/auth/login?error=${encodeURIComponent(message)}`;
}

function buildAuthErrorRedirect(message: string) {
  return `/auth/error?error=${encodeURIComponent(message)}`;
}

async function requireCurrentSessionAdmin(supabase: ServerSupabaseClient) {
  const { isAdmin } = await getCurrentUserAdminState(supabase);

  if (!isAdmin) {
    await supabase.auth.signOut();
    return buildLoginErrorRedirect(ADMIN_AUTH_ACCESS_DENIED_MESSAGE);
  }

  return null;
}

export async function handleAuthConfirmCallback(input: {
  code?: string | null;
  next?: string | null;
  tokenHash?: string | null;
  type?: EmailOtpType | null;
}) {
  const supabase = await createServerSupabaseClient();
  const next = normalizeAuthRedirectPath(input.next);

  if (input.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(input.code);

    if (error) {
      return buildAuthErrorRedirect(error.message);
    }

    const adminRedirect = await requireCurrentSessionAdmin(supabase);

    return adminRedirect ?? next;
  }

  if (input.tokenHash && input.type) {
    const { error } = await supabase.auth.verifyOtp({
      type: input.type,
      token_hash: input.tokenHash,
    });

    if (error) {
      return buildAuthErrorRedirect(error.message);
    }

    if (input.type === "magiclink") {
      const adminRedirect = await requireCurrentSessionAdmin(supabase);

      return adminRedirect ?? next;
    }

    return next;
  }

  return buildAuthErrorRedirect("No token hash, code, or type");
}
