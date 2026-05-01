import { RevealGroup, RevealItem } from "@/components/home/motion";
import type { ServicesIndexEntry } from "@/interfaces/services/content";
import { ServiceCard } from "@ui/components/marketing/service-card";

export function AboutCapabilitiesGrid({
  services,
}: {
  services: ReadonlyArray<ServicesIndexEntry>;
}) {
  return (
    <RevealGroup className="grid gap-8 lg:grid-cols-3" stagger={0.08}>
      {services.map((service, index) => (
        <RevealItem key={service.slug}>
          <ServiceCard
            className="h-full rounded-[1.8rem] bg-white p-6 shadow-[0_16px_44px_rgba(27,28,26,0.05)] ring-1 ring-black/4"
            cta={{
              href: `/services/${service.slug}`,
              label: "Explore service",
            }}
            description={service.summary}
            indexLabel={`0${index + 1}`}
            items={service.deliverables}
            metadata="Scalzo Studio capability"
            outcome={service.outcome}
            showMarkers={false}
            title={service.title}
          />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
