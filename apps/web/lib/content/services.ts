import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface ServicesIndexEntry {
  deliverables: readonly string[];
  outcome: string;
  slug: string;
  summary: string;
  title: string;
}

export interface ServicePackageOption {
  bestFor: string;
  label: string;
  summary: string;
  timeline: string;
}

export interface ServicesFaqItem {
  answer: string;
  question: string;
}

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
] as const;

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
      "Not yet. For now this index is the main services surface, and the CTA path stays focused on direct contact instead of unfinished detail pages.",
    question: "Will each service get its own detail page?",
  },
  {
    answer:
      "Usually with a short review of the current site, the current offer, and the moments where confidence drops for the buyer. That gives the work a clear commercial target from day one.",
    question: "What happens before design work starts?",
  },
] as const;

function cloneFallbackServices(): ServicesIndexEntry[] {
  return fallbackServicesIndexEntries.map((service) => ({
    deliverables: [...service.deliverables],
    outcome: service.outcome,
    slug: service.slug,
    summary: service.summary,
    title: service.title,
  }));
}

export async function getServicesIndexEntries() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("services")
    .select("deliverables, order_index, slug, summary, title")
    .eq("published", true)
    .order("order_index", { ascending: true });

  if (error || !data?.length) {
    return cloneFallbackServices();
  }

  return data.map((service, index) => ({
    deliverables: service.deliverables?.length
      ? service.deliverables
      : [...(fallbackServicesIndexEntries[index]?.deliverables ?? [])],
    outcome:
      fallbackServicesIndexEntries.find(
        (fallback) => fallback.slug === service.slug,
      )?.outcome ??
      fallbackServicesIndexEntries[index]?.outcome ??
      "Designed to make the offer easier to understand and easier to trust.",
    slug: service.slug,
    summary:
      service.summary ??
      fallbackServicesIndexEntries.find(
        (fallback) => fallback.slug === service.slug,
      )?.summary ??
      fallbackServicesIndexEntries[index]?.summary ??
      "",
    title: service.title,
  }));
}
