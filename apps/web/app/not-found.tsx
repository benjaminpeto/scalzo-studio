import { NextIntlClientProvider } from "next-intl";

import { MobileCtaBar } from "@/components/layout/mobile-cta-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteNotFound } from "@/components/not-found/site-not-found";
import enMessages from "@/messages/en.json";

export default function RootNotFound() {
  return (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="flex min-h-svh flex-col">
        <SiteHeader />
        <main id="main-content" className="flex-1">
          <SiteNotFound />
        </main>
        <SiteFooter />
      </div>
      <MobileCtaBar />
    </NextIntlClientProvider>
  );
}
