import type { QuoteRequestStepProps } from "@/interfaces/contact/component-props";
import { getContactPublicContent } from "@/constants/contact/public-content";

import { FieldError } from "./field-error";

export function BudgetStep({
  content,
  stepErrors,
  updateField,
  values,
}: QuoteRequestStepProps) {
  const resolvedContent = content ?? getContactPublicContent("en");

  return (
    <fieldset className="mt-6 grid gap-6 lg:grid-cols-2">
      <legend className="sr-only">
        {resolvedContent.labels.timelineLegend}
      </legend>
      <div>
        <p className="text-sm font-semibold text-foreground">
          {resolvedContent.labels.budgetBand}
        </p>
        <div
          className="mt-4 space-y-3"
          aria-describedby={
            stepErrors.budgetBand ? "budget-band-error" : undefined
          }
        >
          {resolvedContent.options.budget.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-3 rounded-[1.1rem] border px-4 py-3 transition-colors ${
                values.budgetBand === option.value
                  ? "border-foreground bg-white"
                  : "border-border/70 bg-white/72 hover:border-foreground/40"
              }`}
            >
              <input
                type="radio"
                checked={values.budgetBand === option.value}
                onChange={() => updateField("budgetBand", option.value)}
              />
              <span className="text-sm text-foreground">{option.label}</span>
            </label>
          ))}
        </div>
        <FieldError id="budget-band-error" message={stepErrors.budgetBand} />
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground">
          {resolvedContent.labels.timeline}
        </p>
        <div
          className="mt-4 space-y-3"
          aria-describedby={
            stepErrors.timelineBand ? "timeline-band-error" : undefined
          }
        >
          {resolvedContent.options.timeline.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-3 rounded-[1.1rem] border px-4 py-3 transition-colors ${
                values.timelineBand === option.value
                  ? "border-foreground bg-white"
                  : "border-border/70 bg-white/72 hover:border-foreground/40"
              }`}
            >
              <input
                type="radio"
                checked={values.timelineBand === option.value}
                onChange={() => updateField("timelineBand", option.value)}
              />
              <span className="text-sm text-foreground">{option.label}</span>
            </label>
          ))}
        </div>
        <FieldError
          id="timeline-band-error"
          message={stepErrors.timelineBand}
        />
      </div>
    </fieldset>
  );
}
