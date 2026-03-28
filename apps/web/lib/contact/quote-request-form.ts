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
  company: "",
  consent: false,
  email: "",
  honeypot: "",
  location: "",
  message: "",
  name: "",
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

export function validateQuoteValues(
  values: QuoteFormValues,
): QuoteRequestFieldErrors {
  const errors: QuoteRequestFieldErrors = {};

  if (!values.servicesInterest.length) {
    errors.servicesInterest = "Choose at least one service area.";
  }

  if (values.primaryGoal.trim().length < 8) {
    errors.primaryGoal = "Add the main goal or commercial shift you want.";
  }

  if (values.name.trim().length < 2) {
    errors.name = "Enter the name of the main contact.";
  }

  if (!isValidEmail(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.budgetBand) {
    errors.budgetBand =
      "Choose the budget band that feels closest to the project.";
  }

  if (!values.timelineBand) {
    errors.timelineBand =
      "Choose the timeline that feels closest to the current plan.";
  }

  if (values.message.trim().length < 24) {
    errors.message =
      "Add a bit more detail so the first response can be useful.";
  }

  if (!values.consent) {
    errors.consent = "Consent is required before submitting the request.";
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
