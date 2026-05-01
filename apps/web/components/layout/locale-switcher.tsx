"use client";

import { Fragment } from "react";
import { useLocale, useTranslations } from "next-intl";

import { locales, type Locale } from "@/lib/i18n/routing";
import { usePathname, useRouter } from "@/lib/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("localeSwitcher");

  function handleSwitch(next: Locale) {
    const suffix =
      typeof window === "undefined"
        ? ""
        : `${window.location.search}${window.location.hash}`;

    router.replace(`${pathname}${suffix}`, { locale: next });
  }

  return (
    <div
      aria-label={t("label")}
      className="flex items-center gap-2 text-xs uppercase tracking-[0.18em]"
    >
      <span className="text-muted-foreground">{t("label")}</span>
      {locales.map((l, i) => (
        <Fragment key={l}>
          {i > 0 && (
            <span className="select-none text-muted-foreground/40" aria-hidden>
              /
            </span>
          )}
          <button
            type="button"
            onClick={() => handleSwitch(l)}
            aria-label={t("switchTo", { locale: t(l) })}
            aria-current={l === locale ? "true" : undefined}
            lang={l}
            className={
              l === locale
                ? "font-semibold text-foreground"
                : "text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            {t(l)}
          </button>
        </Fragment>
      ))}
    </div>
  );
}
