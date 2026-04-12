import { contactFieldStepMap } from "@/constants/contact/content";
import type { SubmitQuoteRequestState } from "@/interfaces/contact/form";

export function buildLeadMessage(input: {
  location?: string | null;
  message: string;
  primaryGoal: string;
  projectType?: string | null;
  website?: string | null;
}) {
  const contextLines = [
    `Primary goal: ${input.primaryGoal}`,
    input.projectType ? `Project type: ${input.projectType}` : null,
    input.location ? `Location: ${input.location}` : null,
    input.website ? `Website / profile: ${input.website}` : null,
  ].filter(Boolean);

  return `${contextLines.join("\n")}\n\nBrief:\n${input.message}`;
}

export function buildFieldErrors(error: {
  issues: Array<{ message: string; path: PropertyKey[] }>;
}) {
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

export function normalizeString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function normalizeOptionalString(value: string | null | undefined) {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : null;
}

export function buildQuoteRequestLogContext(input: {
  budgetBand?: string | null;
  newsletterOptIn?: boolean;
  pagePath?: string | null;
  projectType?: string | null;
  referrer?: string | null;
  servicesInterest?: string[];
  timelineBand?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmMedium?: string | null;
  utmSource?: string | null;
  utmTerm?: string | null;
  website?: string | null;
}) {
  return {
    budgetBand: normalizeOptionalString(input.budgetBand),
    hasReferrer: Boolean(normalizeOptionalString(input.referrer)),
    hasUtm: Boolean(
      normalizeOptionalString(input.utmCampaign) ||
      normalizeOptionalString(input.utmContent) ||
      normalizeOptionalString(input.utmMedium) ||
      normalizeOptionalString(input.utmSource) ||
      normalizeOptionalString(input.utmTerm),
    ),
    hasWebsite: Boolean(normalizeOptionalString(input.website)),
    newsletterOptIn: Boolean(input.newsletterOptIn),
    pagePath: normalizeOptionalString(input.pagePath) ?? "/contact",
    projectType: normalizeOptionalString(input.projectType),
    servicesInterest: (input.servicesInterest ?? []).filter(Boolean),
    timelineBand: normalizeOptionalString(input.timelineBand),
  };
}

export function serializeErrorForLog(error: unknown) {
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

export function readLeadFormData(formData: FormData) {
  return {
    budgetBand: formData.get("budgetBand"),
    company: formData.get("company"),
    consent: formData.get("consent"),
    email: formData.get("email"),
    hCaptchaToken: formData.get("hCaptchaToken"),
    location: formData.get("location"),
    message: formData.get("message"),
    name: formData.get("name"),
    newsletterOptIn: formData.get("newsletterOptIn"),
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
