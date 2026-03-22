import "server-only";

import { createClient } from "@supabase/supabase-js";

import { serverEnv } from "@/lib/env/server";
import type { Database } from "@/lib/supabase/database.types";

function getServiceRoleKey() {
  if (!serverEnv.supabaseServiceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required to create the service-role Supabase client.",
    );
  }

  return serverEnv.supabaseServiceRoleKey;
}

export function createServiceRoleSupabaseClient() {
  return createClient<Database>(serverEnv.supabaseUrl, getServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
