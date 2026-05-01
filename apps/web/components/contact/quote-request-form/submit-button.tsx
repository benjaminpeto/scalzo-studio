import { ArrowRight } from "lucide-react";

import type { QuoteRequestSubmitButtonProps } from "@/interfaces/contact/component-props";
import { Button } from "@ui/components/ui/button";

export function QuoteRequestSubmitButton({
  disabled,
  label,
}: QuoteRequestSubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled}
      className="h-12 rounded-full bg-foreground px-6 text-[0.78rem] uppercase tracking-[0.2em] text-background hover:bg-primary"
    >
      {label}
      <ArrowRight aria-hidden="true" className="size-4" />
    </Button>
  );
}
