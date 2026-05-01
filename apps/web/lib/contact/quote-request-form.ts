import { getContactStepIndexForField } from "@/lib/contact/steps";
import type { ContactFieldName } from "@/interfaces/contact/form";
import type {
  QuoteFormValues,
  QuoteRequestFieldErrors,
  UTMValues,
} from "@/interfaces/contact/quote-request-form";

const emailPattern = /\S+@\S+\.\S+/;

export const initialQuoteFormValues: QuoteFormValues = {
  budgetBand: "",
  captchaToken: "",
  company: "",
  consent: false,
  email: "",
  location: "",
  message: "",
  name: "",
  newsletterOptIn: true,
  primaryGoal: "",
  projectType: "",
  servicesInterest: [],
  timelineBand: "",
  website: "",
};

export const initialQuoteUtmValues: UTMValues = {
  utmCampaign: "",
  utmContent: "",
  utmMedium: "",
  utmSource: "",
  utmTerm: "",
};

export function readUtmValues(search: string): UTMValues {
  const params = new URLSearchParams(search);

  return {
    utmCampaign: params.get("utm_campaign") ?? "",
    utmContent: params.get("utm_content") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmSource: params.get("utm_source") ?? "",
    utmTerm: params.get("utm_term") ?? "",
  };
}

function isValidEmail(value: string) {
  return emailPattern.test(value);
}

interface QuoteRequestValidationMessages {
  budgetBand: string;
  consent: string;
  email: string;
  message: string;
  name: string;
  primaryGoal: string;
  servicesInterest: string;
  timelineBand: string;
}

export function validateQuoteValues(
  values: QuoteFormValues,
  messages: QuoteRequestValidationMessages,
): QuoteRequestFieldErrors {
  const errors: QuoteRequestFieldErrors = {};

  if (!values.servicesInterest.length) {
    errors.servicesInterest = messages.servicesInterest;
  }

  if (values.primaryGoal.trim().length < 8) {
    errors.primaryGoal = messages.primaryGoal;
  }

  if (values.name.trim().length < 2) {
    errors.name = messages.name;
  }

  if (!isValidEmail(values.email.trim())) {
    errors.email = messages.email;
  }

  if (!values.budgetBand) {
    errors.budgetBand = messages.budgetBand;
  }

  if (!values.timelineBand) {
    errors.timelineBand = messages.timelineBand;
  }

  if (values.message.trim().length < 24) {
    errors.message = messages.message;
  }

  if (!values.consent) {
    errors.consent = messages.consent;
  }

  return errors;
}

export function getStepErrors(
  errors: QuoteRequestFieldErrors,
  stepIndex: number,
): QuoteRequestFieldErrors {
  return Object.entries(errors).reduce<QuoteRequestFieldErrors>(
    (result, [field, message]) => {
      if (
        message &&
        getContactStepIndexForField(field as ContactFieldName) === stepIndex
      ) {
        result[field as ContactFieldName] = message;
      }

      return result;
    },
    {},
  );
}

export function getFirstErrorStep(errors: QuoteRequestFieldErrors) {
  const fields = Object.keys(errors) as ContactFieldName[];
  const firstField = fields.find((field) => Boolean(errors[field]));

  return firstField ? getContactStepIndexForField(firstField) : 0;
}
