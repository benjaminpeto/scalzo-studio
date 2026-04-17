"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";

import { Link } from "@/lib/i18n/navigation";
import { useCookieConsent } from "@/hooks/consent/use-cookie-consent";
import { Button } from "@ui/components/ui/button";

export function CookieBanner() {
  const reduceMotion = useReducedMotion();
  const { bannerVisible, handleAccept, handleDecline } = useCookieConsent();
  const t = useTranslations("cookie");

  return (
    <AnimatePresence>
      {bannerVisible ? (
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          role="dialog"
          aria-label={t("heading")}
          aria-live="polite"
          className="fixed inset-x-4 bottom-4 z-[60] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:left-auto sm:max-w-sm"
        >
          <div className="surface-grain rounded-[1.6rem] border border-border/70 bg-[rgba(250,249,245,0.92)] p-5 backdrop-blur-xl shadow-[0_32px_90px_rgba(27,28,26,0.18)]">
            <p className="mb-1 text-sm font-semibold text-foreground">
              {t("heading")}
            </p>
            <p className="mb-4 text-[0.8rem] leading-relaxed text-foreground/65">
              {t("body")}
            </p>
            <div className="mb-4 flex gap-3 text-[0.72rem] text-foreground/50">
              <Link
                href="/cookies"
                className="underline underline-offset-2 transition-colors hover:text-foreground/80"
              >
                {t("cookiesLinkLabel")}
              </Link>
              <Link
                href="/privacy"
                className="underline underline-offset-2 transition-colors hover:text-foreground/80"
              >
                {t("privacyLinkLabel")}
              </Link>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
                className="rounded-full text-[0.75rem]"
              >
                {t("decline")}
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="rounded-full bg-foreground text-[0.75rem] text-background hover:bg-foreground/90"
              >
                {t("accept")}
              </Button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
