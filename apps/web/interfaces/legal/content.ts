export type LegalStatus = "Live" | "Conditional";

export type LegalSummaryItem = {
  detail: string;
  label: string;
  value: string;
};

export type LegalSectionContent = {
  id: string;
  items?: readonly string[];
  note?: string;
  paragraphs: readonly string[];
  title: string;
};

export type PrivacyProcessingActivity = {
  dataCategories: readonly string[];
  lawfulBasis: string;
  note?: string;
  purpose: string;
  recipients: readonly string[];
  retention: string;
  status: LegalStatus;
  title: string;
};

export type LegalProcessorDisclosure = {
  detail: string;
  name: string;
  note?: string;
  role: string;
  status: LegalStatus;
};

export type CookieCategoryDisclosure = {
  examples: readonly string[];
  legalBasis: string;
  note?: string;
  purpose: string;
  status: "Active" | "Inactive until enabled";
  title: string;
};
