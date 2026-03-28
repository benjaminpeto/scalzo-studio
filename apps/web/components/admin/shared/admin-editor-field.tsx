import type { AdminEditorFieldProps } from "@/interfaces/admin/component-props";
import { Label } from "@ui/components/ui/label";

import { AdminEditorFieldMessage } from "./admin-editor-field-message";

export function AdminEditorField({
  children,
  error,
  hint,
  htmlFor,
  label,
  optionalLabel,
}: AdminEditorFieldProps) {
  const messageId = htmlFor ? `${htmlFor}-message` : undefined;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <Label
          htmlFor={htmlFor}
          className="text-sm font-semibold text-foreground"
        >
          {label}
        </Label>
        {optionalLabel ? (
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {optionalLabel}
          </span>
        ) : null}
      </div>
      {children}
      {messageId ? (
        <AdminEditorFieldMessage error={error} id={messageId} />
      ) : null}
      {!error && hint && messageId ? (
        <p id={messageId} className="text-sm leading-6 text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
