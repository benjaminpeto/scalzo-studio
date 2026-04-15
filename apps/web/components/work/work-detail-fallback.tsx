import { getFallbackWorkDetailPageData } from "@/actions/work/helpers";
import { Grid } from "@ui/components/layout/grid";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";

export default function WorkDetailFallback({ slug }: { slug: string }) {
  const detailPageData = getFallbackWorkDetailPageData(slug);
  const [leadVisual, ...secondaryVisuals] = detailPageData.visuals;

  return (
    <>
      <Section spacing="tight" className="overflow-hidden pb-14 lg:pb-18">
        <Grid gap="2xl" className="lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
          <Stack gap="lg">
            <div className="h-4 w-24 rounded-full bg-black/8" />
            <div className="h-4 w-36 rounded-full bg-black/6" />
            <div className="space-y-3">
              <div className="h-16 max-w-4xl rounded-[1.6rem] bg-black/8 sm:h-20 lg:h-24" />
              <div className="h-16 max-w-3xl rounded-[1.6rem] bg-black/6 sm:h-20 lg:h-24" />
            </div>
            <div className="space-y-3">
              <div className="h-4 max-w-2xl rounded-full bg-black/7" />
              <div className="h-4 max-w-xl rounded-full bg-black/5" />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {detailPageData.services.map((service) => (
                <div
                  key={service}
                  className="h-7 w-24 rounded-full bg-black/6"
                />
              ))}
            </div>
          </Stack>

          <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/80 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
            <div className="h-4 w-28 rounded-full bg-black/8" />
            <div className="mt-5 h-10 w-40 rounded-[1rem] bg-black/8" />
            <div className="mt-6 grid gap-5 border-t border-border/70 pt-5 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="h-4 w-16 rounded-full bg-black/6" />
                <div className="h-4 w-28 rounded-full bg-black/5" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-20 rounded-full bg-black/6" />
                <div className="h-4 w-36 rounded-full bg-black/5" />
              </div>
            </div>
          </div>
        </Grid>
      </Section>

      <Section spacing="tight">
        <Grid cols="two" gap="md">
          {["Challenge", "Approach"].map((label) => (
            <article
              key={label}
              className="rounded-[1.8rem] bg-white p-6 shadow-[0_16px_44px_rgba(27,28,26,0.05)] ring-1 ring-black/4 sm:p-7"
            >
              <div className="h-4 w-24 rounded-full bg-black/6" />
              <div className="mt-4 h-10 w-72 rounded-[1rem] bg-black/8" />
              <div className="mt-5 space-y-3">
                <div className="h-4 rounded-full bg-black/7" />
                <div className="h-4 max-w-[90%] rounded-full bg-black/5" />
                <div className="h-4 max-w-[82%] rounded-full bg-black/4" />
              </div>
            </article>
          ))}
        </Grid>
      </Section>

      <Section spacing="tight">
        <Grid gap="2xl" className="lg:grid-cols-[0.36fr_0.64fr] lg:items-start">
          <div className="space-y-3">
            <div className="h-4 w-24 rounded-full bg-black/8" />
            <div className="h-12 w-80 rounded-[1rem] bg-black/8 sm:h-14 lg:h-16" />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-4 rounded-full bg-black/7" />
              <div className="h-4 max-w-[92%] rounded-full bg-black/5" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {detailPageData.metrics.map((metric) => (
                <article
                  key={metric.label}
                  className="rounded-[1.5rem] border border-border/70 bg-white px-5 py-5 shadow-[0_12px_34px_rgba(27,28,26,0.04)]"
                >
                  <div className="h-4 w-20 rounded-full bg-black/6" />
                  <div className="mt-4 h-8 w-24 rounded-[0.9rem] bg-black/8" />
                </article>
              ))}
            </div>
          </div>
        </Grid>
      </Section>

      <Section spacing="tight" surface="inverse">
        <Stack gap="xl">
          <Grid gap="xl" className="lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
            <div className="space-y-3">
              <div className="h-4 w-20 rounded-full bg-white/12" />
              <div className="h-12 w-72 rounded-[1rem] bg-white/12 sm:h-14 lg:h-16" />
            </div>
            <div className="space-y-3">
              <div className="h-4 rounded-full bg-white/12" />
              <div className="h-4 max-w-[90%] rounded-full bg-white/10" />
            </div>
          </Grid>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            {leadVisual ? (
              <div className="overflow-hidden rounded-[1.9rem] bg-white/8 ring-1 ring-white/12">
                <div className="aspect-[1.18] w-full bg-white/10" />
              </div>
            ) : null}

            <div className="grid gap-5">
              {secondaryVisuals.map((visual) => (
                <div
                  key={visual.src}
                  className="overflow-hidden rounded-[1.9rem] bg-white/8 ring-1 ring-white/12"
                >
                  <div className="aspect-[1.2] w-full bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </Stack>
      </Section>

      <Section spacing="tight">
        <Grid gap="2xl" className="lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
          <div className="space-y-3">
            <div className="h-4 w-24 rounded-full bg-black/8" />
            <div className="h-12 w-80 rounded-[1rem] bg-black/8 sm:h-14 lg:h-16" />
          </div>

          <div className="rounded-[1.9rem] bg-white/85 p-6 shadow-[0_16px_44px_rgba(27,28,26,0.04)] ring-1 ring-black/4">
            <div className="space-y-3">
              <div className="h-4 rounded-full bg-black/7" />
              <div className="h-4 max-w-[90%] rounded-full bg-black/5" />
              <div className="h-4 max-w-[78%] rounded-full bg-black/4" />
            </div>
          </div>
        </Grid>
      </Section>
    </>
  );
}
