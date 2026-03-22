import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const stackVariants = cva("flex flex-col", {
  variants: {
    gap: {
      xs: "gap-2",
      sm: "gap-3",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
      "2xl": "gap-12",
    },
    align: {
      start: "items-start",
      center: "items-center",
      stretch: "items-stretch",
    },
  },
  defaultVariants: {
    gap: "lg",
    align: "stretch",
  },
});

export interface StackProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {}

export function Stack({ align, className, gap, ...props }: StackProps) {
  return (
    <div className={cn(stackVariants({ align, gap }), className)} {...props} />
  );
}
