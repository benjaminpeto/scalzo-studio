// ---------------------------------------------------------------------------
// Insertion helpers — operate directly on the textarea DOM node so that
// setSelectionRange works synchronously without React re-render lag.
// ---------------------------------------------------------------------------

export function applyWrap(
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

export function applyLinePrefix(
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

export function applyLink(
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

export function applyBlock(
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
