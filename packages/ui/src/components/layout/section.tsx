import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
import { Container, type ContainerProps } from "./container";

const sectionVariants = cva("anchor-offset", {
  variants: {
    spacing: {
      default: "py-20 lg:py-28",
      tight: "py-16 lg:py-20",
      roomy: "py-24 lg:py-32",
      none: "",
    },
    surface: {
      default: "",
      muted: "surface-section",
      inverse: "bg-[#0d0f0c] text-white",
    },
  },
  defaultVariants: {
    spacing: "default",
    surface: "default",
  },
});

export interface SectionProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: "section" | "div" | "article" | "header" | "footer";
  containerClassName?: string;
  containerSize?: ContainerProps["size"];
}

export function Section({
  as: Comp = "section",
  children,
  className,
  containerClassName,
  containerSize,
  spacing,
  surface,
  ...props
}: SectionProps) {
  return (
    <Comp
      className={cn(sectionVariants({ spacing, surface }), className)}
      {...props}
    >
      <Container size={containerSize} className={containerClassName}>
        {children}
      </Container>
    </Comp>
  );
}
