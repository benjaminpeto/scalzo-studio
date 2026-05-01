"use client";

import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { submitQuoteRequest } from "@/actions/contact/submit-quote-request";
import {
  contactFieldStepMap,
  initialSubmitQuoteRequestState,
} from "@/constants/contact/content";
import type { ContactFieldName } from "@/interfaces/contact/form";
import type {
  QuoteFormValues,
  QuoteRequestFieldErrors,
  UTMValues,
} from "@/interfaces/contact/quote-request-form";

import {
  getFirstErrorStep,
  getStepErrors,
  initialQuoteFormValues,
  initialQuoteUtmValues,
  readUtmValues,
  validateQuoteValues,
} from "@/lib/contact/quote-request-form";
import { captureEvent } from "@/lib/analytics/client";
import { getContactPublicContent } from "@/constants/contact/public-content";

export function useQuoteRequestForm(locale = "en") {
  const [serverState, formAction, isPending] = useActionState(
    submitQuoteRequest,
    initialSubmitQuoteRequestState,
  );
  const errorMessages = getContactPublicContent(locale).errors;
  const [activeStep, setActiveStep] = useState(0);
  const [clientErrors, setClientErrors] = useState<QuoteRequestFieldErrors>({});
  const [dismissedServerErrors, setDismissedServerErrors] = useState<
    ContactFieldName[]
  >([]);
  const [values, setValues] = useState<QuoteFormValues>(initialQuoteFormValues);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [referrer, setReferrer] = useState("");
  const [utmValues, setUtmValues] = useState<UTMValues>(initialQuoteUtmValues);
  const formStartedRef = useRef(false);
  const formSubmittedRef = useRef(false);

  useEffect(() => {
    setReferrer(document.referrer ?? "");
    setUtmValues(readUtmValues(window.location.search));
  }, []);

  useEffect(() => {
    if (
      serverState.status === "error" &&
      Object.keys(serverState.fieldErrors).length
    ) {
      setActiveStep(getFirstErrorStep(serverState.fieldErrors));
    }
  }, [serverState]);

  useEffect(() => {
    setDismissedServerErrors([]);
  }, [serverState.fieldErrors, serverState.status]);

  useEffect(() => {
    setCaptchaError(serverState.captchaError ?? null);
  }, [serverState.captchaError]);

  useEffect(() => {
    if (serverState.status === "error") {
      setValues((currentValues) =>
        currentValues.captchaToken
          ? { ...currentValues, captchaToken: "" }
          : currentValues,
      );
    }
  }, [serverState.status]);

  useEffect(() => {
    if (serverState.status === "success" && !formSubmittedRef.current) {
      formSubmittedRef.current = true;
      captureEvent("form_submit", {
        budget_band: values.budgetBand || undefined,
        form_id: "quote_request",
        service_interest: values.servicesInterest.length
          ? values.servicesInterest
          : undefined,
        timeline_band: values.timelineBand || undefined,
      });
    }
    // values intentionally excluded — snapshot at submission time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverState.status]);

  const visibleServerErrors = useMemo(
    () =>
      Object.entries(serverState.fieldErrors).reduce<QuoteRequestFieldErrors>(
        (result, [field, message]) => {
          if (
            message &&
            !dismissedServerErrors.includes(field as ContactFieldName)
          ) {
            result[field as ContactFieldName] = message;
          }

          return result;
        },
        {},
      ),
    [dismissedServerErrors, serverState.fieldErrors],
  );

  const stepErrors = useMemo(
    () =>
      getStepErrors({ ...visibleServerErrors, ...clientErrors }, activeStep),
    [activeStep, clientErrors, visibleServerErrors],
  );

  function updateField<K extends keyof QuoteFormValues>(
    field: K,
    nextValue: QuoteFormValues[K],
  ) {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      captureEvent("form_start", { form_id: "quote_request" });
    }

    setValues((currentValues) => ({
      ...currentValues,
      [field]: nextValue,
    }));

    if (field === "captchaToken") {
      setCaptchaError(null);
    }

    if (field in contactFieldStepMap) {
      setDismissedServerErrors((currentFields) =>
        currentFields.includes(field as ContactFieldName)
          ? currentFields
          : [...currentFields, field as ContactFieldName],
      );
    }

    if (field in clientErrors) {
      setClientErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        delete nextErrors[field as ContactFieldName];
        return nextErrors;
      });
    }
  }

  function validateCurrentStep(stepIndex: number) {
    const errors = validateQuoteValues(values, errorMessages);
    const nextStepErrors = getStepErrors(errors, stepIndex);

    setClientErrors((currentErrors) => ({
      ...currentErrors,
      ...nextStepErrors,
    }));

    return Object.keys(nextStepErrors).length === 0;
  }

  function handleNextStep(totalSteps: number) {
    if (validateCurrentStep(activeStep)) {
      const nextStep = Math.min(activeStep + 1, totalSteps - 1);
      captureEvent("form_step_complete", {
        budget_band: values.budgetBand || undefined,
        form_id: "quote_request",
        from_step: activeStep,
        service_interest: values.servicesInterest.length
          ? values.servicesInterest
          : undefined,
        to_step: nextStep,
        total_steps: totalSteps,
      });
      setActiveStep(nextStep);
    }
  }

  function handlePreviousStep() {
    setActiveStep((currentStep) => Math.max(currentStep - 1, 0));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const errors = validateQuoteValues(values, errorMessages);

    if (Object.keys(errors).length) {
      event.preventDefault();
      setClientErrors(errors);
      setActiveStep(getFirstErrorStep(errors));
      return;
    }

    if (!values.captchaToken.trim()) {
      event.preventDefault();
      setCaptchaError(errorMessages.captchaRequired);
    }
  }

  function handleCaptchaVerify(token: string) {
    updateField("captchaToken", token);
    setCaptchaError(null);
  }

  function handleCaptchaExpire() {
    updateField("captchaToken", "");
    setCaptchaError(errorMessages.captchaRequired);
  }

  function handleCaptchaError(message: string) {
    updateField("captchaToken", "");
    setCaptchaError(message);
  }

  return {
    activeStep,
    captchaError,
    formAction,
    handleCaptchaError,
    handleCaptchaExpire,
    handleCaptchaVerify,
    handleNextStep,
    handlePreviousStep,
    handleSubmit,
    isPending,
    referrer,
    serverState,
    setActiveStep,
    stepErrors,
    updateField,
    utmValues,
    values,
  };
}
