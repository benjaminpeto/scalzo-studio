import { ArrowRight, Check, ChevronLeft } from "lucide-react";

import { contactFormSteps, contactPageContent } from "@/lib/content/contact";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";
import { Label } from "@ui/components/ui/label";

import type { QuoteFormValues, UTMValues } from "../quote-request-form.types";

export function QuoteRequestSuccessState() {
  return (
    <div className="surface-grain rounded-4xl border border-border/70 bg-white/92 p-6 shadow-[0_22px_60px_rgba(27,28,26,0.06)] sm:p-8">
      <p className="section-kicker">Submission received</p>
      <h3 className="mt-5 font-display text-[2.3rem] leading-[0.96] tracking-[-0.05em] text-foreground sm:text-[3rem]">
        {contactPageContent.success.title}
      </h3>
      <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
        {contactPageContent.success.body}
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Button
          asChild
          className="h-12 rounded-full bg-foreground px-6 text-[0.78rem] uppercase tracking-[0.2em] text-background hover:bg-primary"
        >
          <a href="#booking">Book a call</a>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-12 rounded-full border-border bg-white px-6 text-[0.78rem] uppercase tracking-[0.2em] text-foreground hover:bg-white"
        >
          <a href="/contact?new=1">Start another request</a>
        </Button>
      </div>
    </div>
  );
}

export function QuoteRequestStepTabs({
  activeStep,
  onStepClick,
}: {
  activeStep: number;
  onStepClick: (stepIndex: number) => void;
}) {
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {contactFormSteps.map((step, index) => (
        <StepButton
          key={step.step}
          isActive={index === activeStep}
          isComplete={index < activeStep}
          onClick={() => onStepClick(index)}
          step={step.step}
          title={step.title}
        />
      ))}
    </div>
  );
}

function StepButton({
  isActive,
  isComplete,
  onClick,
  step,
  title,
}: {
  isActive: boolean;
  isComplete: boolean;
  onClick: () => void;
  step: string;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-0 items-center gap-3 rounded-[1.2rem] border px-3 py-3 text-left transition-colors sm:px-4 ${
        isActive
          ? "border-foreground bg-white"
          : isComplete
            ? "border-border/70 bg-white/85"
            : "border-transparent bg-[rgba(27,28,26,0.04)]"
      }`}
    >
      <span
        className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold uppercase tracking-[0.14em] ${
          isActive || isComplete
            ? "bg-primary text-primary-foreground"
            : "bg-white text-muted-foreground"
        }`}
      >
        {isComplete ? <Check className="size-4" aria-hidden="true" /> : step}
      </span>
      <span className="min-w-0">
        <span className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Step
        </span>
        <span className="mt-1 block truncate text-sm font-semibold text-foreground">
          {title}
        </span>
      </span>
    </button>
  );
}

export function QuoteRequestHiddenFields({
  referrer,
  utmValues,
  values,
}: {
  referrer: string;
  utmValues: UTMValues;
  values: QuoteFormValues;
}) {
  return (
    <>
      <input type="hidden" name="pagePath" value="/contact" />
      <input type="hidden" name="referrer" value={referrer} />
      <input type="hidden" name="utmSource" value={utmValues.utmSource} />
      <input type="hidden" name="utmMedium" value={utmValues.utmMedium} />
      <input type="hidden" name="utmCampaign" value={utmValues.utmCampaign} />
      <input type="hidden" name="utmContent" value={utmValues.utmContent} />
      <input type="hidden" name="utmTerm" value={utmValues.utmTerm} />
      <input type="hidden" name="primaryGoal" value={values.primaryGoal} />
      <input type="hidden" name="projectType" value={values.projectType} />
      <input type="hidden" name="name" value={values.name} />
      <input type="hidden" name="email" value={values.email} />
      <input type="hidden" name="company" value={values.company} />
      <input type="hidden" name="website" value={values.website} />
      <input type="hidden" name="location" value={values.location} />
      <input type="hidden" name="budgetBand" value={values.budgetBand} />
      <input type="hidden" name="timelineBand" value={values.timelineBand} />
      <input type="hidden" name="message" value={values.message} />
      <input
        type="hidden"
        name="consent"
        value={values.consent ? "true" : ""}
      />
      {values.servicesInterest.map((value) => (
        <input
          key={value}
          type="hidden"
          name="servicesInterest"
          value={value}
        />
      ))}
    </>
  );
}

export function QuoteRequestHoneypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (nextValue: string) => void;
}) {
  return (
    <div className="sr-only" aria-hidden="true">
      <Label htmlFor="companyWebsite">Company website</Label>
      <Input
        id="companyWebsite"
        name="companyWebsite"
        autoComplete="off"
        tabIndex={-1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export function QuoteRequestServerMessage({
  message,
}: {
  message: string | null;
}) {
  if (!message) {
    return null;
  }

  return (
    <div className="mb-6 rounded-[1.2rem] border border-destructive/20 bg-destructive/6 px-4 py-3 text-sm text-foreground">
      {message}
    </div>
  );
}

export function QuoteRequestFooter({
  activeStep,
  isPending,
  onNext,
  onPrevious,
  totalSteps,
}: {
  activeStep: number;
  isPending: boolean;
  onNext: () => void;
  onPrevious: () => void;
  totalSteps: number;
}) {
  const isLastStep = activeStep === totalSteps - 1;

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-3">
        {activeStep > 0 ? (
          <Button
            type="button"
            disabled={isPending}
            variant="outline"
            className="h-12 rounded-full border-border bg-white px-5 text-[0.78rem] uppercase tracking-[0.2em] text-foreground hover:bg-white"
            onClick={onPrevious}
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
            Back
          </Button>
        ) : null}

        {!isLastStep ? (
          <Button
            type="button"
            disabled={isPending}
            className="h-12 rounded-full bg-foreground px-6 text-[0.78rem] uppercase tracking-[0.2em] text-background hover:bg-primary"
            onClick={onNext}
          >
            Continue
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        ) : null}
      </div>

      {isLastStep ? <SubmitButton disabled={isPending} /> : null}

      {isPending ? (
        <p className="w-full text-sm text-muted-foreground sm:w-auto">
          Submitting the request...
        </p>
      ) : null}
    </div>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  return (
    <Button
      type="submit"
      disabled={disabled}
      className="h-12 rounded-full bg-foreground px-6 text-[0.78rem] uppercase tracking-[0.2em] text-background hover:bg-primary"
    >
      Submit request
      <ArrowRight aria-hidden="true" className="size-4" />
    </Button>
  );
}
