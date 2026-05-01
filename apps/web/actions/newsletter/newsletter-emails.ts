import "server-only";

import { newsletterSignupContent } from "@/constants/newsletter/content";
import { sendResendEmail } from "@/lib/resend/client";

import { NewsletterConfirmationEmailPayload } from "@/interfaces/newsletter/form";
import { buildNewsletterConfirmationEmail } from "./helpers";

export async function sendNewsletterConfirmationEmail(
  payload: NewsletterConfirmationEmailPayload,
) {
  return sendResendEmail(buildNewsletterConfirmationEmail(payload));
}

export function getNewsletterConfirmationMessage() {
  return newsletterSignupContent.states.pending;
}
