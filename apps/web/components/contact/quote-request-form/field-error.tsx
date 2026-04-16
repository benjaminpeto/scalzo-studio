import type { FieldErrorProps } from "@/interfaces/contact/component-props";

export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} role="alert" className="mt-3 text-sm text-destructive">
      {message}
    </p>
  );
}
