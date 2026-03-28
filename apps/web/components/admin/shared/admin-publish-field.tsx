import type { AdminPublishFieldProps } from "@/interfaces/admin/component-props";

export function AdminPublishField({
  copy,
  defaultChecked,
}: AdminPublishFieldProps) {
  return (
    <label className="flex items-start gap-3 rounded-[1.2rem] border border-border/70 bg-surface-container-lowest/88 px-4 py-4">
      <input
        type="checkbox"
        name="published"
        value="true"
        defaultChecked={defaultChecked}
        className="mt-1 size-4 rounded border-border/70 text-foreground accent-[#111311]"
      />
      <span className="space-y-1">
        <span className="block text-sm font-semibold text-foreground">
          Publish on the marketing site
        </span>
        <span className="block text-sm leading-6 text-muted-foreground">
          {copy}
        </span>
      </span>
    </label>
  );
}
