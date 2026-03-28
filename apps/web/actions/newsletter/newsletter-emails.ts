import "server-only";

import type { CreateEmailOptions } from "resend";

import { newsletterSignupContent } from "@/constants/newsletter/content";
import { serverEnv } from "@/lib/env/server";
import { sendResendEmail } from "@/lib/resend/client";

import type { NewsletterSignupInput } from "./schemas";

export interface NewsletterConfirmationEmailPayload {
  confirmUrl: string;
  email: string;
  expiresAt: Date;
  pagePath: string;
  placement: NewsletterSignupInput["placement"];
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function createNewsletterConfirmationExpiry() {
  return new Date(Date.now() + 48 * 60 * 60 * 1000);
}

export function buildNewsletterConfirmationEmailPayload(input: {
  email: string;
  placement: NewsletterSignupInput["placement"];
  pagePath: string;
  token: string;
}) {
  const confirmUrl = new URL("/newsletter/confirm", serverEnv.siteUrl);

  confirmUrl.searchParams.set("email", input.email);
  confirmUrl.searchParams.set("token", input.token);

  return {
    confirmUrl: confirmUrl.toString(),
    email: input.email,
    expiresAt: createNewsletterConfirmationExpiry(),
    pagePath: input.pagePath,
    placement: input.placement,
  };
}

export function buildNewsletterConfirmationEmail(
  payload: NewsletterConfirmationEmailPayload,
): CreateEmailOptions {
  const expiresAtLabel = payload.expiresAt.toISOString();
  const placementLabel = payload.placement;
  const text = [
    "Confirm your newsletter signup",
    "",
    `You recently requested to subscribe from ${payload.pagePath}.`,
    `Placement: ${placementLabel}`,
    `Confirm here: ${payload.confirmUrl}`,
    `This link expires at ${expiresAtLabel}.`,
  ].join("\n");

  return {
    from: serverEnv.contactFromEmail!,
    html: [
      '<div style="font-family:Arial,sans-serif;color:#111311;line-height:1.6;">',
      '<h1 style="font-size:24px;line-height:1.1;margin:0 0 16px;">Confirm your newsletter signup</h1>',
      `<p style="margin:0 0 16px;">Use the button below to confirm the subscription request from <strong>${escapeHtml(
        payload.pagePath,
      )}</strong>.</p>`,
      `<p style="margin:0 0 16px;"><a href="${escapeHtml(
        payload.confirmUrl,
      )}" style="display:inline-block;border-radius:9999px;background:#111311;color:#f5f4f0;padding:14px 24px;text-decoration:none;text-transform:uppercase;letter-spacing:0.14em;font-size:12px;">Confirm subscription</a></p>`,
      `<p style="margin:0;color:#676b65;">This link expires in 48 hours. If you did not request this, you can ignore the email.</p>`,
      "</div>",
    ].join(""),
    subject: "Confirm your newsletter signup",
    text,
    to: payload.email,
  };
}

export async function sendNewsletterConfirmationEmail(
  payload: NewsletterConfirmationEmailPayload,
) {
  return sendResendEmail(buildNewsletterConfirmationEmail(payload));
}

export function getNewsletterConfirmationMessage() {
  return newsletterSignupContent.states.pending;
}
