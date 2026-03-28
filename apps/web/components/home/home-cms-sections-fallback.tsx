export function HomeCmsSectionsFallback() {
  return (
    <>
      <section id="projects" className="anchor-offset py-20 lg:py-28">
        <div className="mx-auto w-full max-w-475 px-6 sm:px-8 lg:px-12 2xl:px-16">
          <div className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-[0.24fr_0.52fr_0.24fr] lg:items-end">
              <div className="h-4 w-28 rounded-full bg-black/8" />
              <div className="space-y-3">
                <div className="h-16 max-w-md rounded-[1.3rem] bg-black/8 sm:h-20 lg:h-24" />
                <div className="h-4 max-w-xs rounded-full bg-black/6" />
              </div>
              <div className="space-y-3 lg:justify-self-end">
                <div className="h-4 w-40 rounded-full bg-black/7" />
                <div className="h-4 w-52 rounded-full bg-black/5" />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[1.7rem] bg-white shadow-[0_8px_26px_rgba(27,28,26,0.04)] ring-1 ring-black/4"
                >
                  <div className="aspect-[1.08] w-full bg-black/6" />
                  <div className="space-y-3 px-5 py-4 sm:px-6">
                    <div className="h-8 w-48 rounded-[0.9rem] bg-black/8" />
                    <div className="h-4 w-40 rounded-full bg-black/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="section-shell anchor-offset py-20 lg:py-28"
        id="services"
      >
        <div className="space-y-8">
          <div className="space-y-3 text-center">
            <div className="mx-auto h-4 w-28 rounded-full bg-black/8" />
            <div className="mx-auto h-12 max-w-xl rounded-[1rem] bg-black/8 sm:h-14 lg:h-16" />
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[1.7rem] bg-white p-6 shadow-[0_10px_26px_rgba(27,28,26,0.04)] ring-1 ring-black/4"
              >
                <div className="h-4 w-10 rounded-full bg-black/6" />
                <div className="mt-5 h-8 w-40 rounded-[0.9rem] bg-black/8" />
                <div className="mt-5 space-y-3">
                  <div className="h-4 rounded-full bg-black/7" />
                  <div className="h-4 max-w-[82%] rounded-full bg-black/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section-shell anchor-offset py-20 lg:py-28"
        id="journal"
      >
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="h-12 w-72 rounded-[1rem] bg-black/8 sm:h-14 lg:h-16" />
            <div className="h-4 w-64 rounded-full bg-black/6" />
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.55fr_0.55fr]">
            <div className="overflow-hidden rounded-[1.85rem] bg-[#111311]">
              <div className="aspect-[1.25] w-full bg-white/8" />
              <div className="space-y-4 p-7 sm:p-8">
                <div className="h-4 w-28 rounded-full bg-white/14" />
                <div className="h-9 max-w-md rounded-[0.9rem] bg-white/14" />
                <div className="h-4 max-w-xl rounded-full bg-white/10" />
              </div>
            </div>

            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="flex h-full flex-col rounded-[1.85rem] bg-white p-4 shadow-[0_10px_30px_rgba(27,28,26,0.05)] ring-1 ring-black/4 sm:p-5"
              >
                <div className="aspect-square w-full rounded-[1.1rem] bg-black/6" />
                <div className="mt-6 h-4 w-24 rounded-full bg-black/7" />
                <div className="mt-4 h-8 w-40 rounded-[0.9rem] bg-black/8" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="anchor-offset py-20 lg:py-28">
        <div className="mx-auto w-full max-w-475 px-6 sm:px-8 lg:px-12 2xl:px-16">
          <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr] lg:gap-12">
            <div className="space-y-3">
              <div className="h-4 w-28 rounded-full bg-black/8" />
              <div className="h-14 max-w-md rounded-[1.2rem] bg-black/8 sm:h-16 lg:h-20" />
              <div className="h-4 max-w-sm rounded-full bg-black/6" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[1.7rem] bg-white p-6 shadow-[0_10px_26px_rgba(27,28,26,0.04)] ring-1 ring-black/4"
                >
                  <div className="space-y-3">
                    <div className="h-4 rounded-full bg-black/7" />
                    <div className="h-4 max-w-[92%] rounded-full bg-black/5" />
                    <div className="h-4 max-w-[70%] rounded-full bg-black/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
