import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[0.375rem] text-sm font-semibold tracking-[0.02em] transition-[transform,background-color,color,box-shadow] duration-[420ms] ease-[cubic-bezier(0.2,0,0,1)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_24px_56px_rgba(27,28,26,0.06)] hover:-translate-y-px hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_24px_48px_rgba(27,28,26,0.08)] hover:-translate-y-px hover:bg-destructive/90",
        outline:
          "bg-surface-container-highest text-foreground shadow-[inset_0_0_0_1px_rgba(127,118,95,0.15)] hover:bg-card",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_18px_42px_rgba(27,28,26,0.04)] hover:-translate-y-px hover:bg-secondary/85",
        ghost: "text-foreground hover:bg-muted",
        link: "text-foreground underline decoration-editorial-underline underline-offset-4 hover:text-foreground/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
