"use client";

import {
  type KeyboardEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bold,
  Code,
  Heading2,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  Quote,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { MarkdownEditorProps } from "@/interfaces/admin/overview-dashboard";
import { ToolbarButton } from "./markdown-editor-toolbar-button";
import {
  applyWrap,
  applyLink,
  applyLinePrefix,
  applyBlock,
} from "./markdown-editor.helpers";

export function MarkdownEditor({
  id,
  name,
  value,
  defaultValue,
  onChange,
  textareaRef,
  className,
  placeholder,
  required,
  spellCheck,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: MarkdownEditorProps) {
  const [internalValue, setInternalValue] = useState(
    value ?? defaultValue ?? "",
  );
  const localRef = useRef<HTMLTextAreaElement>(null);
  const ref = (textareaRef ?? localRef) as RefObject<HTMLTextAreaElement>;

  // Keep internal state in sync when parent drives value (controlled mode)
  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value);
    }
    // internalValue intentionally excluded — only sync on external value change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const update = useCallback(
    (next: string) => {
      setInternalValue(next);
      onChange?.(next);
    },
    [onChange],
  );

  const withTextarea = useCallback(
    (fn: (ta: HTMLTextAreaElement) => void) => {
      if (ref.current) fn(ref.current);
    },
    [ref],
  );

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (!(e.metaKey || e.ctrlKey)) return;
    const ta = e.currentTarget;

    switch (e.key) {
      case "b":
        e.preventDefault();
        applyWrap(ta, "**", "**", "bold text", update);
        break;
      case "i":
        e.preventDefault();
        applyWrap(ta, "_", "_", "italic text", update);
        break;
      case "e":
        e.preventDefault();
        applyWrap(ta, "`", "`", "code", update);
        break;
      case "k":
        e.preventDefault();
        applyLink(ta, update);
        break;
    }
  }

  return (
    <div>
      <div className="input-shell flex flex-wrap items-center gap-0.5 rounded-t-[1.15rem] rounded-b-none border-b border-border/40 px-2 py-1.5">
        <ToolbarButton
          label="Bold (Cmd+B)"
          onClick={() =>
            withTextarea((ta) => applyWrap(ta, "**", "**", "bold text", update))
          }
        >
          <Bold className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic (Cmd+I)"
          onClick={() =>
            withTextarea((ta) => applyWrap(ta, "_", "_", "italic text", update))
          }
        >
          <Italic className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Inline code (Cmd+E)"
          onClick={() =>
            withTextarea((ta) => applyWrap(ta, "`", "`", "code", update))
          }
        >
          <Code className="size-3.5" />
        </ToolbarButton>

        <span className="mx-1 h-4 w-px bg-border/60" aria-hidden />

        <ToolbarButton
          label="Heading"
          onClick={() =>
            withTextarea((ta) => applyLinePrefix(ta, "## ", update))
          }
        >
          <Heading2 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Blockquote"
          onClick={() =>
            withTextarea((ta) => applyLinePrefix(ta, "> ", update))
          }
        >
          <Quote className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Unordered list"
          onClick={() =>
            withTextarea((ta) => applyLinePrefix(ta, "- ", update))
          }
        >
          <List className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Ordered list"
          onClick={() =>
            withTextarea((ta) => applyLinePrefix(ta, "1. ", update))
          }
        >
          <ListOrdered className="size-3.5" />
        </ToolbarButton>

        <span className="mx-1 h-4 w-px bg-border/60" aria-hidden />

        <ToolbarButton
          label="Link (Cmd+K)"
          onClick={() => withTextarea((ta) => applyLink(ta, update))}
        >
          <Link className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Horizontal rule"
          onClick={() =>
            withTextarea((ta) => applyBlock(ta, "\n\n---\n\n", update))
          }
        >
          <Minus className="size-3.5" />
        </ToolbarButton>
      </div>

      <textarea
        ref={ref}
        id={id}
        name={name}
        value={internalValue}
        onChange={(e) => update(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        required={required}
        spellCheck={spellCheck}
        placeholder={placeholder}
        className={cn(
          "input-shell min-h-32 w-full rounded-t-none rounded-b-[1.15rem] border-0 bg-transparent px-4 py-4 font-mono text-sm leading-7 text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden",
          className,
        )}
      />

      <p className="mt-1.5 text-right text-xs text-muted-foreground">
        {internalValue.length.toLocaleString()} characters
      </p>
    </div>
  );
}
