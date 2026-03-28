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
const optionalMailbox = () =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    z
      .string()
      .trim()
      .refine(
        (candidate) =>
          /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(candidate) ||
          /^[^<>]+<\s*[^@\s]+@[^@\s]+\.[^@\s]+\s*>$/.test(candidate),
        {
          message:
            "Enter a valid mailbox such as hello@example.com or Studio <hello@example.com>.",
        },
      )
      .optional(),
  );

const serverEnvSchema = z
  .object({
    SUPABASE_SERVICE_ROLE_KEY: optionalString(),
    RESEND_API_KEY: optionalString(),
    RESEND_NEWSLETTER_TOPIC_ID: optionalString(),
    CAL_WEBHOOK_SECRET: optionalString(),
    CONTACT_TO_EMAIL: optionalEmail(),
    CONTACT_EMAIL: optionalEmail(),
    CONTACT_FROM_EMAIL: optionalMailbox(),
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

    if (value.RESEND_API_KEY && !value.CONTACT_FROM_EMAIL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Set CONTACT_FROM_EMAIL when RESEND_API_KEY is configured.",
        path: ["CONTACT_FROM_EMAIL"],
      });
    }

    if (value.RESEND_NEWSLETTER_TOPIC_ID && !value.RESEND_API_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Set RESEND_API_KEY when RESEND_NEWSLETTER_TOPIC_ID is configured.",
        path: ["RESEND_NEWSLETTER_TOPIC_ID"],
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
    RESEND_NEWSLETTER_TOPIC_ID: process.env.RESEND_NEWSLETTER_TOPIC_ID,
    CAL_WEBHOOK_SECRET: process.env.CAL_WEBHOOK_SECRET,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
    CONTACT_EMAIL: process.env.CONTACT_EMAIL,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
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
  resendNewsletterTopicId: rawServerEnv.RESEND_NEWSLETTER_TOPIC_ID,
  calWebhookSecret: rawServerEnv.CAL_WEBHOOK_SECRET,
  contactToEmail: rawServerEnv.CONTACT_TO_EMAIL ?? rawServerEnv.CONTACT_EMAIL,
  contactFromEmail: rawServerEnv.CONTACT_FROM_EMAIL,
  turnstileSecretKey: rawServerEnv.TURNSTILE_SECRET_KEY,
  turnstileSiteKey:
    publicEnv.turnstileSiteKey ?? rawServerEnv.TURNSTILE_SITE_KEY,
} as const;

export const serverFeatureFlags = {
  ...publicFeatureFlags,
  contactNotificationsEnabled: Boolean(
    serverEnv.resendApiKey &&
    serverEnv.contactToEmail &&
    serverEnv.contactFromEmail,
  ),
  newsletterSignupEnabled: Boolean(
    serverEnv.supabaseServiceRoleKey &&
    serverEnv.resendApiKey &&
    serverEnv.contactFromEmail &&
    serverEnv.resendNewsletterTopicId,
  ),
  calWebhookEnabled: Boolean(
    serverEnv.supabaseServiceRoleKey &&
    serverEnv.calWebhookSecret &&
    serverEnv.calBookingUrl,
  ),
  serviceRoleEnabled: Boolean(serverEnv.supabaseServiceRoleKey),
  turnstileEnabled: Boolean(
    serverEnv.turnstileSecretKey && serverEnv.turnstileSiteKey,
  ),
} as const;
