import Link from "next/link";

import { contactPageContent } from "@/constants/contact/content";
import type { QuoteRequestStepProps } from "@/interfaces/contact/component-props";
import { Label } from "@ui/components/ui/label";

import { FieldError } from "./field-error";

export function BriefStep({
  stepErrors,
  updateField,
  values,
}: QuoteRequestStepProps) {
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
          aria-invalid={Boolean(stepErrors.message)}
          aria-describedby={stepErrors.message ? "message-error" : undefined}
          placeholder="What needs to feel clearer, more premium, or more commercially useful?"
          className="input-shell mt-3 min-h-40 w-full rounded-[1rem] px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        />
        <FieldError id="message-error" message={stepErrors.message} />
      </div>

      <div className="rounded-[1.2rem] border border-border/70 bg-white/72 p-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={values.newsletterOptIn}
            onChange={(event) =>
              updateField("newsletterOptIn", event.target.checked)
            }
            className="mt-1 size-4"
          />
          <span className="text-sm leading-6 text-foreground">
            {contactPageContent.form.newsletterOptInLabel}
          </span>
        </label>
      </div>

      <div className="rounded-[1.2rem] border border-border/70 bg-white/72 p-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={values.consent}
            onChange={(event) => updateField("consent", event.target.checked)}
            aria-invalid={Boolean(stepErrors.consent)}
            aria-describedby={stepErrors.consent ? "consent-error" : undefined}
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
      <FieldError id="consent-error" message={stepErrors.consent} />
    </fieldset>
  );
}
