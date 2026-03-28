"use client";

import { useFormStatus } from "react-dom";

import type { AdminSubmitButtonProps } from "@/interfaces/admin/component-props";
import { Button } from "@ui/components/ui/button";

export function AdminSubmitButton({
  createLabel,
  mode,
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="min-w-32 rounded-full px-6"
      disabled={pending}
    >
      {pending
        ? mode === "create"
          ? "Creating..."
          : "Saving..."
        : mode === "create"
          ? createLabel
          : "Save changes"}
    </Button>
  );
}
