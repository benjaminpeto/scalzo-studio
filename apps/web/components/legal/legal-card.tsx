import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function LegalCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "rounded-[1.55rem] border border-border/70 bg-[rgba(255,255,255,0.72)] p-5 shadow-[0_16px_40px_rgba(27,28,26,0.04)]",
        className,
      )}
    >
      {children}
    </article>
  );
}
