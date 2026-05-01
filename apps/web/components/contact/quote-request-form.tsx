"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useEffect, useRef } from "react";
import { useRouter } from "@/lib/i18n/navigation";

import { getContactPublicContent } from "@/constants/contact/public-content";

import {
  QuoteRequestFooter,
  QuoteRequestHiddenFields,
  QuoteRequestServerMessage,
  QuoteRequestStepTabs,
  QuoteRequestSuccessState,
} from "./quote-request-form/chrome";
import { QuoteRequestActiveStep } from "./quote-request-form/active-step";
import { QuoteRequestCaptcha } from "./quote-request-form/captcha";
import { useQuoteRequestForm } from "@/hooks/contact/use-quote-request-form";

export function QuoteRequestForm({ locale = "en" }: { locale?: string }) {
  const router = useRouter();
  const captchaRef = useRef<HCaptcha | null>(null);
  const content = getContactPublicContent(locale);
  const contactFormSteps = content.steps;
  const {
    activeStep,
    captchaError,
    formAction,
    handleCaptchaError,
    handleCaptchaExpire,
    handleCaptchaVerify,
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
  } = useQuoteRequestForm(locale);
  const hcaptchaSiteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

  useEffect(() => {
    if (serverState.status === "success") {
      router.replace("/contact/thank-you");
    }
  }, [router, serverState.status]);

  useEffect(() => {
    if (serverState.status === "error") {
      captchaRef.current?.resetCaptcha();
    }
  }, [serverState.status]);

  if (serverState.status === "success") {
    return <QuoteRequestSuccessState />;
  }

  return (
    <div className="surface-grain rounded-4xl border border-border/70 bg-white/92 p-6 shadow-[0_22px_60px_rgba(27,28,26,0.06)] sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-kicker">{content.form.kicker}</p>
          <h3 className="mt-4 font-display text-[2.2rem] leading-[0.97] tracking-[-0.05em] text-foreground sm:text-[2.8rem]">
            {content.form.title}
          </h3>
        </div>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">
          {content.form.responseNote}
        </p>
      </div>

      <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
        {content.form.intro}
      </p>

      <QuoteRequestStepTabs
        activeStep={activeStep}
        steps={contactFormSteps}
        onStepClick={setActiveStep}
      />

      <form action={formAction} className="mt-8" onSubmit={handleSubmit}>
        <QuoteRequestHiddenFields
          locale={locale}
          referrer={referrer}
          utmValues={utmValues}
          values={values}
        />
        <QuoteRequestServerMessage message={serverState.message} />

        <QuoteRequestActiveStep
          activeStep={activeStep}
          content={content}
          stepErrors={stepErrors}
          updateField={updateField}
          values={values}
        />

        {activeStep === contactFormSteps.length - 1 ? (
          <QuoteRequestCaptcha
            captchaError={captchaError}
            captchaRef={captchaRef}
            content={content.captcha}
            onError={handleCaptchaError}
            onExpire={handleCaptchaExpire}
            onVerify={handleCaptchaVerify}
            siteKey={hcaptchaSiteKey}
          />
        ) : null}

        <QuoteRequestFooter
          activeStep={activeStep}
          isPending={isPending}
          isSubmitDisabled={!hcaptchaSiteKey}
          onNext={() => handleNextStep(contactFormSteps.length)}
          onPrevious={handlePreviousStep}
          labels={content.labels}
          totalSteps={contactFormSteps.length}
        />
      </form>
    </div>
  );
}
