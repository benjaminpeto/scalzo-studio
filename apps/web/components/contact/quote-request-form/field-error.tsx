import type { FieldErrorProps } from "@/interfaces/contact/component-props";

export function FieldError({ message }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return <p className="mt-3 text-sm text-destructive">{message}</p>;
}
