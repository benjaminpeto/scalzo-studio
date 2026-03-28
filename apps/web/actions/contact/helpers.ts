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

export function readLeadFormData(formData: FormData) {
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
