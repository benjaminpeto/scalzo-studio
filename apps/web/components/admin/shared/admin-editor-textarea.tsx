import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function AdminEditorTextarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "input-shell flex min-h-32 w-full rounded-[1.15rem] border-0 bg-transparent px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}
