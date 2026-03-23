import "server-only";

import {
  featuredProjects as fallbackFeaturedProjects,
  journalEntries as fallbackJournalEntries,
  serviceGroups as fallbackServiceGroups,
  testimonials as fallbackTestimonials,
  type FeaturedProject,
  type JournalEntry,
  type ServiceGroup,
  type Testimonial,
} from "@/components/home/content";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const fallbackProjectImage = "/placeholders/hero-editorial.svg";
const fallbackJournalImage = "/placeholders/hero-editorial.svg";

function cloneFallbackServiceGroups(): ServiceGroup[] {
  return fallbackServiceGroups.map((service) => ({
    intro: service.intro,
    items: [...service.items],
    title: service.title,
  }));
}

function cloneFallbackFeaturedProjects(): FeaturedProject[] {
  return fallbackFeaturedProjects.map((project) => ({
    accent: project.accent,
    category: project.category,
    description: project.description,
    image: project.image,
    metric: project.metric,
    title: project.title,
  }));
}

function cloneFallbackJournalEntries(): JournalEntry[] {
  return fallbackJournalEntries.map((entry) => ({
    category: entry.category,
    date: entry.date,
    excerpt: entry.excerpt,
    image: entry.image,
    title: entry.title,
  }));
}

function cloneFallbackTestimonials(): Testimonial[] {
  return fallbackTestimonials.map((testimonial) => ({
    company: testimonial.company,
    name: testimonial.name,
    quote: testimonial.quote,
    role: testimonial.role,
  }));
}

function formatPublishedDate(value: string | null, fallback: string) {
  if (!value) {
    return fallback;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

async function getHomeServices() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("services")
    .select("deliverables, order_index, summary, title")
    .eq("published", true)
    .order("order_index", { ascending: true })
    .limit(fallbackServiceGroups.length);

  if (error || !data?.length) {
    return cloneFallbackServiceGroups();
  }

  return data.map((service, index) => ({
    intro: service.summary ?? fallbackServiceGroups[index]?.intro ?? "",
    items: service.deliverables?.slice(0, 3) ?? [
      ...(fallbackServiceGroups[index]?.items ?? []),
    ],
    title: service.title,
  }));
}

async function getHomeFeaturedProjects() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select(
      "client_name, cover_image_url, industry, outcomes, outcomes_metrics, published_at, services, title, updated_at",
    )
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false })
    .limit(fallbackFeaturedProjects.length);

  if (error || !data?.length) {
    return cloneFallbackFeaturedProjects();
  }

  return data.map((project, index) => ({
    accent:
      project.services?.[0] ??
      project.client_name ??
      fallbackFeaturedProjects[index]?.accent ??
      "Selected engagement",
    category:
      project.industry ??
      fallbackFeaturedProjects[index]?.category ??
      "Case study",
    description:
      project.outcomes ?? fallbackFeaturedProjects[index]?.description ?? "",
    image:
      project.cover_image_url ??
      fallbackFeaturedProjects[index]?.image ??
      fallbackProjectImage,
    metric:
      typeof project.outcomes_metrics === "string"
        ? project.outcomes_metrics
        : (fallbackFeaturedProjects[index]?.metric ?? "Published case study"),
    title: project.title,
  }));
}

async function getHomeJournalEntries() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("cover_image_url, created_at, excerpt, published_at, tags, title")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(fallbackJournalEntries.length);

  if (error || !data?.length) {
    return cloneFallbackJournalEntries();
  }

  return data.map((entry, index) => ({
    category:
      entry.tags?.[0] ?? fallbackJournalEntries[index]?.category ?? "Editorial",
    date: formatPublishedDate(
      entry.published_at ?? entry.created_at,
      fallbackJournalEntries[index]?.date ?? "",
    ),
    excerpt: entry.excerpt ?? fallbackJournalEntries[index]?.excerpt ?? "",
    image:
      entry.cover_image_url ??
      fallbackJournalEntries[index]?.image ??
      fallbackJournalImage,
    title: entry.title,
  }));
}

async function getHomeTestimonials() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("company, featured, name, quote, role, updated_at")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(fallbackTestimonials.length);

  if (error || !data?.length) {
    return cloneFallbackTestimonials();
  }

  return data.map((testimonial, index) => ({
    company:
      testimonial.company ??
      fallbackTestimonials[index]?.company ??
      "Scalzo Studio client",
    name: testimonial.name,
    quote: testimonial.quote,
    role: testimonial.role ?? fallbackTestimonials[index]?.role ?? "Client",
  }));
}

export async function getHomePageContent(): Promise<{
  featuredProjects: FeaturedProject[];
  journalEntries: JournalEntry[];
  serviceGroups: ServiceGroup[];
  testimonials: Testimonial[];
}> {
  const [serviceGroups, featuredProjects, journalEntries, testimonials] =
    await Promise.all([
      getHomeServices(),
      getHomeFeaturedProjects(),
      getHomeJournalEntries(),
      getHomeTestimonials(),
    ]);

  return {
    featuredProjects,
    journalEntries,
    serviceGroups,
    testimonials,
  };
}
