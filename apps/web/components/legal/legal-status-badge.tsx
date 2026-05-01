import type { LegalStatus } from "@/interfaces/legal/content";
import { cn } from "@/lib/utils";

export function LegalStatusBadge({ status }: { status: LegalStatus }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em]",
        status === "Live"
          ? "bg-[#111311] text-white"
          : "border border-border/70 bg-white text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}
