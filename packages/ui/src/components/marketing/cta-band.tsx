import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

type WrapperProps = {
  children: React.ReactNode;
  className?: string;
};

type WrapperComponent = React.ComponentType<WrapperProps>;

type CtaAction = {
  href: string;
  label: string;
};

type CtaEmail = {
  href: string;
  label: string;
};

function DefaultWrapper({ children, className }: WrapperProps) {
  if (!className) {
    return <>{children}</>;
  }

  return <div className={className}>{children}</div>;
}

export interface MarketingCtaBandProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "title"
> {
  contactId?: string;
  kicker: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  primaryAction: CtaAction;
  secondaryAction?: CtaAction;
  briefKicker: React.ReactNode;
  briefItems: readonly React.ReactNode[];
  email: CtaEmail;
  gridWrapper?: WrapperComponent;
  contentWrapper?: WrapperComponent;
  briefWrapper?: WrapperComponent;
}

export function MarketingCtaBand({
  contactId,
  kicker,
  title,
  description,
  primaryAction,
  secondaryAction,
  briefKicker,
  briefItems,
  email,
  gridWrapper: GridWrapper = DefaultWrapper,
  contentWrapper: ContentWrapper = DefaultWrapper,
  briefWrapper: BriefWrapper = DefaultWrapper,
  className,
  ...props
}: MarketingCtaBandProps) {
  return (
    <section
      className={cn("section-shell anchor-offset py-20 lg:py-28", className)}
      {...props}
    >
      <GridWrapper className="grid gap-8 lg:grid-cols-[0.48fr_0.52fr] lg:items-center">
        <ContentWrapper>
          <div id={contactId}>
            <p className="section-kicker">{kicker}</p>
            <h2 className="mt-5 font-display text-[2.7rem] leading-[0.95] tracking-[-0.05em] text-foreground sm:text-[3.6rem] lg:text-[4.4rem]">
              {title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              {description}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-13 rounded-full bg-[#0d0f0c] px-7 text-[0.78rem] uppercase tracking-[0.22em] text-white hover:bg-[#191c18] focus-visible:ring-2 focus-visible:ring-primary/35"
              >
                <Link href={primaryAction.href}>
                  {primaryAction.label}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
              {secondaryAction ? (
                <Button
                  asChild
                  className="h-13 rounded-full border-border bg-white px-7 text-[0.78rem] uppercase tracking-[0.22em] text-foreground hover:bg-white focus-visible:ring-2 focus-visible:ring-primary/35"
                  variant="outline"
                >
                  <Link href={secondaryAction.href}>
                    {secondaryAction.label}
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </ContentWrapper>

        <BriefWrapper>
          <div className="rounded-[1.8rem] bg-white p-6 shadow-[0_10px_30px_rgba(27,28,26,0.05)] ring-1 ring-black/4 sm:p-8">
            <p className="section-kicker">{briefKicker}</p>
            <div className="mt-6 space-y-5 text-base leading-7 text-muted-foreground">
              {briefItems.map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </div>
            <div className="mt-8 border-t border-border/70 pt-5">
              <Link
                className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-foreground transition-colors hover:text-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/35"
                href={email.href}
              >
                {email.label}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
        </BriefWrapper>
      </GridWrapper>
    </section>
  );
}
