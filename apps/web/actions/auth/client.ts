"use client";

import {
  ADMIN_AUTH_ACCESS_DENIED_MESSAGE,
  buildAuthConfirmUrl,
  buildPasswordUpdateUrl,
} from "@/lib/supabase/auth-flow";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

async function getAuthenticatedBrowserUserId() {
  const supabase = createBrowserSupabaseClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    throw new Error("Unable to resolve the authenticated account.");
  }

  return claimsData.claims.sub;
}

export async function ensureBrowserUserIsAdmin() {
  const supabase = createBrowserSupabaseClient();
  const userId = await getAuthenticatedBrowserUserId();
  const { data: adminRow, error: adminError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (adminError) {
    throw new Error("Unable to verify admin access.");
  }

  if (!adminRow) {
    await supabase.auth.signOut();
    throw new Error(ADMIN_AUTH_ACCESS_DENIED_MESSAGE);
  }
}

export async function signInAdminWithPassword(input: {
  email: string;
  password: string;
}) {
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(input);

  if (error) {
    throw error;
  }

  await ensureBrowserUserIsAdmin();
}

export async function requestAdminMagicLink(input: {
  email: string;
  next: string;
  origin: string;
}) {
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: input.email,
    options: {
      emailRedirectTo: buildAuthConfirmUrl(input.origin, input.next),
      shouldCreateUser: false,
    },
  });

  if (error) {
    throw error;
  }
}

export async function signUpWithEmail(input: {
  email: string;
  origin: string;
  password: string;
}) {
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: buildAuthConfirmUrl(input.origin),
    },
  });

  if (error) {
    throw error;
  }
}

export async function requestPasswordReset(input: {
  email: string;
  origin: string;
}) {
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
    redirectTo: buildPasswordUpdateUrl(input.origin),
  });

  if (error) {
    throw error;
  }
}

export async function updateCurrentUserPassword(input: { password: string }) {
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.auth.updateUser({
    password: input.password,
  });

  if (error) {
    throw error;
  }
}

export async function signOutCurrentUser() {
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
