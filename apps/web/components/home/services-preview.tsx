import { serviceGroups } from "@/components/home/content";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollFloat,
  TextReveal,
} from "@/components/home/motion";

export function ServicesPreview() {
  return (
    <section
      id="services"
      className="section-shell anchor-offset py-20 lg:py-28"
    >
      <Reveal>
        <ScrollFloat className="text-center" offset={26}>
          <p className="section-kicker">Scalzo Studio</p>
          <TextReveal delay={0.06}>
            <h2 className="mx-auto mt-6 max-w-4xl text-balance font-display text-[2.6rem] leading-[1.02] tracking-[-0.05em] text-foreground sm:text-[3.3rem] lg:text-[4.2rem]">
              Strategie • Design • Digital
            </h2>
          </TextReveal>
        </ScrollFloat>

        <RevealGroup className="mt-12 grid gap-8 lg:grid-cols-3" stagger={0.1}>
          {serviceGroups.map((service, index) => (
            <RevealItem key={service.title}>
              <article className="rounded-[1.7rem] bg-transparent px-2 py-1">
                <div className="inline-flex items-center gap-1">
                  <span className="inline-block size-2 rounded-full bg-primary" />
                  <span className="inline-block size-2 rounded-full bg-primary/70" />
                  <span className="inline-block size-2 rounded-full bg-border" />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  0{index + 1}
                </p>
                <h3 className="mt-3 font-display text-[2rem] leading-none tracking-[-0.04em] text-foreground">
                  {service.title}
                </h3>
                <p className="mt-5 text-base leading-7 text-muted-foreground">
                  {service.intro}
                </p>
                <ul className="mt-7 space-y-3 text-base leading-7 text-foreground">
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Reveal>
    </section>
  );
}
