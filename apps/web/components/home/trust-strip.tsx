import {
  DeckRevealOnScroll,
  HoverCard,
  RevealGroup,
  RevealItem,
} from "@/components/home/motion";
import { trustMarks } from "@/constants/home/content";

export function TrustStrip() {
  return (
    <section
      aria-label="Studio proof"
      className="section-shell anchor-offset relative z-10 pb-8 pt-0 -mt-12 lg:pb-10"
    >
      <DeckRevealOnScroll>
        <RevealGroup
          className="grid gap-3 md:grid-cols-3 xl:grid-cols-6"
          stagger={0.06}
        >
          {trustMarks.map((mark) => (
            <RevealItem key={mark.name}>
              <HoverCard className="h-full">
                <div className="flex h-full min-h-36 flex-col items-center justify-center rounded-[1.55rem] bg-white px-5 py-6 text-center shadow-[0_8px_28px_rgba(27,28,26,0.04)] ring-1 ring-black/4 transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(27,28,26,0.08)]">
                  <p className="font-display text-[2rem] leading-none tracking-[-0.05em] text-foreground">
                    {mark.name}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {mark.note}
                  </p>
                </div>
              </HoverCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </DeckRevealOnScroll>
    </section>
  );
}
