"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  startTransition,
  useActionState,
  useEffect,
  useId,
  type TextareaHTMLAttributes,
} from "react";
import { useFormStatus } from "react-dom";

import {
  initialAdminServiceEditorState,
  type AdminServiceEditorState,
  type AdminServiceEditorFieldErrors,
  type AdminServiceEditorRecord,
} from "@/lib/admin/service-editor";
import { cn } from "@/lib/utils";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";
import { Label } from "@ui/components/ui/label";

const statusMessageByCode = {
  created: "The service has been created and is ready for content editing.",
  saved: "The latest service changes have been saved.",
} as const;

function formatUpdatedAt(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function FieldMessage({ error, id }: { error?: string; id: string }) {
  if (!error) {
    return null;
  }

  return (
    <p id={id} className="text-sm text-destructive" role="alert">
      {error}
    </p>
  );
}

function Field({
  children,
  error,
  hint,
  htmlFor,
  label,
  optionalLabel,
}: {
  children: React.ReactNode;
  error?: string;
  hint?: string;
  htmlFor: string;
  label: string;
  optionalLabel?: string;
}) {
  const messageId = `${htmlFor}-message`;

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
      {error ? <FieldMessage error={error} id={messageId} /> : null}
      {!error && hint ? (
        <p id={messageId} className="text-sm leading-6 text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "input-shell flex min-h-32 w-full rounded-[1.15rem] border-0 bg-transparent px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

function PublishField({ defaultChecked }: { defaultChecked: boolean }) {
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
          Published services appear on the public services index and detail
          routes after save and revalidation.
        </span>
      </span>
    </label>
  );
}

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="min-w-32 rounded-full px-6"
      disabled={pending}
    >
      {pending
        ? mode === "create"
          ? "Creating..."
          : "Saving..."
        : mode === "create"
          ? "Create service"
          : "Save changes"}
    </Button>
  );
}

function buildDescribedBy(input: {
  error?: string;
  hint?: string;
  id: string;
}) {
  if (input.error || input.hint) {
    return `${input.id}-message`;
  }

  return undefined;
}

export function AdminServiceEditor({
  action,
  mode,
  service,
  status,
}: {
  action: (
    state: AdminServiceEditorState,
    payload: FormData,
  ) => Promise<AdminServiceEditorState>;
  mode: "create" | "edit";
  service?: AdminServiceEditorRecord;
  status?: string;
}) {
  const router = useRouter();
  const [serverState, formAction] = useActionState(
    action,
    initialAdminServiceEditorState,
  );
  const titleId = useId();
  const slugId = useId();
  const summaryId = useId();
  const contentId = useId();
  const deliverablesId = useId();
  const seoTitleId = useId();
  const seoDescriptionId = useId();
  const statusMessage =
    status && status in statusMessageByCode
      ? statusMessageByCode[status as keyof typeof statusMessageByCode]
      : null;
  const errors: AdminServiceEditorFieldErrors = serverState.fieldErrors;
  const currentPath =
    mode === "create"
      ? "/admin/services/new"
      : `/admin/services/${service?.slug ?? ""}`;
  const previewPath = service?.published ? `/services/${service.slug}` : null;

  useEffect(() => {
    if (serverState.status !== "success" || !serverState.redirectTo) {
      return;
    }

    startTransition(() => {
      router.replace(serverState.redirectTo as string);
    });
  }, [router, serverState.redirectTo, serverState.status]);

  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_22rem]">
        <div className="rounded-[1.65rem] border border-border/70 bg-[linear-gradient(160deg,rgba(252,205,3,0.15),rgba(255,255,255,0.96)_42%,rgba(241,239,234,0.9))] p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {mode === "create" ? "New service" : "Service editor"}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-foreground md:text-4xl">
            {mode === "create"
              ? "Create a new service route."
              : (service?.title ?? "Edit service content.")}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            Use this editor to manage the service summary, markdown body,
            deliverables, and SEO fields that support the public service
            experience.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/admin/services">Back to services</Link>
            </Button>
            {previewPath ? (
              <Button asChild variant="ghost" className="rounded-full">
                <Link href={previewPath}>Preview public page</Link>
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          <article className="rounded-[1.5rem] border border-border/70 bg-surface-container-lowest/82 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Status
            </p>
            <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
              {service
                ? service.published
                  ? "Published"
                  : "Draft"
                : "Draft by default"}
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-border/70 bg-surface-container-lowest/82 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Route
            </p>
            <p className="mt-3 truncate text-sm font-semibold text-foreground">
              {mode === "create"
                ? "/services/{slug}"
                : `/services/${service?.slug ?? ""}`}
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-border/70 bg-surface-container-lowest/82 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Last updated
            </p>
            <p className="mt-3 text-sm font-semibold text-foreground">
              {service
                ? formatUpdatedAt(service.updatedAt)
                : "Will be set on save"}
            </p>
          </article>
        </div>
      </section>

      <form
        action={formAction}
        className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]"
      >
        {mode === "edit" ? (
          <>
            <input type="hidden" name="serviceId" value={service?.id ?? ""} />
            <input
              type="hidden"
              name="currentSlug"
              value={service?.slug ?? ""}
            />
          </>
        ) : null}

        <div className="space-y-4">
          {serverState.message ? (
            <div
              className={cn(
                "rounded-[1.25rem] border px-4 py-3 text-sm leading-6",
                serverState.status === "error"
                  ? "border-destructive/25 bg-destructive/8 text-foreground"
                  : "border-emerald-200 bg-emerald-50/90 text-emerald-900",
              )}
              role={serverState.status === "error" ? "alert" : "status"}
            >
              {serverState.message}
            </div>
          ) : null}

          {statusMessage ? (
            <div
              className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm leading-6 text-emerald-900"
              role="status"
            >
              {statusMessage}
            </div>
          ) : null}

          <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
            <div className="grid gap-5 lg:grid-cols-2">
              <Field
                error={errors.title}
                hint="Internal and public title for this service."
                htmlFor={titleId}
                label="Title"
              >
                <Input
                  id={titleId}
                  name="title"
                  defaultValue={service?.title ?? ""}
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={buildDescribedBy({
                    error: errors.title,
                    hint: "Internal and public title for this service.",
                    id: titleId,
                  })}
                  placeholder="Conversion strategy"
                  required
                />
              </Field>

              <Field
                error={errors.slug}
                hint="Lowercase route segment. Leave blank on create to derive it from the title."
                htmlFor={slugId}
                label="Slug"
              >
                <Input
                  id={slugId}
                  name="slug"
                  defaultValue={service?.slug ?? ""}
                  aria-invalid={Boolean(errors.slug)}
                  aria-describedby={buildDescribedBy({
                    error: errors.slug,
                    hint: "Lowercase route segment. Leave blank on create to derive it from the title.",
                    id: slugId,
                  })}
                  placeholder="conversion-strategy"
                  spellCheck={false}
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field
                error={errors.summary}
                hint="Short public summary used on index and supporting sections."
                htmlFor={summaryId}
                label="Summary"
                optionalLabel="Optional"
              >
                <Textarea
                  id={summaryId}
                  name="summary"
                  defaultValue={service?.summary ?? ""}
                  aria-invalid={Boolean(errors.summary)}
                  aria-describedby={buildDescribedBy({
                    error: errors.summary,
                    hint: "Short public summary used on index and supporting sections.",
                    id: summaryId,
                  })}
                  className="min-h-28"
                  placeholder="Position the service in one clear paragraph."
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field
                error={errors.contentMd}
                hint="Plain markdown only. The public route renders markdown safely without rich HTML input."
                htmlFor={contentId}
                label="Markdown body"
                optionalLabel="Optional"
              >
                <Textarea
                  id={contentId}
                  name="contentMd"
                  defaultValue={service?.contentMd ?? ""}
                  aria-invalid={Boolean(errors.contentMd)}
                  aria-describedby={buildDescribedBy({
                    error: errors.contentMd,
                    hint: "Plain markdown only. The public route renders markdown safely without rich HTML input.",
                    id: contentId,
                  })}
                  className="min-h-88"
                  placeholder={
                    "## What this service solves\n\nDescribe the problem, approach, and expected shift."
                  }
                  spellCheck={false}
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field
                error={errors.deliverables}
                hint="Enter one deliverable per line. Blank lines are ignored."
                htmlFor={deliverablesId}
                label="Deliverables"
                optionalLabel="Optional"
              >
                <Textarea
                  id={deliverablesId}
                  name="deliverables"
                  defaultValue={service?.deliverables.join("\n") ?? ""}
                  aria-invalid={Boolean(errors.deliverables)}
                  aria-describedby={buildDescribedBy({
                    error: errors.deliverables,
                    hint: "Enter one deliverable per line. Blank lines are ignored.",
                    id: deliverablesId,
                  })}
                  className="min-h-40"
                  placeholder={
                    "Audit and diagnosis\nOffer architecture\nLaunch messaging"
                  }
                />
              </Field>
            </div>
          </section>

          <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
            <div className="grid gap-5">
              <Field
                error={errors.seoTitle}
                hint="Optional title override for metadata. Keep it concise and useful."
                htmlFor={seoTitleId}
                label="SEO title"
                optionalLabel="Optional"
              >
                <Input
                  id={seoTitleId}
                  name="seoTitle"
                  defaultValue={service?.seoTitle ?? ""}
                  aria-invalid={Boolean(errors.seoTitle)}
                  aria-describedby={buildDescribedBy({
                    error: errors.seoTitle,
                    hint: "Optional title override for metadata. Keep it concise and useful.",
                    id: seoTitleId,
                  })}
                  placeholder="Conversion Strategy | Scalzo Studio"
                />
              </Field>

              <Field
                error={errors.seoDescription}
                hint="Optional description override for search and social previews."
                htmlFor={seoDescriptionId}
                label="SEO description"
                optionalLabel="Optional"
              >
                <Textarea
                  id={seoDescriptionId}
                  name="seoDescription"
                  defaultValue={service?.seoDescription ?? ""}
                  aria-invalid={Boolean(errors.seoDescription)}
                  aria-describedby={buildDescribedBy({
                    error: errors.seoDescription,
                    hint: "Optional description override for search and social previews.",
                    id: seoDescriptionId,
                  })}
                  className="min-h-28"
                  placeholder="Define what the service is, who it helps, and the commercial shift it supports."
                />
              </Field>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Publishing
            </p>
            <div className="mt-4">
              <PublishField defaultChecked={service?.published ?? false} />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Draft services remain editable in admin while staying hidden from
              the public site.
            </p>
          </section>

          <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Operational notes
            </p>
            <dl className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <div>
                <dt className="font-semibold text-foreground">Admin route</dt>
                <dd className="break-all">{currentPath}</dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Order index</dt>
                <dd>
                  {service
                    ? String(service.orderIndex + 1).padStart(2, "0")
                    : "Appended to the end on create"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Public route</dt>
                <dd className="break-all">
                  {mode === "create"
                    ? "Assigned after slug validation and save"
                    : `/services/${service?.slug ?? ""}`}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Save
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Saving revalidates the public services index, the service detail
              route, and the admin listing.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <SubmitButton mode={mode} />
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/admin/services">Cancel</Link>
              </Button>
            </div>
          </section>
        </aside>
      </form>
    </div>
  );
}
