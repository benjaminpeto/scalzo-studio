import { Check } from "lucide-react";

import type { QuoteRequestStepButtonProps } from "@/interfaces/contact/component-props";

export function QuoteRequestStepButton({
  isActive,
  isComplete,
  onClick,
  step,
  title,
}: QuoteRequestStepButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-0 items-center gap-3 rounded-[1.2rem] border px-3 py-3 text-left transition-colors sm:px-4 ${
        isActive
          ? "border-foreground bg-white"
          : isComplete
            ? "border-border/70 bg-white/85"
            : "border-transparent bg-[rgba(27,28,26,0.04)]"
      }`}
    >
      <span
        className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold uppercase tracking-[0.14em] ${
          isActive || isComplete
            ? "bg-primary text-primary-foreground"
            : "bg-white text-muted-foreground"
        }`}
      >
        {isComplete ? <Check className="size-4" aria-hidden="true" /> : step}
      </span>
      <span className="min-w-0">
        <span className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Step
        </span>
        <span className="mt-1 block truncate text-sm font-semibold text-foreground">
          {title}
        </span>
      </span>
    </button>
  );
}
