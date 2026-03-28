"use server";

import { serverFeatureFlags } from "@/lib/env/server";
import type { Database } from "@/lib/supabase/database.types";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";
import type { SubmitQuoteRequestState } from "@/interfaces/contact/form";

import {
  buildFieldErrors,
  buildLeadMessage,
  normalizeString,
  readLeadFormData,
} from "./helpers";
import { contactLeadSchema } from "./schemas";

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
