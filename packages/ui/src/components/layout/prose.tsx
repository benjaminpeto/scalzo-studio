import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const proseVariants = cva("", {
  variants: {
    size: {
      sm: "text-sm leading-6",
      md: "text-base leading-7",
      lg: "text-base leading-8 sm:text-lg",
    },
    tone: {
      default: "text-muted-foreground",
      strong: "text-foreground",
      inverse: "text-white/72",
    },
    measure: {
      auto: "",
      sm: "max-w-sm",
      md: "max-w-xl",
      lg: "max-w-2xl",
      xl: "max-w-3xl",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "default",
    measure: "auto",
  },
});

export interface ProseProps
  extends
    React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof proseVariants> {}

export function Prose({
  className,
  measure,
  size,
  tone,
  ...props
}: ProseProps) {
  return (
    <p
      className={cn(proseVariants({ measure, size, tone }), className)}
      {...props}
    />
  );
}
