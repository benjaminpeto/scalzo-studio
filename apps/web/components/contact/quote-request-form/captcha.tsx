"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";

import type { QuoteRequestCaptchaProps } from "@/interfaces/contact/component-props";
import { Label } from "@ui/components/ui/label";

import { FieldError } from "./field-error";

export function QuoteRequestCaptcha({
  captchaError,
  captchaRef,
  onError,
  onExpire,
  onVerify,
  siteKey,
}: QuoteRequestCaptchaProps) {
  if (!siteKey) {
    return (
      <div className="mt-6 rounded-[1.2rem] border border-destructive/20 bg-destructive/6 px-4 py-3 text-sm text-foreground">
        The contact form is temporarily unavailable. Email
        hello@scalzostudio.com instead.
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-[1.2rem] border border-border/70 bg-white/72 p-4">
      <Label className="text-sm font-semibold text-foreground">
        Anti-spam check
      </Label>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Complete the hCaptcha check before sending the request.
      </p>
      <div className="mt-4 overflow-x-auto">
        <HCaptcha
          ref={captchaRef}
          sitekey={siteKey}
          onError={() =>
            onError("The anti-spam check failed to load. Try again.")
          }
          onExpire={onExpire}
          onVerify={onVerify}
        />
      </div>
      <FieldError message={captchaError ?? undefined} />
    </div>
  );
}
