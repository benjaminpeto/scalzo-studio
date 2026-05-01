import Link from "next/link";

export function InlineArticleCta({ title }: { title: string }) {
  return (
    <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/85 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
      <p className="section-kicker">Next step</p>
      <h2 className="mt-5 max-w-2xl font-display text-[2.4rem] leading-[0.95] tracking-[-0.05em] text-foreground sm:text-[3rem]">
        Want to turn {title.toLowerCase()} into a sharper page decision?
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
        The useful next move is usually not another abstract brainstorm. It is a
        direct review of the current page, the trust gap, and the sequence that
        needs to feel clearer.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          href="/#contact"
          className="inline-flex items-center rounded-full bg-foreground px-5 py-3 text-xs uppercase tracking-[0.18em] text-background transition-colors hover:bg-primary"
        >
          Start a conversation
        </Link>
        <Link
          href="/services"
          className="inline-flex items-center rounded-full border border-border/70 bg-white px-5 py-3 text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:border-foreground"
        >
          Browse services
        </Link>
      </div>
    </div>
  );
}
