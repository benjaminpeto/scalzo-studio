import "server-only";

import { z } from "zod";

import { publicEnv, publicFeatureFlags } from "./public";

const optionalString = () =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().min(1).optional(),
  );
const optionalEmail = () =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.email().optional(),
  );

const serverEnvSchema = z
  .object({
    SUPABASE_SERVICE_ROLE_KEY: optionalString(),
    RESEND_API_KEY: optionalString(),
    CONTACT_TO_EMAIL: optionalEmail(),
    CONTACT_EMAIL: optionalEmail(),
    TURNSTILE_SECRET_KEY: optionalString(),
    TURNSTILE_SITE_KEY: optionalString(),
  })
  .superRefine((value, ctx) => {
    if (
      value.RESEND_API_KEY &&
      !value.CONTACT_TO_EMAIL &&
      !value.CONTACT_EMAIL
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Set CONTACT_TO_EMAIL or CONTACT_EMAIL when RESEND_API_KEY is configured.",
        path: ["CONTACT_TO_EMAIL"],
      });
    }

    if (
      value.TURNSTILE_SECRET_KEY &&
      !value.TURNSTILE_SITE_KEY &&
      !publicEnv.turnstileSiteKey
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Set NEXT_PUBLIC_TURNSTILE_SITE_KEY or TURNSTILE_SITE_KEY when TURNSTILE_SECRET_KEY is configured.",
        path: ["TURNSTILE_SECRET_KEY"],
      });
    }
  });

function formatEnvIssues(error: z.ZodError, scope: string) {
  const issues = error.issues
    .map((issue) => {
      const path = issue.path.join(".") || "root";
      return `- ${path}: ${issue.message}`;
    })
    .join("\n");

  return `Invalid ${scope} environment variables:\n${issues}`;
}

function parseServerEnv() {
  const result = serverEnvSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
    CONTACT_EMAIL: process.env.CONTACT_EMAIL,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY,
  });

  if (!result.success) {
    throw new Error(formatEnvIssues(result.error, "server"));
  }

  return result.data;
}

const rawServerEnv = parseServerEnv();

export const serverEnv = {
  ...publicEnv,
  supabaseServiceRoleKey: rawServerEnv.SUPABASE_SERVICE_ROLE_KEY,
  resendApiKey: rawServerEnv.RESEND_API_KEY,
  contactToEmail: rawServerEnv.CONTACT_TO_EMAIL ?? rawServerEnv.CONTACT_EMAIL,
  turnstileSecretKey: rawServerEnv.TURNSTILE_SECRET_KEY,
  turnstileSiteKey:
    publicEnv.turnstileSiteKey ?? rawServerEnv.TURNSTILE_SITE_KEY,
} as const;

export const serverFeatureFlags = {
  ...publicFeatureFlags,
  contactNotificationsEnabled: Boolean(
    serverEnv.resendApiKey && serverEnv.contactToEmail,
  ),
  serviceRoleEnabled: Boolean(serverEnv.supabaseServiceRoleKey),
  turnstileEnabled: Boolean(
    serverEnv.turnstileSecretKey && serverEnv.turnstileSiteKey,
  ),
} as const;
