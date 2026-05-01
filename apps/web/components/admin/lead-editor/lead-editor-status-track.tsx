import { LEAD_STATUSES } from "@/actions/admin/leads/schemas";
import { getStepState, PIPELINE_STEPS } from "@/lib/helpers";

export function LeadEditorStatusTrack({
  currentStatus,
}: {
  currentStatus: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {PIPELINE_STEPS.map((step, index) => {
        const state = getStepState(step, currentStatus);
        const isLast = index === PIPELINE_STEPS.length - 1;

        return (
          <div key={step} className="flex items-center gap-2">
            <span
              className={[
                "inline-flex rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em]",
                state === "current"
                  ? "bg-[#111311] text-white"
                  : state === "past"
                    ? "border border-border/70 bg-white/60 text-muted-foreground line-through"
                    : "border border-border/40 bg-white/30 text-muted-foreground/60",
              ].join(" ")}
            >
              {step}
            </span>
            {isLast ? null : (
              <span className="text-xs text-muted-foreground/40">→</span>
            )}
          </div>
        );
      })}

      {/* Terminal branch */}
      <span className="text-xs text-muted-foreground/40">→</span>
      <div className="flex flex-wrap gap-2">
        {(["won", "lost"] as const).map((terminal) => (
          <span
            key={terminal}
            className={[
              "inline-flex rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em]",
              currentStatus === terminal
                ? terminal === "won"
                  ? "bg-emerald-700 text-white"
                  : "bg-destructive text-white"
                : "border border-border/40 bg-white/30 text-muted-foreground/60",
            ].join(" ")}
          >
            {terminal}
          </span>
        ))}
      </div>

      {!LEAD_STATUSES.includes(
        currentStatus as (typeof LEAD_STATUSES)[number],
      ) ? (
        <span className="inline-flex rounded-full border border-border/70 bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {currentStatus}
        </span>
      ) : null}
    </div>
  );
}
