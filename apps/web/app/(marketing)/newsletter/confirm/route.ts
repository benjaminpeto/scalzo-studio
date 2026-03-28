import { handleNewsletterConfirmRequest } from "@/actions/newsletter/confirm-newsletter-signup";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  redirect(
    await handleNewsletterConfirmRequest({
      email: searchParams.get("email"),
      token: searchParams.get("token"),
    }),
  );
}
