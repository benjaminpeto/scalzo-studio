import type { ContactFieldName } from "@/lib/content/contact";

export type QuoteFormValues = {
  budgetBand: string;
  company: string;
  consent: boolean;
  email: string;
  honeypot: string;
  location: string;
  message: string;
  name: string;
  primaryGoal: string;
  projectType: string;
  servicesInterest: string[];
  timelineBand: string;
  website: string;
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
