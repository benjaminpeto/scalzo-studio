import type {
  ServiceDetailProcessStep,
  ServicePackageOption,
  ServicesFaqItem,
  ServicesIndexEntry,
} from "@/interfaces/services/content";

export const fallbackServicesIndexEntries = [
  {
    deliverables: [
      "Offer positioning",
      "Conversion hierarchy",
      "Brand narrative",
    ],
    outcome:
      "Sharper language, calmer page structure, and a stronger sales story.",
    slug: "strategic-framing",
    summary:
      "We identify the message, the audience, and the right visual level before the page starts trying to sell itself.",
    title: "Strategic framing",
  },
  {
    deliverables: [
      "Homepage composition",
      "Component styling",
      "Responsive behavior",
    ],
    outcome:
      "A clearer interface system that feels more deliberate across every breakpoint.",
    slug: "design-systems",
    summary:
      "The interface, typography, and asset logic are built to feel deliberate across desktop, mobile, and future additions.",
    title: "Design systems",
  },
  {
    deliverables: [
      "Editorial assets",
      "Campaign support",
      "Content structures",
    ],
    outcome:
      "A rollout system that keeps launches, campaigns, and follow-on pages aligned.",
    slug: "digital-rollout",
    summary:
      "Once the homepage direction is right, the same language can extend into launch assets, content, and other commercial pages.",
    title: "Digital rollout",
  },
] as const satisfies readonly ServicesIndexEntry[];

export const servicePackageOptions: readonly ServicePackageOption[] = [
  {
    bestFor: "Teams that need clarity before redesign decisions compound.",
    label: "Diagnostic sprint",
    summary:
      "A focused positioning and structure pass that identifies what the site needs to say earlier, clearer, and with more authority.",
    timeline: "1 week",
  },
  {
    bestFor:
      "Founders who need a new page direction with stronger commercial weight.",
    label: "Signature page build",
    summary:
      "Strategy, design direction, component language, and a high-trust service page or homepage system built as one coherent release.",
    timeline: "2-4 weeks",
  },
  {
    bestFor:
      "Studios that want continuity across launch, content, and follow-on pages.",
    label: "Ongoing design partner",
    summary:
      "A retained collaboration model for rollout assets, page refinements, and campaign support after the core direction lands.",
    timeline: "Monthly",
  },
] as const;

export const servicesFaqItems: readonly ServicesFaqItem[] = [
  {
    answer:
      "Most engagements begin with one page or one offer problem, then expand once the direction is proven. The page does not have to be the entire website to justify the work.",
    question: "Do we need the full site figured out before starting?",
  },
  {
    answer:
      "Yes. The strongest fit is a business with a real offer that needs sharper positioning, stronger proof, and more deliberate page structure.",
    question: "Can this work for service businesses and product-led teams?",
  },
  {
    answer:
      "Yes. Each core service now has its own detail page with framing, deliverables, process, and a clearer CTA path.",
    question: "Will each service get its own detail page?",
  },
  {
    answer:
      "Usually with a short review of the current site, the current offer, and the moments where confidence drops for the buyer. That gives the work a clear commercial target from day one.",
    question: "What happens before design work starts?",
  },
];

export const fallbackServiceDetailBySlug: Record<
  string,
  {
    faq: readonly ServicesFaqItem[];
    problem: string;
    timeline: readonly ServiceDetailProcessStep[];
  }
> = {
  "design-systems": {
    faq: [
      {
        answer:
          "Usually not. The useful outcome is a page and component language that the existing build can adopt without forcing a total rewrite.",
        question: "Does this require rebuilding the whole site?",
      },
      {
        answer:
          "Yes. The work is meant to make future pages, launches, and assets feel structurally related instead of visually improvised.",
        question: "Can this extend beyond the homepage?",
      },
    ],
    problem:
      "The interface looks serviceable, but it does not create enough authority. Type, spacing, component rhythm, and responsive behavior all need a stronger system underneath them.",
    timeline: [
      {
        body: "Review current layouts, friction points, and the level of confidence the interface needs to create.",
        step: "01",
        title: "Audit the current interface",
      },
      {
        body: "Define type, spacing, component, and interaction rules that can hold across present and future pages.",
        step: "02",
        title: "Build the visual system",
      },
      {
        body: "Apply the system to the key page or flow so the direction is proven in a real commercial context.",
        step: "03",
        title: "Land the direction in production",
      },
    ],
  },
  "digital-rollout": {
    faq: [
      {
        answer:
          "Yes. This is designed for the phase after a direction is set, when launches and ongoing content need consistency without becoming repetitive.",
        question: "Is this useful after the main page work is live?",
      },
      {
        answer:
          "It can include launch pages, campaign assets, editorial layouts, or repeatable content structures, depending on what the business needs next.",
        question: "What kinds of outputs fit inside rollout support?",
      },
    ],
    problem:
      "A strong direction often weakens during rollout. Campaigns, secondary pages, and content assets start drifting unless the brand and interface logic are translated into repeatable working patterns.",
    timeline: [
      {
        body: "Identify where launches, campaigns, or follow-on pages are currently losing consistency.",
        step: "01",
        title: "Map the rollout surface",
      },
      {
        body: "Turn the direction into reusable structures for content, pages, and campaign execution.",
        step: "02",
        title: "Build repeatable patterns",
      },
      {
        body: "Apply the system to live outputs so the next release feels intentional, not improvised.",
        step: "03",
        title: "Ship the next wave",
      },
    ],
  },
  "strategic-framing": {
    faq: [
      {
        answer:
          "Yes. This is often the right starting point when the offer is real but the page still sounds too generic or tries to say too much at once.",
        question: "Is this the best first step before design work?",
      },
      {
        answer:
          "It gives the team a clearer message hierarchy, stronger conversion logic, and a more commercially useful narrative to build on.",
        question: "What changes after the framing work is done?",
      },
    ],
    problem:
      "The offer may be strong, but the page is not presenting it with enough clarity or confidence. Buyers should understand what matters, why it matters, and what to do next much earlier.",
    timeline: [
      {
        body: "Review the current site, offer, and moments where the buyer is likely losing trust or attention.",
        step: "01",
        title: "Read the current story",
      },
      {
        body: "Restructure the message so the page leads with the strongest proof, language, and decision path.",
        step: "02",
        title: "Clarify the hierarchy",
      },
      {
        body: "Translate that logic into a brief the design and rollout work can execute without second-guessing.",
        step: "03",
        title: "Prepare the build direction",
      },
    ],
  },
};
