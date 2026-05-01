import type { QuoteRequestActiveStepProps } from "@/interfaces/contact/component-props";
import { getContactPublicContent } from "@/constants/contact/public-content";

import { BriefStep } from "./brief-step";
import { BudgetStep } from "./budget-step";
import { ContextStep } from "./context-step";
import { NeedStep } from "./need-step";

export function QuoteRequestActiveStep({
  activeStep,
  content,
  stepErrors,
  updateField,
  values,
}: QuoteRequestActiveStepProps) {
  const resolvedContent = content ?? getContactPublicContent("en");
  const step = resolvedContent.steps[activeStep];

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
          content={resolvedContent}
          stepErrors={stepErrors}
          updateField={updateField}
          values={values}
        />
      ) : null}

      {activeStep === 1 ? (
        <ContextStep
          content={resolvedContent}
          stepErrors={stepErrors}
          updateField={updateField}
          values={values}
        />
      ) : null}

      {activeStep === 2 ? (
        <BudgetStep
          content={resolvedContent}
          stepErrors={stepErrors}
          updateField={updateField}
          values={values}
        />
      ) : null}

      {activeStep === 3 ? (
        <BriefStep
          content={resolvedContent}
          stepErrors={stepErrors}
          updateField={updateField}
          values={values}
        />
      ) : null}
    </div>
  );
}
