import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CookieBanner } from "@/components/cookie-consent/cookie-banner";
import { MobileCtaBar } from "@/components/layout/mobile-cta-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MarketingPageViewTracker } from "@/components/tracking/marketing-page-view-tracker";
import { JsonLd } from "@/lib/seo/json-ld";
import { buildOrganizationSchema } from "@/lib/seo/schema";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {t("skipToContent")}
      </a>
      <div className="flex min-h-svh flex-col">
        <JsonLd data={buildOrganizationSchema()} />
        <Suspense fallback={null}>
          <MarketingPageViewTracker />
        </Suspense>
        <Suspense fallback={null}>
          <SiteHeader />
        </Suspense>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Suspense fallback={null}>
          <SiteFooter />
        </Suspense>
      </div>
      <MobileCtaBar />
      <CookieBanner />
    </>
  );
}
