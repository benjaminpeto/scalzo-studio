import { getFallbackInsightDetailPageData } from "@/actions/insights/helpers";
import { Grid } from "@ui/components/layout/grid";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";

export default function InsightDetailFallback({ slug }: { slug: string }) {
  const detailPageData = getFallbackInsightDetailPageData(slug);

  return (
    <>
      <Section spacing="tight" className="overflow-hidden pb-14 lg:pb-18">
        <Grid gap="2xl" className="lg:grid-cols-[0.55fr_0.45fr] lg:items-end">
          <Stack gap="lg">
            <div className="h-4 w-28 rounded-full bg-black/8" />
            <div className="h-4 w-48 rounded-full bg-black/6" />
            <div className="space-y-3">
              <div className="h-16 max-w-4xl rounded-[1.6rem] bg-black/8 sm:h-20 lg:h-24" />
              <div className="h-16 max-w-3xl rounded-[1.6rem] bg-black/6 sm:h-20 lg:h-24" />
            </div>
            <div className="space-y-3">
              <div className="h-4 max-w-2xl rounded-full bg-black/7" />
              <div className="h-4 max-w-xl rounded-full bg-black/5" />
            </div>
            <div className="h-4 w-56 rounded-full bg-black/6" />
          </Stack>

          <div className="overflow-hidden rounded-4xl border border-border/70 bg-[rgba(250,248,241,0.72)] p-3 shadow-[0_20px_60px_rgba(27,28,26,0.08)]">
            <div className="aspect-[1.1] w-full rounded-[1.35rem] bg-black/6" />
          </div>
        </Grid>
      </Section>

      <Section spacing="tight" className="pb-24">
        <Grid gap="2xl" className="lg:grid-cols-[0.31fr_0.69fr] lg:items-start">
          <aside className="space-y-6 lg:sticky lg:top-28">
            <div className="surface-grain rounded-[1.8rem] border border-border/70 bg-white/80 p-6 shadow-[0_16px_44px_rgba(27,28,26,0.05)]">
              <div className="h-4 w-16 rounded-full bg-black/8" />
              <div className="mt-5 flex flex-wrap gap-2">
                <div className="h-9 w-24 rounded-full bg-black/8" />
                <div className="h-9 w-16 rounded-full bg-black/6" />
                <div className="h-9 w-20 rounded-full bg-black/5" />
              </div>
            </div>

            {detailPageData.headings.length ? (
              <div className="surface-grain rounded-[1.8rem] border border-border/70 bg-white/80 p-6 shadow-[0_16px_44px_rgba(27,28,26,0.05)]">
                <div className="h-4 w-24 rounded-full bg-black/8" />
                <div className="mt-5 space-y-3">
                  {detailPageData.headings.map((heading) => (
                    <div
                      key={heading.id}
                      className="h-4 rounded-full bg-black/6"
                      style={{
                        width: `${Math.min(88, 34 + heading.text.length)}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </aside>

          <div className="space-y-10">
            <div className="space-y-4 rounded-[1.9rem] border border-border/70 bg-white/75 p-7 shadow-[0_16px_44px_rgba(27,28,26,0.04)]">
              <div className="h-4 w-40 rounded-full bg-black/7" />
              <div className="h-4 rounded-full bg-black/6" />
              <div className="h-4 max-w-[94%] rounded-full bg-black/5" />
              <div className="h-4 max-w-[90%] rounded-full bg-black/5" />
              <div className="h-4 max-w-[82%] rounded-full bg-black/4" />
            </div>

            <div className="space-y-4 rounded-[1.9rem] border border-border/70 bg-white/75 p-7 shadow-[0_16px_44px_rgba(27,28,26,0.04)]">
              <div className="h-4 w-44 rounded-full bg-black/7" />
              <div className="h-4 rounded-full bg-black/6" />
              <div className="h-4 max-w-[92%] rounded-full bg-black/5" />
              <div className="h-4 max-w-[86%] rounded-full bg-black/4" />
            </div>

            <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/85 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
              <div className="h-4 w-24 rounded-full bg-black/8" />
              <div className="mt-5 h-10 max-w-2xl rounded-[1rem] bg-black/8" />
              <div className="mt-5 space-y-3">
                <div className="h-4 rounded-full bg-black/7" />
                <div className="h-4 max-w-[88%] rounded-full bg-black/5" />
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <div className="h-11 w-40 rounded-full bg-black/8" />
                <div className="h-11 w-36 rounded-full bg-black/5" />
              </div>
            </div>
          </div>
        </Grid>
      </Section>
    </>
  );
}
