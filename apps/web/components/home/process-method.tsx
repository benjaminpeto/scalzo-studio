import { processSteps } from "@/components/home/content";
import {
  HoverCard,
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollFloat,
  TextReveal,
} from "@/components/home/motion";

export function ProcessMethod() {
  return (
    <section id="method" className="anchor-offset py-20 lg:py-28">
      <Reveal className="bg-[#0d0f0c] py-18 text-white">
        <div className="section-shell">
          <ScrollFloat className="mx-auto max-w-3xl" offset={30}>
            <TextReveal>
              <h2 className="font-display text-[3rem] leading-[0.9] tracking-[-0.06em] text-white sm:text-[4rem] lg:text-[5.2rem]">
                Every strong homepage starts with sharper meaning.
              </h2>
            </TextReveal>
            <TextReveal delay={0.08}>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/72">
                The method rests on four pillars. We read the context, position
                the message, express the brand through the interface, and shape
                the navigation so the ambition becomes more legible.
              </p>
            </TextReveal>
          </ScrollFloat>

          <RevealGroup
            className="mt-12 grid gap-4 lg:grid-cols-4"
            stagger={0.08}
          >
            {processSteps.map((step, index) => (
              <RevealItem key={step.step}>
                <HoverCard>
                  <article className="h-full rounded-[1.7rem] bg-white p-6 text-foreground shadow-[0_18px_40px_rgba(0,0,0,0.14)]">
                    <div className="flex items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-1">
                        {Array.from({ length: 4 }).map((_, dotIndex) => (
                          <span
                            key={`${step.step}-${dotIndex}`}
                            className={`inline-block size-2 rounded-full ${
                              dotIndex <= index ? "bg-primary" : "bg-border"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {step.step}
                      </p>
                    </div>
                    <h3 className="mt-10 font-display text-[2rem] leading-none tracking-[-0.04em] text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-6 text-base leading-7 text-muted-foreground">
                      {step.description}
                    </p>
                  </article>
                </HoverCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Reveal>
    </section>
  );
}
