import { Prose } from "@ui/components/layout/prose";
import { ReactNode } from "react";

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
