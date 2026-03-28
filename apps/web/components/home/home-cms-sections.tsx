import { FeaturedWork } from "@/components/home/featured-work";
import { JournalPreview } from "@/components/home/journal-preview";
import { ServicesPreview } from "@/components/home/services-preview";
import { Testimonials } from "@/components/home/testimonials";
import { getHomePageContent } from "@/actions/home/get-home-page-content";

export async function HomeCmsSections() {
  const homePageContent = await getHomePageContent();

  return (
    <>
      <FeaturedWork projects={homePageContent.featuredProjects} />
      <ServicesPreview services={homePageContent.serviceGroups} />
      <JournalPreview entries={homePageContent.journalEntries} />
      <Testimonials items={homePageContent.testimonials} />
    </>
  );
}
