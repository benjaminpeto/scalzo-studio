"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";

import { getContactPublicContent } from "@/constants/contact/public-content";
import type { QuoteRequestCaptchaProps } from "@/interfaces/contact/component-props";
import { Label } from "@ui/components/ui/label";

import { FieldError } from "./field-error";

export function QuoteRequestCaptcha({
  captchaError,
  captchaRef,
  content,
  onError,
  onExpire,
  onVerify,
  siteKey,
}: QuoteRequestCaptchaProps) {
  const resolvedContent = content ?? getContactPublicContent("en").captcha;

  if (!siteKey) {
    return (
      <div className="mt-6 rounded-[1.2rem] border border-destructive/20 bg-destructive/6 px-4 py-3 text-sm text-foreground">
        {resolvedContent.unavailable}
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-[1.2rem] border border-border/70 bg-white/72 p-4">
      <Label className="text-sm font-semibold text-foreground">
        {resolvedContent.label}
      </Label>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {resolvedContent.help}
      </p>
      <div className="mt-4 overflow-x-auto">
        <HCaptcha
          ref={captchaRef}
          sitekey={siteKey}
          onError={() => onError(resolvedContent.errorLoad)}
          onExpire={onExpire}
          onVerify={onVerify}
        />
      </div>
      <FieldError message={captchaError ?? undefined} />
    </div>
  );
}
