import { FeaturedWork } from "@/components/home/featured-work";
import { JournalPreview } from "@/components/home/journal-preview";
import { ServicesPreview } from "@/components/home/services-preview";
import { Testimonials } from "@/components/home/testimonials";
import { getHomePageContent } from "@/actions/home/get-home-page-content";
import type { Locale } from "@/lib/i18n/routing";

export async function HomeCmsSections({ locale }: { locale: string }) {
  const homePageContent = await getHomePageContent(locale as Locale);

  return (
    <>
      <FeaturedWork
        locale={locale}
        projects={homePageContent.featuredProjects}
      />
      <ServicesPreview
        locale={locale}
        services={homePageContent.serviceGroups}
      />
      <JournalPreview
        locale={locale}
        entries={homePageContent.journalEntries}
      />
      <Testimonials locale={locale} items={homePageContent.testimonials} />
    </>
  );
}
