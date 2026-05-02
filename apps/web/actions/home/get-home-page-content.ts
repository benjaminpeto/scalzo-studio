"use server";

import "server-only";

import type { Locale } from "@/lib/i18n/routing";

import { getHomeFeaturedProjects } from "./get-home-featured-projects";
import { getHomeJournalEntries } from "./get-home-journal-entries";
import { getHomeServices } from "./get-home-services";
import { getHomeTestimonials } from "./get-home-testimonials";

export async function getHomePageContent(locale: Locale = "en") {
  const [serviceGroups, featuredProjects, journalEntries, testimonials] =
    await Promise.all([
      getHomeServices(),
      getHomeFeaturedProjects(),
      getHomeJournalEntries(),
      getHomeTestimonials(locale),
    ]);

  return {
    featuredProjects,
    journalEntries,
    serviceGroups,
    testimonials,
  };
}
