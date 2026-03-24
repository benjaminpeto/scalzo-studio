import Link from "next/link";

import { Label } from "@ui/components/ui/label";

import { FieldError } from "./field-error";
import type {
  QuoteFormValues,
  QuoteRequestFieldErrors,
  UpdateQuoteFormField,
} from "../quote-request-form.types";

export function BriefStep({
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
      <legend className="sr-only">Brief and consent</legend>
      <div>
        <Label
          htmlFor="message"
          className="text-sm font-semibold text-foreground"
        >
          Project brief
        </Label>
        <textarea
          id="message"
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="What needs to feel clearer, more premium, or more commercially useful?"
          className="input-shell mt-3 min-h-40 w-full rounded-[1rem] px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden"
        />
        <FieldError message={stepErrors.message} />
      </div>

      <div className="rounded-[1.2rem] border border-border/70 bg-white/72 p-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={values.consent}
            onChange={(event) => updateField("consent", event.target.checked)}
            className="mt-1 size-4"
          />
          <span className="text-sm leading-6 text-foreground">
            I agree to be contacted about this request and understand that my
            details will be handled according to the{" "}
            <Link
              href="/privacy"
              className="font-medium text-foreground underline decoration-editorial-underline underline-offset-4"
            >
              Privacy notice
            </Link>
            .
          </span>
        </label>
      </div>
      <FieldError message={stepErrors.consent} />
    </fieldset>
  );
}
