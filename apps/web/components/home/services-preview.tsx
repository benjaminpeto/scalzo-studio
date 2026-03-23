import {
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollFloat,
  TextReveal,
} from "@/components/home/motion";
import type { ServiceGroup } from "@/components/home/content";
import { ServiceCard } from "@ui/components/marketing/service-card";

export function ServicesPreview({
  services,
}: {
  services: ReadonlyArray<ServiceGroup>;
}) {
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
          {services.map((service, index) => (
            <RevealItem key={service.title}>
              <ServiceCard
                title={service.title}
                indexLabel={`0${index + 1}`}
                description={service.intro}
                items={service.items}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </Reveal>
    </section>
  );
}
