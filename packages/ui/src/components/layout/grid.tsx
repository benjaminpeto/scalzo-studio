import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const gridVariants = cva("grid", {
  variants: {
    gap: {
      sm: "gap-3",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
      "2xl": "gap-10",
    },
    cols: {
      auto: "",
      two: "md:grid-cols-2",
      three: "lg:grid-cols-3",
      four: "lg:grid-cols-4",
    },
  },
  defaultVariants: {
    gap: "lg",
    cols: "auto",
  },
});

export interface GridProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

export function Grid({ className, cols, gap, ...props }: GridProps) {
  return (
    <div className={cn(gridVariants({ cols, gap }), className)} {...props} />
  );
}
