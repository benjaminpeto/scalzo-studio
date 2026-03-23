import {
  contactProjectTypeOptions,
  contactServiceOptions,
} from "@/lib/content/contact";
import { Input } from "@ui/components/ui/input";
import { Label } from "@ui/components/ui/label";

import { FieldError } from "./field-error";
import type {
  QuoteFormValues,
  QuoteRequestFieldErrors,
  UpdateQuoteFormField,
} from "../quote-request-form.types";

export function NeedStep({
  stepErrors,
  updateField,
  values,
}: {
  stepErrors: QuoteRequestFieldErrors;
  updateField: UpdateQuoteFormField;
  values: QuoteFormValues;
}) {
  return (
    <fieldset className="mt-6 space-y-6">
      <legend className="sr-only">What do you need?</legend>
      <div>
        <p className="text-sm font-semibold text-foreground">Services needed</p>
        <div className="mt-4 grid gap-3">
          {contactServiceOptions.map((option) => {
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
        <FieldError message={stepErrors.servicesInterest} />
      </div>

      <div>
        <Label
          htmlFor="project-type"
          className="text-sm font-semibold text-foreground"
        >
          Project type
        </Label>
        <div className="mt-4 flex flex-wrap gap-3">
          {contactProjectTypeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
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
          Primary goal
        </Label>
        <Input
          id="primary-goal"
          value={values.primaryGoal}
          onChange={(event) => updateField("primaryGoal", event.target.value)}
          placeholder="More qualified leads, clearer positioning, a stronger launch..."
          className="mt-3 h-12"
        />
        <FieldError message={stepErrors.primaryGoal} />
      </div>
    </fieldset>
  );
}
