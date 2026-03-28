import {
  featuredProjects as fallbackFeaturedProjects,
  testimonials as fallbackTestimonials,
} from "@/constants/home/content";
import type {
  WorkDetailTestimonial,
  WorkIndexEntry,
} from "@/interfaces/work/content";

export const fallbackWorkImage = "/placeholders/hero-editorial.svg";

export const fallbackWorkIndexEntries: readonly WorkIndexEntry[] =
  fallbackFeaturedProjects.map((project, index) => ({
    description: project.description,
    image: project.image,
    metadata: `${project.category} / ${project.accent}`,
    metric: project.metric,
    slug: `featured-${index + 1}`,
    title: project.title,
  }));

export const fallbackWorkDetailBySlug: Record<
  string,
  {
    approach: string;
    challenge: string;
    clientName: string;
    industry: string;
    outcomes: string;
    services: readonly string[];
    testimonial: WorkDetailTestimonial;
  }
> = {
  "featured-1": {
    approach:
      "The page was rebuilt around the feeling of arrival. Offer hierarchy, imagery, and trust signals were reordered so the premium positioning was visible before the visitor reached practical details.",
    challenge:
      "The business already delivered a high-end stay, but the site still introduced it like a generic booking option. The first impression needed to feel more established and more direct-booking friendly.",
    clientName: "Coastal hospitality brand",
    industry: "Hospitality",
    outcomes:
      "Qualified enquiries increased because the site made the value clearer earlier. The sales conversation started from preference rather than explanation, and direct-booking intent improved alongside trust.",
    services: ["Brand direction", "Website strategy", "Conversion design"],
    testimonial: {
      company: "Coastal hospitality brand",
      name: "Marta R.",
      quote:
        "The site started to feel premium before anyone reached the booking details, which changed the quality of the conversations that followed.",
      role: "Founder",
    },
  },
  "featured-2": {
    approach:
      "The launch surface was simplified around a tighter story, clearer navigation, and calmer product framing. The interface was reset to guide new visitors through understanding before asking them to commit.",
    challenge:
      "The product had momentum internally, but the launch experience leaned too heavily on novelty. The team needed a sharper route from first impression to product understanding.",
    clientName: "Launch-stage product team",
    industry: "Technology",
    outcomes:
      "The MVP could present itself with more confidence, making onboarding simpler and reducing the amount of explanation required in live demos and follow-up conversations.",
    services: ["Product strategy", "Launch design", "UX direction"],
    testimonial: {
      company: "Launch-stage product team",
      name: "Lucia P.",
      quote:
        "The new direction made the product feel more decisive. Prospects understood what mattered faster and the team had a stronger story to stand behind.",
      role: "Brand lead",
    },
  },
  "featured-3": {
    approach:
      "A reusable editorial kit was designed to hold campaign, launch, and content work inside one system. Instead of one-off assets, the business gained repeatable structures for publishing and iteration.",
    challenge:
      "The brand had taste and momentum, but each new launch or campaign required starting from scratch. The missing layer was not more content, but a stronger editorial framework.",
    clientName: "Local premium brand",
    industry: "Retail",
    outcomes:
      "The content operation became faster and more consistent. Campaign production took less coordination, and the visual language became recognisable across launches without feeling templated.",
    services: ["Content systems", "Editorial design", "Campaign support"],
    testimonial: {
      company: "Local premium brand",
      name: "Daniel V.",
      quote:
        "What changed most was consistency. The brand stopped resetting itself every time we had something new to publish.",
      role: "Managing director",
    },
  },
  "featured-4": {
    approach:
      "The homepage was reorganised around proof, pacing, and a clearer CTA sequence. Visual noise was reduced so the service itself could carry more authority in the first scroll.",
    challenge:
      "The business was strong, but the homepage made first-time visitors work too hard to trust it. The offer needed a calmer route from introduction to contact.",
    clientName: "Service-led growth studio",
    industry: "Professional services",
    outcomes:
      "Visitors stayed longer, proof landed sooner, and the homepage started acting like a sales asset rather than a placeholder. The team had a clearer structure for future page decisions too.",
    services: ["Homepage strategy", "Conversion design", "Content direction"],
    testimonial: {
      company: "Service-led growth studio",
      name: "Daniel V.",
      quote:
        "The homepage finally started sounding like the business we were already running behind the scenes.",
      role: "Managing director",
    },
  },
};

export { fallbackTestimonials };
