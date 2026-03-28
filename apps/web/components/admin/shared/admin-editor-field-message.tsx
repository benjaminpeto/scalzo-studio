import type { AdminEditorFieldMessageProps } from "@/interfaces/admin/component-props";

export function AdminEditorFieldMessage({
  error,
  id,
}: AdminEditorFieldMessageProps) {
  if (!error) {
    return null;
  }

  return (
    <p id={id} className="text-sm text-destructive" role="alert">
      {error}
    </p>
  );
}
