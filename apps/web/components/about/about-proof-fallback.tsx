export function AboutProofFallback() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <article
          key={index}
          className="rounded-[1.7rem] bg-white p-6 shadow-[0_10px_30px_rgba(27,28,26,0.05)] ring-1 ring-black/4 sm:p-7"
        >
          <div className="space-y-3">
            <div className="h-8 w-40 rounded-[0.9rem] bg-black/8" />
            <div className="h-4 rounded-full bg-black/7" />
            <div className="h-4 max-w-[92%] rounded-full bg-black/5" />
            <div className="h-4 max-w-[70%] rounded-full bg-black/4" />
          </div>
          <div className="mt-7 border-t border-border/70 pt-5">
            <div className="h-4 w-28 rounded-full bg-black/7" />
            <div className="mt-2 h-4 w-44 rounded-full bg-black/5" />
          </div>
        </article>
      ))}
    </div>
  );
}
