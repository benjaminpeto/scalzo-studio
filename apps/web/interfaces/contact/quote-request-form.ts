import type { ContactFieldName } from "@/interfaces/contact/form";

export type QuoteFormValues = {
  servicesInterest: string[];
  primaryGoal: string;
  projectType: string;
  company: string;
  website: string;
  location: string;
  name: string;
  email: string;
  budgetBand: string;
  timelineBand: string;
  message: string;
  consent: boolean;
  newsletterOptIn: boolean;
  honeypot: string;
};

export type UTMValues = {
  utmCampaign: string;
  utmContent: string;
  utmMedium: string;
  utmSource: string;
  utmTerm: string;
};

export type QuoteRequestFieldErrors = Partial<Record<ContactFieldName, string>>;

export type UpdateQuoteFormField = <K extends keyof QuoteFormValues>(
  field: K,
  nextValue: QuoteFormValues[K],
) => void;
