import { contactFormSteps } from "@/lib/content/contact";

import { BriefStep } from "./brief-step";
import { BudgetStep } from "./budget-step";
import { ContextStep } from "./context-step";
import { NeedStep } from "./need-step";
import type {
  QuoteFormValues,
  QuoteRequestFieldErrors,
  UpdateQuoteFormField,
} from "../quote-request-form.types";

export function QuoteRequestActiveStep({
  activeStep,
  stepErrors,
  updateField,
  values,
}: {
  activeStep: number;
  stepErrors: QuoteRequestFieldErrors;
  updateField: UpdateQuoteFormField;
  values: QuoteFormValues;
}) {
  const step = contactFormSteps[activeStep];

  return (
    <div className="rounded-[1.6rem] border border-border/70 bg-[rgba(27,28,26,0.03)] p-5 sm:p-6">
      <p className="section-kicker">
        {step?.step} / {step?.title}
      </p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {step?.description}
      </p>

      {activeStep === 0 ? (
        <NeedStep
          stepErrors={stepErrors}
          updateField={updateField}
          values={values}
        />
      ) : null}

      {activeStep === 1 ? (
        <ContextStep
          stepErrors={stepErrors}
          updateField={updateField}
          values={values}
        />
      ) : null}

      {activeStep === 2 ? (
        <BudgetStep
          stepErrors={stepErrors}
          updateField={updateField}
          values={values}
        />
      ) : null}

      {activeStep === 3 ? (
        <BriefStep
          stepErrors={stepErrors}
          updateField={updateField}
          values={values}
        />
      ) : null}
    </div>
  );
}
