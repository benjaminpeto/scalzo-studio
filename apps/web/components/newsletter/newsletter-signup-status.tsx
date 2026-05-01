export function NewsletterSignupStatus({
  message,
  status,
  variant,
}: {
  message: string | null;
  status: "idle" | "error" | "success";
  variant: "compact" | "editorial" | "inline";
}) {
  if (!message && status === "idle") {
    return null;
  }

  const className =
    status === "error"
      ? "border border-destructive/20 bg-destructive/6 text-foreground"
      : variant === "compact"
        ? "border border-emerald-200/70 bg-emerald-50/70 text-foreground"
        : "border border-emerald-200/70 bg-emerald-50/70 text-foreground";

  return (
    <p
      aria-live="polite"
      className={`min-h-6 rounded-[1rem] px-4 py-3 text-sm leading-6 ${className}`}
    >
      {message}
    </p>
  );
}
