import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { LegalStatus, LegalSummaryItem } from "@/lib/content/legal";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";

export function LegalPage({
  children,
  intro,
  title,
  kicker,
  lastUpdated,
  note,
  summary,
}: {
  children: ReactNode;
  intro: string;
  title: string;
  kicker: string;
  lastUpdated: string;
  note?: string;
  summary: readonly LegalSummaryItem[];
}) {
  return (
    <>
      <Section spacing="tight" className="overflow-hidden pb-12 lg:pb-16">
        <Grid gap="2xl" className="lg:grid-cols-[0.6fr_0.4fr] lg:items-end">
          <Stack gap="lg">
            <p className="section-kicker">{kicker}</p>
            <h1 className="max-w-5xl font-display text-[3.3rem] leading-[0.91] tracking-[-0.065em] text-foreground sm:text-[4.4rem] lg:text-[5.4rem]">
              {title}
            </h1>
            <Prose size="lg" measure="lg">
              {intro}
            </Prose>
            <div className="inline-flex w-fit items-center rounded-full border border-border/70 bg-white/84 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground shadow-[0_14px_40px_rgba(27,28,26,0.04)]">
              Last updated {lastUpdated}
            </div>
            {note ? (
              <div className="surface-grain max-w-3xl rounded-[1.6rem] border border-border/70 bg-white/84 p-5 shadow-[0_18px_52px_rgba(27,28,26,0.05)]">
                <Prose measure="lg" size="md" tone="strong">
                  {note}
                </Prose>
              </div>
            ) : null}
          </Stack>

          <Grid gap="lg" className="lg:grid-cols-1">
            {summary.map((item) => (
              <div
                key={item.label}
                className="surface-grain rounded-[1.7rem] border border-border/70 bg-white/84 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)]"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-3 font-display text-[1.85rem] leading-[0.98] tracking-[-0.045em] text-foreground">
                  {item.value}
                </p>
                <Prose className="mt-3" measure="md" size="sm">
                  {item.detail}
                </Prose>
              </div>
            ))}
          </Grid>
        </Grid>
      </Section>

      <Section spacing="tight" className="pb-20 lg:pb-24">
        <Stack gap="2xl">{children}</Stack>
      </Section>
    </>
  );
}

export function LegalSection({
  children,
  id,
  title,
  intro,
}: {
  children: ReactNode;
  id?: string;
  title: string;
  intro?: string;
}) {
  return (
    <section id={id} className="scroll-mt-32">
      <div className="rounded-4xl border border-border/70 bg-white/84 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
        <div className="max-w-3xl">
          <h2 className="font-display text-[2.3rem] leading-[0.95] tracking-[-0.05em] text-foreground sm:text-[3rem]">
            {title}
          </h2>
          {intro ? (
            <Prose className="mt-4" measure="lg" size="lg">
              {intro}
            </Prose>
          ) : null}
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export function LegalCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "rounded-[1.55rem] border border-border/70 bg-[rgba(255,255,255,0.72)] p-5 shadow-[0_16px_40px_rgba(27,28,26,0.04)]",
        className,
      )}
    >
      {children}
    </article>
  );
}

export function LegalStatusBadge({ status }: { status: LegalStatus }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em]",
        status === "Live"
          ? "bg-[#111311] text-white"
          : "border border-border/70 bg-white text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}
