import "server-only";

import { featuredProjects as fallbackFeaturedProjects } from "@/constants/home/content";
import {
  fallbackServiceDetailBySlug,
  fallbackServicesIndexEntries,
} from "@/constants/services/content";
import type {
  ServiceDetailPageData,
  ServiceDetailProcessStep,
  ServiceRelatedWorkItem,
  ServicesFaqItem,
  ServicesIndexEntry,
} from "@/interfaces/services/content";
import { titleCaseFromSlug } from "@/lib/content/format";

export function cloneFallbackServices(): ServicesIndexEntry[] {
  return fallbackServicesIndexEntries.map((service) => ({
    deliverables: [...service.deliverables],
    outcome: service.outcome,
    slug: service.slug,
    summary: service.summary,
    title: service.title,
  }));
}

export function buildFallbackRelatedWork(): ServiceRelatedWorkItem[] {
  return fallbackFeaturedProjects.slice(0, 2).map((project) => ({
    description: project.description,
    image: project.image,
    metadata: `${project.category} / ${project.accent}`,
    outcome: project.metric,
    title: project.title,
  }));
}

export function buildGenericServiceFaq(title: string): ServicesFaqItem[] {
  return [
    {
      answer: `The work is scoped around the moments where ${title.toLowerCase()} needs to create more clarity, more confidence, or a more useful buying path.`,
      question: `What does ${title.toLowerCase()} help fix first?`,
    },
    {
      answer:
        "The engagement normally starts with the current page, the current offer, and the place where the buyer is hesitating. That is enough to define the next move.",
      question: "What do you need from us before this starts?",
    },
  ];
}

export function buildGenericServiceTimeline(
  title: string,
): ServiceDetailProcessStep[] {
  return [
    {
      body: `Review the current offer, page, and decision points so ${title.toLowerCase()} can target the real friction instead of surface symptoms.`,
      step: "01",
      title: "Read the context",
    },
    {
      body: "Define the clearest structure, strongest signals, and deliverables needed to make the work commercially useful.",
      step: "02",
      title: "Shape the direction",
    },
    {
      body: "Apply the direction to the live page, assets, or system so the result is visible in production rather than remaining theoretical.",
      step: "03",
      title: "Deploy the outcome",
    },
  ];
}

export function extractProblemFromContent(
  content: string | null,
  fallback: string,
) {
  if (!content) {
    return fallback;
  }

  const firstParagraph = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .find(Boolean);

  return firstParagraph ?? fallback;
}

export function getServiceDetailBodyCopy(data: ServiceDetailPageData) {
  const paragraphs = data.content
    ?.split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs?.length) {
    return paragraphs;
  }

  return [data.summary];
}

export function getFallbackServiceDetailPageData(
  slug: string,
): ServiceDetailPageData {
  const fallbackService = fallbackServicesIndexEntries.find(
    (entry) => entry.slug === slug,
  ) ?? {
    deliverables: [
      "Offer diagnosis",
      "Page structure direction",
      "Commercial clarity",
    ],
    outcome:
      "A clearer service story with stronger proof, calmer hierarchy, and a cleaner CTA path.",
    slug,
    summary:
      "A focused service direction built to make the offer easier to understand and easier to trust.",
    title: titleCaseFromSlug(slug),
  };

  const fallbackDetail = fallbackServiceDetailBySlug[slug] ?? {
    faq: buildGenericServiceFaq(fallbackService.title),
    problem: `This service exists to make ${fallbackService.title.toLowerCase()} more commercially effective, easier to understand, and easier to trust.`,
    timeline: buildGenericServiceTimeline(fallbackService.title),
  };

  return {
    content: null,
    deliverables: [...fallbackService.deliverables],
    faq: fallbackDetail.faq,
    outcome: fallbackService.outcome,
    problem: fallbackDetail.problem,
    relatedWork: buildFallbackRelatedWork(),
    seoDescription: null,
    seoTitle: null,
    slug: fallbackService.slug,
    summary: fallbackService.summary,
    timeline: fallbackDetail.timeline,
    title: fallbackService.title,
  };
}
