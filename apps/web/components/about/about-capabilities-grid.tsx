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

export function AboutCapabilitiesFallback() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <article
          key={index}
          className="h-full rounded-[1.8rem] bg-white p-6 shadow-[0_16px_44px_rgba(27,28,26,0.05)] ring-1 ring-black/4"
        >
          <div className="h-4 w-10 rounded-full bg-black/6" />
          <div className="mt-5 h-4 w-36 rounded-full bg-black/6" />
          <div className="mt-3 h-8 w-44 rounded-[0.9rem] bg-black/8" />
          <div className="mt-5 space-y-3">
            <div className="h-4 rounded-full bg-black/7" />
            <div className="h-4 max-w-[84%] rounded-full bg-black/5" />
          </div>
          <div className="mt-7 space-y-3">
            <div className="h-4 rounded-full bg-black/7" />
            <div className="h-4 max-w-[82%] rounded-full bg-black/5" />
            <div className="h-4 max-w-[70%] rounded-full bg-black/4" />
          </div>
        </article>
      ))}
    </div>
  );
}
