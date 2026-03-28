import { contactLocationOptions } from "@/constants/contact/content";
import type { QuoteRequestStepProps } from "@/interfaces/contact/component-props";
import { Input } from "@ui/components/ui/input";
import { Label } from "@ui/components/ui/label";

import { FieldError } from "./field-error";

export function ContextStep({
  stepErrors,
  updateField,
  values,
}: QuoteRequestStepProps) {
  return (
    <fieldset className="mt-6 grid gap-5 sm:grid-cols-2">
      <legend className="sr-only">Context</legend>
      <div className="sm:col-span-1">
        <Label htmlFor="name" className="text-sm font-semibold text-foreground">
          Name
        </Label>
        <Input
          id="name"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          className="mt-3 h-12"
        />
        <FieldError message={stepErrors.name} />
      </div>
      <div className="sm:col-span-1">
        <Label
          htmlFor="email"
          className="text-sm font-semibold text-foreground"
        >
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          className="mt-3 h-12"
        />
        <FieldError message={stepErrors.email} />
      </div>
      <div>
        <Label
          htmlFor="company"
          className="text-sm font-semibold text-foreground"
        >
          Company or brand
        </Label>
        <Input
          id="company"
          value={values.company}
          onChange={(event) => updateField("company", event.target.value)}
          className="mt-3 h-12"
        />
      </div>
      <div>
        <Label
          htmlFor="website"
          className="text-sm font-semibold text-foreground"
        >
          Website or Instagram
        </Label>
        <Input
          id="website"
          value={values.website}
          onChange={(event) => updateField("website", event.target.value)}
          placeholder="https://..."
          className="mt-3 h-12"
        />
      </div>
      <div className="sm:col-span-2">
        <Label className="text-sm font-semibold text-foreground">
          Where are you based?
        </Label>
        <div className="mt-4 flex flex-wrap gap-3">
          {contactLocationOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                updateField(
                  "location",
                  values.location === option.value ? "" : option.value,
                )
              }
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                values.location === option.value
                  ? "border-foreground bg-white text-foreground"
                  : "border-border/70 bg-white/72 text-muted-foreground hover:border-foreground/40"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </fieldset>
  );
}
