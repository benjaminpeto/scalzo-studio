import type { SubmitQuoteRequestState } from "@/interfaces/contact/form";
import type {
  QuoteRequestFormSnapshot,
  QuoteRequestWatchdogContext,
} from "@/interfaces/contact/quote-request";
import { getContactPublicContent } from "@/constants/contact/public-content";
import { serverFeatureFlags } from "@/lib/env/server";

import {
  buildFieldErrors,
  buildQuoteRequestLogContext,
  normalizeString,
  readLeadFormData,
} from "./helpers";
import { createContactLeadSchema } from "./schemas";

function filterServicesInterest(entries: FormDataEntryValue[]) {
  return entries.filter(
    (entry): entry is string => typeof entry === "string" && Boolean(entry),
  );
}

function getEmailDomain(value: string) {
  return value.includes("@") ? (value.split("@")[1] ?? null) : null;
}

export function createQuoteRequestErrorState(input: {
  captchaError?: string | null;
  fieldErrors?: SubmitQuoteRequestState["fieldErrors"];
  message: string;
}): SubmitQuoteRequestState {
  return {
    captchaError: input.captchaError ?? null,
    fieldErrors: input.fieldErrors ?? {},
    message: input.message,
    status: "error",
  };
}

export function createQuoteRequestSuccessState(
  locale = "en",
): SubmitQuoteRequestState {
  const content = getContactPublicContent(locale);

  return {
    captchaError: null,
    fieldErrors: {},
    message: content.errors.success,
    status: "success",
  };
}

export function prepareQuoteRequestSubmission(formData: FormData) {
  const rawInput = readLeadFormData(formData);
  const locale = normalizeString(formData.get("locale")) === "es" ? "es" : "en";
  const errorMessages = getContactPublicContent(locale).errors;
  const servicesInterest = filterServicesInterest(rawInput.servicesInterest);
  const pagePath = normalizeString(rawInput.pagePath) || "/contact";
  const email = normalizeString(rawInput.email);
  const snapshot: QuoteRequestFormSnapshot = {
    budgetBand: normalizeString(rawInput.budgetBand),
    company: normalizeString(rawInput.company),
    consent: normalizeString(rawInput.consent),
    email,
    hCaptchaToken: normalizeString(rawInput.hCaptchaToken).trim(),
    location: normalizeString(rawInput.location),
    message: normalizeString(rawInput.message),
    name: normalizeString(rawInput.name),
    newsletterOptIn: normalizeString(rawInput.newsletterOptIn) === "true",
    pagePath,
    primaryGoal: normalizeString(rawInput.primaryGoal),
    projectType: normalizeString(rawInput.projectType),
    referrer: normalizeString(rawInput.referrer),
    servicesInterest,
    timelineBand: normalizeString(rawInput.timelineBand),
    utmCampaign: normalizeString(rawInput.utmCampaign),
    utmContent: normalizeString(rawInput.utmContent),
    utmMedium: normalizeString(rawInput.utmMedium),
    utmSource: normalizeString(rawInput.utmSource),
    utmTerm: normalizeString(rawInput.utmTerm),
    website: normalizeString(rawInput.website),
  };
  const logContext = buildQuoteRequestLogContext(snapshot);
  const watchdogContext: QuoteRequestWatchdogContext = {
    emailDomain: getEmailDomain(snapshot.email),
    hcaptchaEnabled: serverFeatureFlags.hcaptchaEnabled,
    pagePath: snapshot.pagePath,
    serviceRoleEnabled: serverFeatureFlags.serviceRoleEnabled,
  };
  const parsedInput = createContactLeadSchema(errorMessages).safeParse({
    budgetBand: snapshot.budgetBand,
    company: snapshot.company,
    consent: snapshot.consent,
    email: snapshot.email,
    location: snapshot.location,
    message: snapshot.message,
    name: snapshot.name,
    pagePath: snapshot.pagePath,
    primaryGoal: snapshot.primaryGoal,
    projectType: snapshot.projectType,
    referrer: snapshot.referrer,
    servicesInterest: snapshot.servicesInterest,
    timelineBand: snapshot.timelineBand,
    utmCampaign: snapshot.utmCampaign,
    utmContent: snapshot.utmContent,
    utmMedium: snapshot.utmMedium,
    utmSource: snapshot.utmSource,
    utmTerm: snapshot.utmTerm,
    website: snapshot.website,
  });

  if (!parsedInput.success) {
    return {
      logContext,
      state: createQuoteRequestErrorState({
        fieldErrors: buildFieldErrors(parsedInput.error),
        message: errorMessages.general,
      }),
      locale,
      validationIssueFields: Object.keys(buildFieldErrors(parsedInput.error)),
      watchdogContext,
    };
  }

  return {
    hCaptchaToken: snapshot.hCaptchaToken,
    input: parsedInput.data,
    locale,
    logContext,
    newsletterOptIn: snapshot.newsletterOptIn,
    watchdogContext,
  };
}
