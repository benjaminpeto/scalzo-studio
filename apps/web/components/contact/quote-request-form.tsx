"use client";

import {
  contactFormSteps,
  contactPageContent,
} from "@/constants/contact/content";

import {
  QuoteRequestFooter,
  QuoteRequestHiddenFields,
  QuoteRequestHoneypot,
  QuoteRequestServerMessage,
  QuoteRequestStepTabs,
  QuoteRequestSuccessState,
} from "./quote-request-form/chrome";
import { QuoteRequestActiveStep } from "./quote-request-form/active-step";
import { useQuoteRequestForm } from "@/hooks/contact/use-quote-request-form";

export function QuoteRequestForm() {
  const {
    activeStep,
    formAction,
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
  } = useQuoteRequestForm();

  if (serverState.status === "success") {
    return <QuoteRequestSuccessState />;
  }

  return (
    <div className="surface-grain rounded-4xl border border-border/70 bg-white/92 p-6 shadow-[0_22px_60px_rgba(27,28,26,0.06)] sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-kicker">{contactPageContent.form.kicker}</p>
          <h3 className="mt-4 font-display text-[2.2rem] leading-[0.97] tracking-[-0.05em] text-foreground sm:text-[2.8rem]">
            {contactPageContent.form.title}
          </h3>
        </div>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">
          {contactPageContent.form.responseNote}
        </p>
      </div>

      <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
        {contactPageContent.form.intro}
      </p>

      <QuoteRequestStepTabs
        activeStep={activeStep}
        onStepClick={setActiveStep}
      />

      <form action={formAction} className="mt-8" onSubmit={handleSubmit}>
        <QuoteRequestHiddenFields
          referrer={referrer}
          utmValues={utmValues}
          values={values}
        />
        <QuoteRequestHoneypot
          value={values.honeypot}
          onChange={(nextValue) => updateField("honeypot", nextValue)}
        />
        <QuoteRequestServerMessage message={serverState.message} />

        <QuoteRequestActiveStep
          activeStep={activeStep}
          stepErrors={stepErrors}
          updateField={updateField}
          values={values}
        />

        <QuoteRequestFooter
          activeStep={activeStep}
          isPending={isPending}
          onNext={() => handleNextStep(contactFormSteps.length)}
          onPrevious={handlePreviousStep}
          totalSteps={contactFormSteps.length}
        />
      </form>
    </div>
  );
}
