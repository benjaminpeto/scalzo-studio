import { z } from "zod";

const newsletterPlacementValues = [
  "home",
  "insights-index",
  "insights-detail",
  "footer",
] as const;

export const newsletterSignupSchema = z.object({
  email: z
    .email("Enter a valid email address.")
    .transform((value) => value.trim().toLowerCase()),
  pagePath: z.string().trim().min(1).max(200),
  placement: z.enum(newsletterPlacementValues),
});

export type NewsletterSignupInput = z.infer<typeof newsletterSignupSchema>;
