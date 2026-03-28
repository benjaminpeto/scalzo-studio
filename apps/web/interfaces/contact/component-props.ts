import type {
  QuoteFormValues,
  QuoteRequestFieldErrors,
  UTMValues,
  UpdateQuoteFormField,
} from "@/interfaces/contact/quote-request-form";

export interface QuoteRequestStepTabsProps {
  activeStep: number;
  onStepClick: (stepIndex: number) => void;
}

export interface QuoteRequestStepButtonProps {
  isActive: boolean;
  isComplete: boolean;
  onClick: () => void;
  step: string;
  title: string;
}

export interface QuoteRequestHiddenFieldsProps {
  referrer: string;
  utmValues: UTMValues;
  values: QuoteFormValues;
}

export interface QuoteRequestHoneypotProps {
  onChange: (nextValue: string) => void;
  value: string;
}

export interface QuoteRequestServerMessageProps {
  message: string | null;
}

export interface QuoteRequestFooterProps {
  activeStep: number;
  isPending: boolean;
  onNext: () => void;
  onPrevious: () => void;
  totalSteps: number;
}

export interface QuoteRequestSubmitButtonProps {
  disabled: boolean;
}

export interface QuoteRequestActiveStepProps {
  activeStep: number;
  stepErrors: QuoteRequestFieldErrors;
  updateField: UpdateQuoteFormField;
  values: QuoteFormValues;
}

export interface QuoteRequestStepProps {
  stepErrors: QuoteRequestFieldErrors;
  updateField: UpdateQuoteFormField;
  values: QuoteFormValues;
}

export interface FieldErrorProps {
  message?: string;
}
