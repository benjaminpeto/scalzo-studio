import * as React from "react";

import { cn } from "../../lib/utils";

export interface MetricBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  value: React.ReactNode;
  label: React.ReactNode;
  valueClassName?: string;
  labelClassName?: string;
}

export function MetricBlock({
  value,
  label,
  className,
  valueClassName,
  labelClassName,
  ...props
}: MetricBlockProps) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] bg-white px-5 py-6 shadow-[0_10px_24px_rgba(27,28,26,0.04)] ring-1 ring-black/4",
        className,
      )}
      {...props}
    >
      <p
        className={cn(
          "font-display text-[2rem] leading-none tracking-[-0.04em] text-foreground",
          valueClassName,
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          "mt-3 text-sm leading-6 text-muted-foreground",
          labelClassName,
        )}
      >
        {label}
      </p>
    </div>
  );
}
