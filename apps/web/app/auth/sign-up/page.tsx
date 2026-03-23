import { SELF_SERVICE_SIGN_UP_DISABLED_MESSAGE } from "@/lib/supabase/auth-flow";
import { redirect } from "next/navigation";

export default function Page() {
  redirect(
    `/auth/login?error=${encodeURIComponent(SELF_SERVICE_SIGN_UP_DISABLED_MESSAGE)}`,
  );
}
