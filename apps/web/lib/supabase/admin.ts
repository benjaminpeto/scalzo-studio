import { createClient } from "@/lib/supabase/server";

export async function getCurrentUserAdminState() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return {
      isAdmin: false,
      userId: null,
    };
  }

  const userId = data.claims.sub;
  const { data: adminRow, error: adminError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  return {
    isAdmin: !adminError && Boolean(adminRow),
    userId,
  };
}
