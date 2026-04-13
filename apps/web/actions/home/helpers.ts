import {
  featuredProjects as fallbackFeaturedProjects,
  journalEntries as fallbackJournalEntries,
  serviceGroups as fallbackServiceGroups,
  testimonials as fallbackTestimonials,
} from "@/constants/home/content";
import { createCmsImageAsset } from "@/lib/media-assets/shared";
import type {
  FeaturedProject,
  JournalEntry,
  ServiceGroup,
  Testimonial,
} from "@/interfaces/home/content";

export const fallbackHomeProjectImage = createCmsImageAsset({
  alt: "Generic featured project placeholder artwork",
  src: "/placeholders/hero-editorial.svg",
});
export const fallbackHomeJournalImage = createCmsImageAsset({
  alt: "Generic journal placeholder artwork",
  src: "/placeholders/hero-editorial.svg",
});

export function cloneFallbackServiceGroups(): ServiceGroup[] {
  return fallbackServiceGroups.map((service) => ({
    intro: service.intro,
    items: [...service.items],
    title: service.title,
  }));
}

export function cloneFallbackFeaturedProjects(): FeaturedProject[] {
  return fallbackFeaturedProjects.map((project) => ({
    accent: project.accent,
    category: project.category,
    description: project.description,
    image: project.image,
    metric: project.metric,
    title: project.title,
  }));
}

export function cloneFallbackJournalEntries(): JournalEntry[] {
  return fallbackJournalEntries.map((entry) => ({
    category: entry.category,
    date: entry.date,
    excerpt: entry.excerpt,
    image: entry.image,
    slug: entry.slug,
    title: entry.title,
  }));
}

export function cloneFallbackTestimonials(): Testimonial[] {
  return fallbackTestimonials.map((testimonial) => ({
    company: testimonial.company,
    image: testimonial.image,
    name: testimonial.name,
    quote: testimonial.quote,
    role: testimonial.role,
  }));
}
