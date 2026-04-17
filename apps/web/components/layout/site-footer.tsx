import { getTranslations } from "next-intl/server";

import { Link } from "@/lib/i18n/navigation";
import { footerLinks } from "@/components/home/content";
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";

export async function SiteFooter() {
  const t = await getTranslations("footer");

  return (
    <footer className="pb-0 pt-14">
      <div className="section-shell grid gap-12 lg:grid-cols-[1fr_1fr_0.7fr_0.7fr_0.9fr]">
        <div className="max-w-md">
          <p className="section-kicker">Scalzo Studio</p>
          <p className="mt-5 font-display text-[4.5rem] leading-[0.88] tracking-[-0.08em] text-foreground sm:text-[5.4rem]">
            scalzo.
          </p>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <nav aria-label={t("exploreLabel")}>
          <p className="section-kicker">{t("exploreLabel")}</p>
          <ul className="mt-5 space-y-3">
            <li>
              <Link
                href="/about"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {t("links.about")}
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {t("links.services")}
              </Link>
            </li>
            <li>
              <Link
                href="/work"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {t("links.work")}
              </Link>
            </li>
            <li>
              <Link
                href="/insights"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {t("links.insights")}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={t("actionLabel")}>
          <p className="section-kicker">{t("actionLabel")}</p>
          <ul className="mt-5 space-y-3">
            <li>
              <Link
                href="/#method"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {t("links.method")}
              </Link>
            </li>
            <li>
              <Link
                href="/#faq"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {t("links.faq")}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {t("links.contact")}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <nav aria-label={t("elsewhereLabel")}>
            <p className="section-kicker">{t("elsewhereLabel")}</p>
            <ul className="mt-5 space-y-3">
              {footerLinks.social.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav
            aria-label="Legal"
            className="mt-8 border-t border-border/70 pt-5"
          >
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t("links.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t("links.cookies")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <NewsletterSignup placement="footer" />
      </div>
      <div className="mt-14 bg-[#0d0f0c] py-4">
        <div className="section-shell flex flex-col gap-3 text-xs uppercase tracking-[0.18em] text-white/52 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright")}</p>
          <p>{t("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
