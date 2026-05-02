import { RevealGroup, RevealItem } from "@/components/home/motion";
import { getHomeTestimonials } from "@/actions/home/get-home-testimonials";
import type { Locale } from "@/lib/i18n/routing";
import { TestimonialCard } from "@ui/components/marketing/testimonial-card";

export async function AboutProofContent({ locale }: { locale: Locale }) {
  const testimonials = await getHomeTestimonials(locale);

  return (
    <RevealGroup
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      stagger={0.08}
    >
      {testimonials.map((testimonial) => (
        <RevealItem key={`${testimonial.name}-${testimonial.company}`}>
          <TestimonialCard
            className="h-full"
            company={testimonial.company}
            name={testimonial.name}
            quote={testimonial.quote}
            role={testimonial.role}
          />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
