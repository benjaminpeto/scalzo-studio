"use server";

import { z } from "zod";

import {
  contactBudgetOptions,
  contactFieldStepMap,
  contactLocationOptions,
  contactProjectTypeOptions,
  contactServiceOptions,
  contactTimelineOptions,
  type SubmitQuoteRequestState,
} from "@/lib/content/contact";
import { serverFeatureFlags } from "@/lib/env/server";
import type { Database } from "@/lib/supabase/database.types";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

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

const contactLeadSchema = z.object({
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

type ContactLeadInput = z.infer<typeof contactLeadSchema>;

function buildLeadMessage(input: ContactLeadInput) {
  const contextLines = [
    `Primary goal: ${input.primaryGoal}`,
    input.projectType ? `Project type: ${input.projectType}` : null,
    input.location ? `Location: ${input.location}` : null,
    input.website ? `Website / profile: ${input.website}` : null,
  ].filter(Boolean);

  return `${contextLines.join("\n")}\n\nBrief:\n${input.message}`;
}

function buildFieldErrors(error: z.ZodError<ContactLeadInput>) {
  const nextFieldErrors: SubmitQuoteRequestState["fieldErrors"] = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (
      typeof field === "string" &&
      field in contactFieldStepMap &&
      !nextFieldErrors[field as keyof typeof nextFieldErrors]
    ) {
      nextFieldErrors[field as keyof typeof nextFieldErrors] = issue.message;
    }
  }

  return nextFieldErrors;
}

function readLeadFormData(formData: FormData) {
  return {
    budgetBand: formData.get("budgetBand"),
    company: formData.get("company"),
    consent: formData.get("consent"),
    email: formData.get("email"),
    honeypot: formData.get("companyWebsite"),
    location: formData.get("location"),
    message: formData.get("message"),
    name: formData.get("name"),
    pagePath: formData.get("pagePath"),
    primaryGoal: formData.get("primaryGoal"),
    projectType: formData.get("projectType"),
    referrer: formData.get("referrer"),
    servicesInterest: formData.getAll("servicesInterest"),
    timelineBand: formData.get("timelineBand"),
    utmCampaign: formData.get("utmCampaign"),
    utmContent: formData.get("utmContent"),
    utmMedium: formData.get("utmMedium"),
    utmSource: formData.get("utmSource"),
    utmTerm: formData.get("utmTerm"),
    website: formData.get("website"),
  };
}

function normalizeString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export async function submitQuoteRequest(
  _prevState: SubmitQuoteRequestState,
  formData: FormData,
): Promise<SubmitQuoteRequestState> {
  const rawInput = readLeadFormData(formData);

  if (normalizeString(rawInput.honeypot).trim()) {
    return {
      status: "success",
      message: "Thanks. The request is in and will be reviewed shortly.",
      fieldErrors: {},
    };
  }

  const parsedInput = contactLeadSchema.safeParse({
    budgetBand: normalizeString(rawInput.budgetBand),
    company: normalizeString(rawInput.company),
    consent: normalizeString(rawInput.consent),
    email: normalizeString(rawInput.email),
    location: normalizeString(rawInput.location),
    message: normalizeString(rawInput.message),
    name: normalizeString(rawInput.name),
    pagePath: normalizeString(rawInput.pagePath) || "/contact",
    primaryGoal: normalizeString(rawInput.primaryGoal),
    projectType: normalizeString(rawInput.projectType),
    referrer: normalizeString(rawInput.referrer),
    servicesInterest: rawInput.servicesInterest.filter(
      (entry): entry is string => typeof entry === "string" && Boolean(entry),
    ),
    timelineBand: normalizeString(rawInput.timelineBand),
    utmCampaign: normalizeString(rawInput.utmCampaign),
    utmContent: normalizeString(rawInput.utmContent),
    utmMedium: normalizeString(rawInput.utmMedium),
    utmSource: normalizeString(rawInput.utmSource),
    utmTerm: normalizeString(rawInput.utmTerm),
    website: normalizeString(rawInput.website),
  });

  if (!parsedInput.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors: buildFieldErrors(parsedInput.error),
    };
  }

  if (!serverFeatureFlags.serviceRoleEnabled) {
    return {
      status: "error",
      message:
        "The contact form is temporarily unavailable. Email hello@scalzostudio.com instead.",
      fieldErrors: {},
    };
  }

  const input = parsedInput.data;
  const supabase = createServiceRoleSupabaseClient();
  const leadInsert: Database["public"]["Tables"]["leads"]["Insert"] = {
    budget_band: input.budgetBand,
    company: input.company,
    email: input.email,
    message: buildLeadMessage(input),
    name: input.name,
    page_path: input.pagePath,
    services_interest: input.servicesInterest,
    source_utm: {
      referrer: input.referrer ?? null,
      submitted_via: "contact-page",
      utm_campaign: input.utmCampaign ?? null,
      utm_content: input.utmContent ?? null,
      utm_medium: input.utmMedium ?? null,
      utm_source: input.utmSource ?? null,
      utm_term: input.utmTerm ?? null,
    },
    timeline_band: input.timelineBand,
    website: input.website,
  };

  const { error } = await supabase.from("leads").insert(leadInsert);

  if (error) {
    return {
      status: "error",
      message:
        "The request could not be saved right now. Please try again or email hello@scalzostudio.com.",
      fieldErrors: {},
    };
  }

  return {
    status: "success",
    message: "Thanks. The request is in and will be reviewed shortly.",
    fieldErrors: {},
  };
}
