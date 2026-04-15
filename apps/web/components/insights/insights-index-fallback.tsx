import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";
import { Grid } from "@ui/components/layout/grid";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";

export function InsightsIndexFallback({
  selectedTag,
}: {
  selectedTag: string | null;
}) {
  return (
    <>
      <Section spacing="tight" className="overflow-hidden pb-14 lg:pb-18">
        <Grid gap="2xl" className="lg:grid-cols-[0.6fr_0.4fr] lg:items-end">
          <Stack gap="lg">
            <div className="h-4 w-24 rounded-full bg-black/8" />
            <div className="space-y-3">
              <div className="h-16 max-w-4xl rounded-[1.6rem] bg-black/8 sm:h-20 lg:h-24" />
              <div className="h-16 max-w-3xl rounded-[1.6rem] bg-black/6 sm:h-20 lg:h-24" />
            </div>
            <div className="space-y-3">
              <div className="h-4 max-w-2xl rounded-full bg-black/7" />
              <div className="h-4 max-w-xl rounded-full bg-black/5" />
            </div>
          </Stack>

          <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/80 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
            <div className="h-4 w-32 rounded-full bg-black/8" />
            <div className="mt-6 flex flex-wrap gap-2">
              <div className="h-9 w-24 rounded-full bg-black/8" />
              <div className="h-9 w-28 rounded-full bg-black/6" />
              <div className="h-9 w-32 rounded-full bg-black/5" />
            </div>
            <div className="mt-6 space-y-3 border-t border-border/70 pt-5">
              <div className="h-4 rounded-full bg-black/7" />
              <div className="h-4 max-w-[85%] rounded-full bg-black/5" />
            </div>
          </div>
        </Grid>
      </Section>

      <Section spacing="tight">
        <Stack gap="xl">
          <Grid gap="xl" className="lg:grid-cols-[0.32fr_0.68fr] lg:items-end">
            <div className="space-y-3">
              <div className="h-12 w-56 rounded-[1rem] bg-black/8 sm:h-14 lg:h-16" />
            </div>
            <div className="space-y-3">
              <div className="h-4 max-w-xl rounded-full bg-black/7" />
              <div className="h-4 max-w-lg rounded-full bg-black/5" />
            </div>
          </Grid>

          <div className="overflow-hidden rounded-[1.85rem] bg-[#111311]">
            <div className="aspect-[1.5] w-full bg-white/8" />
            <div className="space-y-4 p-7 sm:p-8">
              <div className="h-4 w-40 rounded-full bg-white/14" />
              <div className="h-10 max-w-3xl rounded-[1rem] bg-white/14" />
              <div className="h-10 max-w-2xl rounded-[1rem] bg-white/10" />
              <div className="h-4 max-w-2xl rounded-full bg-white/12" />
            </div>
          </div>
        </Stack>
      </Section>

      <Section id="insight-list" spacing="tight">
        <Stack gap="xl">
          <Grid gap="xl" className="lg:grid-cols-[0.32fr_0.68fr] lg:items-end">
            <div className="space-y-3">
              <div className="h-12 w-44 rounded-[1rem] bg-black/8 sm:h-14 lg:h-16" />
            </div>
            <div className="space-y-3">
              <div className="h-4 max-w-xl rounded-full bg-black/7" />
              <div className="h-4 max-w-lg rounded-full bg-black/5" />
            </div>
          </Grid>

          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: selectedTag ? 2 : 4 }).map((_, index) => (
              <article
                key={index}
                className="flex h-full flex-col rounded-[1.85rem] bg-white p-4 shadow-[0_10px_30px_rgba(27,28,26,0.05)] ring-1 ring-black/4 sm:p-5"
              >
                <div className="aspect-square w-full rounded-[1.1rem] bg-black/6" />
                <div className="mt-6 h-4 w-32 rounded-full bg-black/8" />
                <div className="mt-4 space-y-3">
                  <div className="h-8 rounded-[0.9rem] bg-black/8" />
                  <div className="h-8 max-w-[80%] rounded-[0.9rem] bg-black/6" />
                </div>
                <div className="mt-4 space-y-3">
                  <div className="h-4 rounded-full bg-black/7" />
                  <div className="h-4 max-w-[88%] rounded-full bg-black/5" />
                </div>
                <div className="mt-auto pt-6">
                  <div className="h-4 w-28 rounded-full bg-black/8" />
                </div>
              </article>
            ))}
          </div>
        </Stack>
      </Section>

      <NewsletterSignup placement="insights-index" />
    </>
  );
}
