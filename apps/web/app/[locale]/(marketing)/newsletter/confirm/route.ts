import { handleNewsletterConfirmRequest } from "@/actions/newsletter/confirm-newsletter-signup";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const { searchParams } = new URL(request.url);

  const redirectPath = await handleNewsletterConfirmRequest({
    email: searchParams.get("email"),
    token: searchParams.get("token"),
  });

  const localizedPath = locale === "en" ? redirectPath : `/es${redirectPath}`;
  redirect(localizedPath);
}
