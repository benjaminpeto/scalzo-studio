import type { ReactNode } from "react";

import { Reveal, ScrollFloat } from "@/components/home/motion";
import { getHomePublicContent } from "@/constants/home/public-content";
import { MarketingCtaBand } from "@ui/components/marketing/cta-band";

function ContentColumn({ children }: { children: ReactNode }) {
  return <ScrollFloat offset={30}>{children}</ScrollFloat>;
}

function BriefColumn({ children }: { children: ReactNode }) {
  return <ScrollFloat offset={38}>{children}</ScrollFloat>;
}

export function CtaBand({ locale }: { locale: string }) {
  const content = getHomePublicContent(locale).ctaBand;

  return (
    <MarketingCtaBand
      id="quote"
      briefItems={content.briefItems}
      briefKicker={content.briefKicker}
      contactId="contact"
      contentWrapper={ContentColumn}
      description={content.description}
      email={{
        href: "mailto:hello@scalzostudio.com",
        label: "hello@scalzostudio.com",
      }}
      gridWrapper={Reveal}
      kicker={content.kicker}
      primaryAction={{
        href: "/contact#booking",
        label: content.primaryActionLabel,
      }}
      secondaryAction={{
        href: "/#journal",
        label: content.secondaryActionLabel,
      }}
      briefWrapper={BriefColumn}
      title={content.title}
    />
  );
}
