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

export const contactLeadSchema = z.object({
  budgetBand: z.string().refine((value) => budgetValueSet.has(value), {
    message: "Choose the budget band that feels closest to the project.",
  }),
  company: optionalString(),
  consent: z.string().refine((value) => value === "true", {
    message: "Consent is required before submitting the request.",
  }),
  email: z.email("Enter a valid email address."),
  location: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(locationValues as [string, ...string[]]).optional(),
  ),
  message: z
    .string()
    .trim()
    .min(24, "Add a bit more detail so the first response can be useful.")
    .max(3000, "Keep the brief under 3000 characters."),
  name: z
    .string()
    .trim()
    .min(2, "Enter the name of the main contact.")
    .max(120, "Keep the name under 120 characters."),
  pagePath: z.string().trim().min(1).max(200).default("/contact"),
  primaryGoal: z
    .string()
    .trim()
    .min(8, "Add the main goal or commercial shift you want.")
    .max(200, "Keep the main goal under 200 characters."),
  projectType: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(projectTypeValues as [string, ...string[]]).optional(),
  ),
  referrer: optionalString(),
  servicesInterest: z
    .array(z.enum(serviceValues as [string, ...string[]]))
    .min(1, "Choose at least one service area."),
  timelineBand: z.string().refine((value) => timelineValueSet.has(value), {
    message: "Choose the timeline that feels closest to the current plan.",
  }),
  utmCampaign: optionalString(),
  utmContent: optionalString(),
  utmMedium: optionalString(),
  utmSource: optionalString(),
  utmTerm: optionalString(),
  website: optionalString(),
});

export type ContactLeadInput = z.infer<typeof contactLeadSchema>;
