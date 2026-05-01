import type { QuoteRequestStepProps } from "@/interfaces/contact/component-props";
import { getContactPublicContent } from "@/constants/contact/public-content";
import { Input } from "@ui/components/ui/input";
import { Label } from "@ui/components/ui/label";

import { FieldError } from "./field-error";

export function NeedStep({
  content,
  stepErrors,
  updateField,
  values,
}: QuoteRequestStepProps) {
  const resolvedContent = content ?? getContactPublicContent("en");

  return (
    <fieldset className="mt-6 space-y-6">
      <legend className="sr-only">{resolvedContent.labels.needLegend}</legend>
      <div>
        <p className="text-sm font-semibold text-foreground">
          {resolvedContent.labels.servicesNeeded}
        </p>
        <div
          className="mt-4 grid gap-3"
          aria-describedby={
            stepErrors.servicesInterest ? "services-interest-error" : undefined
          }
        >
          {resolvedContent.options.services.map((option) => {
            const checked = values.servicesInterest.includes(option.value);

            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-4 rounded-[1.2rem] border p-4 transition-colors ${
                  checked
                    ? "border-foreground bg-white"
                    : "border-border/70 bg-white/72 hover:border-foreground/40"
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-1 size-4"
                  checked={checked}
                  onChange={(event) => {
                    const nextServices = event.target.checked
                      ? [...values.servicesInterest, option.value]
                      : values.servicesInterest.filter(
                          (item) => item !== option.value,
                        );

                    updateField("servicesInterest", nextServices);
                  }}
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground">
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                      {option.description}
                    </span>
                  ) : null}
                </span>
              </label>
            );
          })}
        </div>
        <FieldError
          id="services-interest-error"
          message={stepErrors.servicesInterest}
        />
      </div>

      <div>
        <Label
          htmlFor="project-type"
          className="text-sm font-semibold text-foreground"
        >
          {resolvedContent.labels.projectType}
        </Label>
        <div className="mt-4 flex flex-wrap gap-3">
          {resolvedContent.options.projectType.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={values.projectType === option.value}
              onClick={() =>
                updateField(
                  "projectType",
                  values.projectType === option.value ? "" : option.value,
                )
              }
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                values.projectType === option.value
                  ? "border-foreground bg-white text-foreground"
                  : "border-border/70 bg-white/72 text-muted-foreground hover:border-foreground/40"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label
          htmlFor="primary-goal"
          className="text-sm font-semibold text-foreground"
        >
          {resolvedContent.labels.primaryGoal}
        </Label>
        <Input
          id="primary-goal"
          value={values.primaryGoal}
          onChange={(event) => updateField("primaryGoal", event.target.value)}
          aria-invalid={Boolean(stepErrors.primaryGoal)}
          aria-describedby={
            stepErrors.primaryGoal ? "primary-goal-error" : undefined
          }
          placeholder={resolvedContent.labels.primaryGoalPlaceholder}
          className="mt-3 h-12"
        />
        <FieldError id="primary-goal-error" message={stepErrors.primaryGoal} />
      </div>
    </fieldset>
  );
}
