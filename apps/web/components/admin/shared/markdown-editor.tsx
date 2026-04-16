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

interface MarkdownEditorProps {
  id?: string;
  name: string;
  /** Controlled mode — provide onChange too */
  value?: string;
  /** Uncontrolled mode */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Forward to the underlying textarea (e.g. for snippet insertion) */
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  required?: boolean;
  spellCheck?: boolean;
  placeholder?: string;
  /** Extra className applied to the textarea (e.g. "min-h-144") */
  className?: string;
}

// ---------------------------------------------------------------------------
// Insertion helpers — operate directly on the textarea DOM node so that
// setSelectionRange works synchronously without React re-render lag.
// ---------------------------------------------------------------------------

function applyWrap(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  placeholder: string,
  onUpdate: (next: string) => void,
) {
  const { selectionStart: start, selectionEnd: end, value } = textarea;
  const selected = value.slice(start, end);
  const replacement = selected || placeholder;
  const next =
    value.slice(0, start) + before + replacement + after + value.slice(end);

  onUpdate(next);

  requestAnimationFrame(() => {
    textarea.focus();
    const newStart = start + before.length;
    textarea.setSelectionRange(newStart, newStart + replacement.length);
  });
}

function applyLinePrefix(
  textarea: HTMLTextAreaElement,
  prefix: string,
  onUpdate: (next: string) => void,
) {
  const { selectionStart, value } = textarea;
  const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
  const currentLine = value.slice(lineStart);

  let next: string;
  let nextCursor: number;

  if (currentLine.startsWith(prefix)) {
    next = value.slice(0, lineStart) + currentLine.slice(prefix.length);
    nextCursor = Math.max(lineStart, selectionStart - prefix.length);
  } else {
    next = value.slice(0, lineStart) + prefix + currentLine;
    nextCursor = selectionStart + prefix.length;
  }

  onUpdate(next);

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(nextCursor, nextCursor);
  });
}

function applyLink(
  textarea: HTMLTextAreaElement,
  onUpdate: (next: string) => void,
) {
  const { selectionStart: start, selectionEnd: end, value } = textarea;
  const selected = value.slice(start, end);
  const label = selected || "link text";
  const inserted = `[${label}](url)`;
  const next = value.slice(0, start) + inserted + value.slice(end);

  onUpdate(next);

  // Position cursor on the "url" placeholder
  requestAnimationFrame(() => {
    textarea.focus();
    const urlStart = start + label.length + 3; // past "[label]("
    textarea.setSelectionRange(urlStart, urlStart + 3);
  });
}

function applyBlock(
  textarea: HTMLTextAreaElement,
  block: string,
  onUpdate: (next: string) => void,
) {
  const { selectionStart: start, value } = textarea;
  const next = value.slice(0, start) + block + value.slice(start);

  onUpdate(next);

  requestAnimationFrame(() => {
    textarea.focus();
    const newPos = start + block.length;
    textarea.setSelectionRange(newPos, newPos);
  });
}

// ---------------------------------------------------------------------------
// Toolbar button
// ---------------------------------------------------------------------------

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// MarkdownEditor
// ---------------------------------------------------------------------------

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
      {/* Toolbar */}
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

      {/* Textarea */}
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

      {/* Character count */}
      <p className="mt-1.5 text-right text-xs text-muted-foreground">
        {internalValue.length.toLocaleString()} characters
      </p>
    </div>
  );
}
