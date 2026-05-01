import { createHash, randomBytes } from "node:crypto";

import type {
  NewsletterConfirmationEmailPayload,
  NewsletterPersistenceErrorInput,
  SubmitNewsletterSignupState,
} from "@/interfaces/newsletter/form";
import { serverEnv } from "@/lib/env/server";
import { CreateEmailOptions } from "resend";
import { NewsletterSignupInput } from "./schemas";

export function buildNewsletterFieldErrors(error: {
  issues: Array<{ message: string; path: PropertyKey[] }>;
}) {
  const fieldErrors: SubmitNewsletterSignupState["fieldErrors"] = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (field === "email" && !fieldErrors.email) {
      fieldErrors.email = issue.message;
    }
  }

  return fieldErrors;
}

export function hashNewsletterToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createNewsletterConfirmationToken() {
  return randomBytes(32).toString("base64url");
}

export function buildNewsletterSignupLogContext(input: {
  email?: string | null;
  pagePath?: string | null;
  placement?: string | null;
}) {
  return {
    emailDomain:
      input.email && input.email.includes("@")
        ? (input.email.split("@")[1] ?? null)
        : null,
    pagePath: input.pagePath ?? "/",
    placement: input.placement ?? null,
  };
}

export function serializeNewsletterErrorForLog(error: unknown) {
  if (error instanceof Error) {
    return {
      code:
        "code" in error && typeof error.code === "string" ? error.code : null,
      details:
        "details" in error && typeof error.details === "string"
          ? error.details
          : null,
      hint:
        "hint" in error && typeof error.hint === "string" ? error.hint : null,
      message: error.message,
      name: error.name,
      statusCode:
        "statusCode" in error && typeof error.statusCode === "number"
          ? error.statusCode
          : null,
    };
  }

  return {
    value: String(error),
  };
}

export function buildNewsletterConfirmedPath(
  status: "confirmed" | "error" | "expired" | "invalid",
) {
  return `/newsletter/confirmed?status=${status}`;
}

export function normalizeEmail(email: string | null | undefined) {
  const value = email?.trim().toLowerCase();

  if (!value || !/^\S+@\S+\.\S+$/.test(value)) {
    return null;
  }

  return value;
}

class NewsletterPersistenceError extends Error {
  code: string | null;
  details: string | null;
  hint: string | null;

  constructor(input: NewsletterPersistenceErrorInput) {
    super(input.message);

    this.name = input.name;
    this.code = input.code ?? null;
    this.details = input.details ?? null;
    this.hint = input.hint ?? null;
  }
}

export function createPersistenceError(
  name: NewsletterPersistenceErrorInput["name"],
  error: {
    code?: string | null;
    details?: string | null;
    hint?: string | null;
    message: string;
  },
) {
  return new NewsletterPersistenceError({
    code: error.code,
    details: error.details,
    hint: error.hint,
    message: error.message,
    name,
  });
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
