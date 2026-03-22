import type { ReactNode } from "react";

import { Reveal, ScrollFloat } from "@/components/home/motion";
import { MarketingCtaBand } from "@ui/components/marketing/cta-band";

function ContentColumn({ children }: { children: ReactNode }) {
  return <ScrollFloat offset={30}>{children}</ScrollFloat>;
}

function BriefColumn({ children }: { children: ReactNode }) {
  return <ScrollFloat offset={38}>{children}</ScrollFloat>;
}

export function CtaBand() {
  return (
    <MarketingCtaBand
      id="quote"
      briefItems={[
        "What is the business trying to look like?",
        "Where does the current homepage lose confidence?",
        "What should a better first impression help you win?",
      ]}
      briefKicker="Quick brief"
      contactId="contact"
      contentWrapper={ContentColumn}
      description={
        <>
          The first step is a direct conversation about the current page, the
          level of ambition, and what needs to feel more premium or more
          convincing.
        </>
      }
      email={{
        href: "mailto:hello@scalzostudio.com",
        label: "hello@scalzostudio.com",
      }}
      gridWrapper={Reveal}
      kicker="Brand Organiser"
      primaryAction={{ href: "/#contact", label: "Book a discovery call" }}
      secondaryAction={{ href: "/#journal", label: "Read the journal" }}
      briefWrapper={BriefColumn}
      title="Ready to sharpen the homepage and the brand behind it?"
    />
  );
}
