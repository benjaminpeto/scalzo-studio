import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const containerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      default: "max-w-[1900px] px-6 sm:px-8 lg:px-12 2xl:px-16",
      content: "max-w-7xl px-6 sm:px-8 lg:px-12",
      narrow: "max-w-4xl px-6 sm:px-8 lg:px-12",
      prose: "max-w-3xl px-6 sm:px-8 lg:px-12",
      full: "w-full",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface ContainerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export function Container({ className, size, ...props }: ContainerProps) {
  return (
    <div className={cn(containerVariants({ size }), className)} {...props} />
  );
}
