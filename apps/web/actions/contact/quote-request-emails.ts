"use server";

import "server-only";

import { sendResendEmail } from "@/lib/resend/client";
import { QuoteRequestEmailPayload } from "@/interfaces/contact/quote-request";
import {
  buildInternalQuoteRequestEmail,
  buildQuoteRequestConfirmationEmail,
} from "./quote-request-emails.helpers";

export async function sendQuoteRequestEmails(
  payload: QuoteRequestEmailPayload,
) {
  const { serverEnv } = await import("@/lib/env/server");
  const envelope = {
    fromEmail: serverEnv.contactFromEmail!,
    toEmail: serverEnv.contactToEmail!,
  };

  const [confirmation, internal] = await Promise.allSettled([
    sendResendEmail(
      buildQuoteRequestConfirmationEmail(payload, {
        fromEmail: envelope.fromEmail,
        toEmail: payload.email,
      }),
    ),
    sendResendEmail(buildInternalQuoteRequestEmail(payload, envelope)),
  ]);

  return {
    confirmation,
    internal,
  };
}
