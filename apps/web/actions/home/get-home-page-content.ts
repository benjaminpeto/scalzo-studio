import "server-only";

import { getHomeFeaturedProjects } from "./get-home-featured-projects";
import { getHomeJournalEntries } from "./get-home-journal-entries";
import { getHomeServices } from "./get-home-services";
import { getHomeTestimonials } from "./get-home-testimonials";

export async function getHomePageContent() {
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
