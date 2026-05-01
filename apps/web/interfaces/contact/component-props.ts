import type HCaptcha from "@hcaptcha/react-hcaptcha";
import type { RefObject } from "react";

import type { getContactPublicContent } from "@/constants/contact/public-content";
import type {
  QuoteFormValues,
  QuoteRequestFieldErrors,
  UTMValues,
  UpdateQuoteFormField,
} from "@/interfaces/contact/quote-request-form";

type ContactPublicContent = ReturnType<typeof getContactPublicContent>;

export interface QuoteRequestStepTabsProps {
  activeStep: number;
  onStepClick: (stepIndex: number) => void;
  steps: ContactPublicContent["steps"];
}

export interface QuoteRequestStepButtonProps {
  isActive: boolean;
  isComplete: boolean;
  onClick: () => void;
  step: string;
  title: string;
}

export interface QuoteRequestHiddenFieldsProps {
  locale: string;
  referrer: string;
  utmValues: UTMValues;
  values: QuoteFormValues;
}

export interface QuoteRequestCaptchaProps {
  captchaError: string | null;
  captchaRef: RefObject<HCaptcha | null>;
  content?: ContactPublicContent["captcha"];
  onError: (message: string) => void;
  onExpire: () => void;
  onVerify: (token: string) => void;
  siteKey?: string;
}

export interface QuoteRequestServerMessageProps {
  message: string | null;
}

export interface QuoteRequestFooterProps {
  activeStep: number;
  isPending: boolean;
  isSubmitDisabled?: boolean;
  labels: ContactPublicContent["labels"];
  onNext: () => void;
  onPrevious: () => void;
  totalSteps: number;
}

export interface QuoteRequestSubmitButtonProps {
  disabled: boolean;
  label: string;
}

export interface QuoteRequestActiveStepProps {
  activeStep: number;
  content?: ContactPublicContent;
  stepErrors: QuoteRequestFieldErrors;
  updateField: UpdateQuoteFormField;
  values: QuoteFormValues;
}

export interface QuoteRequestStepProps {
  content?: ContactPublicContent;
  stepErrors: QuoteRequestFieldErrors;
  updateField: UpdateQuoteFormField;
  values: QuoteFormValues;
}

export interface FieldErrorProps {
  id?: string;
  message?: string;
}
