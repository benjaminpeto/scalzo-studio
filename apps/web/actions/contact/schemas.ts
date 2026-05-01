import { z } from "zod";

import {
  contactBudgetOptions,
  contactLocationOptions,
  contactProjectTypeOptions,
  contactServiceOptions,
  contactTimelineOptions,
} from "@/constants/contact/content";

const serviceValues = contactServiceOptions.map((option) => option.value);
const projectTypeValues = contactProjectTypeOptions.map(
  (option) => option.value,
);
const locationValues = contactLocationOptions.map((option) => option.value);
const budgetValues = contactBudgetOptions.map((option) => option.value);
const timelineValues = contactTimelineOptions.map((option) => option.value);
const budgetValueSet = new Set<string>(budgetValues);
const timelineValueSet = new Set<string>(timelineValues);

const optionalString = () =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().max(200).optional(),
  );

export interface ContactLeadSchemaMessages {
  budgetBand: string;
  consent: string;
  email: string;
  message: string;
  name: string;
  primaryGoal: string;
  servicesInterest: string;
  timelineBand: string;
}

export function createContactLeadSchema(messages: ContactLeadSchemaMessages) {
  return z.object({
    budgetBand: z.string().refine((value) => budgetValueSet.has(value), {
      message: messages.budgetBand,
    }),
    company: optionalString(),
    consent: z.string().refine((value) => value === "true", {
      message: messages.consent,
    }),
    email: z.email(messages.email),
    location: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.enum(locationValues as [string, ...string[]]).optional(),
    ),
    message: z
      .string()
      .trim()
      .min(24, messages.message)
      .max(3000, "Keep the brief under 3000 characters."),
    name: z
      .string()
      .trim()
      .min(2, messages.name)
      .max(120, "Keep the name under 120 characters."),
    pagePath: z.string().trim().min(1).max(200).default("/contact"),
    primaryGoal: z
      .string()
      .trim()
      .min(8, messages.primaryGoal)
      .max(200, "Keep the main goal under 200 characters."),
    projectType: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.enum(projectTypeValues as [string, ...string[]]).optional(),
    ),
    referrer: optionalString(),
    servicesInterest: z
      .array(z.enum(serviceValues as [string, ...string[]]))
      .min(1, messages.servicesInterest),
    timelineBand: z.string().refine((value) => timelineValueSet.has(value), {
      message: messages.timelineBand,
    }),
    utmCampaign: optionalString(),
    utmContent: optionalString(),
    utmMedium: optionalString(),
    utmSource: optionalString(),
    utmTerm: optionalString(),
    website: optionalString(),
  });
}

export type ContactLeadInput = z.infer<
  ReturnType<typeof createContactLeadSchema>
>;
