import { createHash, randomBytes } from "node:crypto";

import type { SubmitNewsletterSignupState } from "@/interfaces/newsletter/form";

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
      message: error.message,
      name: error.name,
    };
  }

  return {
    value: String(error),
  };
}
