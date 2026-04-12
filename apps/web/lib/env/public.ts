import { z } from "zod";

const analyticsProviderSchema = z.enum(["posthog", "plausible"]);
const optionalString = () =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().min(1).optional(),
  );
const optionalUrl = () =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.url().optional(),
  );

const publicEnvSchema = z
  .object({
    NEXT_PUBLIC_SITE_URL: z.url(),
    NEXT_PUBLIC_SUPABASE_URL: z.url(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: optionalString(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString(),
    NEXT_PUBLIC_ANALYTICS_PROVIDER: z.preprocess(
      (value) => (value === "" ? undefined : value),
      analyticsProviderSchema.optional(),
    ),
    NEXT_PUBLIC_CAL_BOOKING_URL: optionalUrl(),
    NEXT_PUBLIC_HCAPTCHA_SITE_KEY: optionalString(),
  })
  .superRefine((value, ctx) => {
    if (
      !value.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
      !value.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        path: ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"],
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

function parsePublicEnv() {
  const result = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_ANALYTICS_PROVIDER: process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER,
    NEXT_PUBLIC_CAL_BOOKING_URL: process.env.NEXT_PUBLIC_CAL_BOOKING_URL,
    NEXT_PUBLIC_HCAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY,
  });

  if (!result.success) {
    throw new Error(formatEnvIssues(result.error, "public"));
  }

  return result.data;
}

const rawPublicEnv = parsePublicEnv();

export const publicEnv = {
  siteUrl: rawPublicEnv.NEXT_PUBLIC_SITE_URL,
  supabaseUrl: rawPublicEnv.NEXT_PUBLIC_SUPABASE_URL,
  supabasePublishableKey:
    rawPublicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    rawPublicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  analyticsProvider: rawPublicEnv.NEXT_PUBLIC_ANALYTICS_PROVIDER,
  calBookingUrl: rawPublicEnv.NEXT_PUBLIC_CAL_BOOKING_URL,
  hcaptchaSiteKey: rawPublicEnv.NEXT_PUBLIC_HCAPTCHA_SITE_KEY,
} as const;

export const publicFeatureFlags = {
  analyticsEnabled: Boolean(publicEnv.analyticsProvider),
  calBookingEnabled: Boolean(publicEnv.calBookingUrl),
  hcaptchaEnabled: Boolean(publicEnv.hcaptchaSiteKey),
} as const;
