"use client";

import {
  useActionState,
  useEffect,
  useMemo,
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
import posthog from "posthog-js";

export function useQuoteRequestForm() {
  const [serverState, formAction, isPending] = useActionState(
    submitQuoteRequest,
    initialSubmitQuoteRequestState,
  );
  const [activeStep, setActiveStep] = useState(0);
  const [clientErrors, setClientErrors] = useState<QuoteRequestFieldErrors>({});
  const [dismissedServerErrors, setDismissedServerErrors] = useState<
    ContactFieldName[]
  >([]);
  const [values, setValues] = useState<QuoteFormValues>(initialQuoteFormValues);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [referrer, setReferrer] = useState("");
  const [utmValues, setUtmValues] = useState<UTMValues>(initialQuoteUtmValues);

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
    const errors = validateQuoteValues(values);
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
      posthog.capture("quote_request_step_advanced", {
        from_step: activeStep,
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
    const errors = validateQuoteValues(values);

    if (Object.keys(errors).length) {
      event.preventDefault();
      setClientErrors(errors);
      setActiveStep(getFirstErrorStep(errors));
      return;
    }

    if (!values.captchaToken.trim()) {
      event.preventDefault();
      setCaptchaError("Complete the hCaptcha check before submitting.");
    }
  }

  function handleCaptchaVerify(token: string) {
    updateField("captchaToken", token);
    setCaptchaError(null);
  }

  function handleCaptchaExpire() {
    updateField("captchaToken", "");
    setCaptchaError("Complete the hCaptcha check before submitting.");
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
