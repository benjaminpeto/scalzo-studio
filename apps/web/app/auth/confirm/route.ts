import { handleAuthConfirmCallback } from "@/actions/auth/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  redirect(
    await handleAuthConfirmCallback({
      code: searchParams.get("code"),
      next: searchParams.get("next"),
      tokenHash: searchParams.get("token_hash"),
      type: searchParams.get("type") as EmailOtpType | null,
    }),
  );
}
