import { getFallbackServiceDetailPageData } from "@/actions/services/helpers";
import { Grid } from "@ui/components/layout/grid";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";

export default function ServiceDetailFallback({ slug }: { slug: string }) {
  const detailPageData = getFallbackServiceDetailPageData(slug);

  return (
    <>
      <Section spacing="tight" className="overflow-hidden pb-14 lg:pb-18">
        <Grid gap="2xl" className="lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
          <Stack gap="lg">
            <div className="h-4 w-28 rounded-full bg-black/8" />
            <div className="h-4 w-44 rounded-full bg-black/6" />
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
            <div className="h-4 w-36 rounded-full bg-black/8" />
            <div className="mt-5 h-10 w-48 rounded-[1rem] bg-black/8" />
            <div className="mt-6 border-t border-border/70 pt-5">
              <div className="h-4 w-52 rounded-full bg-black/6" />
            </div>
          </div>
        </Grid>
      </Section>

      <Section spacing="tight">
        <Grid gap="2xl" className="lg:grid-cols-[0.38fr_0.62fr] lg:items-start">
          <Stack gap="sm">
            <div className="h-4 w-32 rounded-full bg-black/8" />
            <div className="h-12 w-72 rounded-[1rem] bg-black/8 sm:h-14 lg:h-16" />
          </Stack>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-4 rounded-full bg-black/6"
                style={{ width: `${100 - index * 6}%` }}
              />
            ))}
          </div>
        </Grid>
      </Section>

      <Section spacing="tight">
        <Grid gap="xl" className="lg:grid-cols-[0.36fr_0.64fr] lg:items-start">
          <Stack gap="sm">
            <div className="h-4 w-28 rounded-full bg-black/8" />
            <div className="h-12 w-80 rounded-[1rem] bg-black/8 sm:h-14 lg:h-16" />
          </Stack>

          <article className="rounded-[1.8rem] bg-white p-6 shadow-[0_16px_44px_rgba(27,28,26,0.05)] ring-1 ring-black/4">
            <div className="h-4 w-32 rounded-full bg-black/6" />
            <div className="mt-3 h-8 w-44 rounded-[0.9rem] bg-black/8" />
            <div className="mt-5 space-y-3">
              {detailPageData.deliverables.map((item) => (
                <div
                  key={item}
                  className="h-4 rounded-full bg-black/6"
                  style={{ width: `${Math.min(92, 40 + item.length)}%` }}
                />
              ))}
            </div>
          </article>
        </Grid>
      </Section>

      <Section spacing="tight" surface="inverse">
        <Stack gap="xl">
          <Grid gap="xl" className="lg:grid-cols-[0.4fr_0.6fr] lg:items-end">
            <div className="space-y-3">
              <div className="h-4 w-40 rounded-full bg-white/12" />
              <div className="h-12 w-80 rounded-[1rem] bg-white/12 sm:h-14 lg:h-16" />
            </div>
            <div className="space-y-3">
              <div className="h-4 rounded-full bg-white/12" />
              <div className="h-4 max-w-[86%] rounded-full bg-white/10" />
            </div>
          </Grid>

          <Grid cols="three" gap="md">
            {detailPageData.timeline.map((step) => (
              <article
                key={step.step}
                className="rounded-[1.8rem] bg-white p-6 text-foreground shadow-[0_16px_44px_rgba(0,0,0,0.16)]"
              >
                <div className="h-4 w-16 rounded-full bg-black/6" />
                <div className="mt-8 h-8 w-40 rounded-[0.9rem] bg-black/8" />
                <div className="mt-5 space-y-3">
                  <div className="h-4 rounded-full bg-black/6" />
                  <div className="h-4 max-w-[84%] rounded-full bg-black/5" />
                </div>
              </article>
            ))}
          </Grid>
        </Stack>
      </Section>

      <Section spacing="tight">
        <Stack gap="xl">
          <Grid gap="xl" className="lg:grid-cols-[0.34fr_0.66fr] lg:items-end">
            <div className="space-y-3">
              <div className="h-4 w-28 rounded-full bg-black/8" />
              <div className="h-12 w-80 rounded-[1rem] bg-black/8 sm:h-14 lg:h-16" />
            </div>
            <div className="space-y-3">
              <div className="h-4 rounded-full bg-black/7" />
              <div className="h-4 max-w-[88%] rounded-full bg-black/5" />
            </div>
          </Grid>

          <div className="grid gap-5 lg:grid-cols-2">
            {detailPageData.relatedWork.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-[1.7rem] bg-white shadow-[0_8px_26px_rgba(27,28,26,0.04)] ring-1 ring-black/4"
              >
                <div className="aspect-[1.08] w-full bg-black/6" />
                <div className="space-y-3 px-5 py-4 sm:px-6">
                  <div className="h-8 w-44 rounded-[0.9rem] bg-black/8" />
                  <div className="h-4 w-40 rounded-full bg-black/6" />
                </div>
              </article>
            ))}
          </div>
        </Stack>
      </Section>

      <Section id="service-detail-faq">
        <Grid gap="2xl" className="lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <div className="space-y-3">
            <div className="h-16 w-44 rounded-[1.2rem] bg-black/8 sm:h-20" />
            <div className="h-4 max-w-sm rounded-full bg-black/6" />
          </div>

          <div className="space-y-4">
            {detailPageData.faq.map((item) => (
              <div
                key={item.question}
                className="rounded-[1.7rem] bg-white p-6 shadow-[0_10px_26px_rgba(27,28,26,0.04)] ring-1 ring-black/4"
              >
                <div className="h-8 w-full rounded-[0.9rem] bg-black/8" />
              </div>
            ))}
          </div>
        </Grid>
      </Section>
    </>
  );
}
