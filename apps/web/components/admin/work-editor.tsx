"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  startTransition,
  useActionState,
  useEffect,
  useId,
  useMemo,
  useState,
  type TextareaHTMLAttributes,
} from "react";
import { useFormStatus } from "react-dom";

import {
  initialAdminCaseStudyEditorState,
  type AdminCaseStudyEditorFieldErrors,
  type AdminCaseStudyEditorRecord,
  type AdminCaseStudyEditorState,
  type AdminCaseStudyMetricRow,
} from "@/lib/admin/work-editor";
import { cn } from "@/lib/utils";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";
import { Label } from "@ui/components/ui/label";

const statusMessageByCode = {
  saved: "The latest case-study changes have been saved.",
} as const;

interface MetricRowState extends AdminCaseStudyMetricRow {
  id: string;
}

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

function createMetricRowState(
  row?: Partial<AdminCaseStudyMetricRow>,
  index = 0,
): MetricRowState {
  return {
    id: `metric-${index}-${row?.label ?? "new"}`,
    label: row?.label ?? "",
    value: row?.value ?? "",
  };
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
          Published case studies appear on the public work index and detail
          routes after save and revalidation.
        </span>
      </span>
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="min-w-32 rounded-full px-6"
      disabled={pending}
    >
      {pending ? "Saving..." : "Save changes"}
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

export function AdminWorkEditor({
  action,
  caseStudy,
  status,
}: {
  action: (
    state: AdminCaseStudyEditorState,
    payload: FormData,
  ) => Promise<AdminCaseStudyEditorState>;
  caseStudy: AdminCaseStudyEditorRecord;
  status?: string;
}) {
  const router = useRouter();
  const [serverState, formAction] = useActionState(
    action,
    initialAdminCaseStudyEditorState,
  );
  const [metricRows, setMetricRows] = useState<MetricRowState[]>(() =>
    caseStudy.metrics.length
      ? caseStudy.metrics.map((row, index) => createMetricRowState(row, index))
      : [createMetricRowState({}, 0)],
  );
  const titleId = useId();
  const slugId = useId();
  const clientNameId = useId();
  const industryId = useId();
  const servicesId = useId();
  const challengeId = useId();
  const approachId = useId();
  const outcomesId = useId();
  const metricsId = useId();
  const seoTitleId = useId();
  const seoDescriptionId = useId();
  const coverImageId = useId();
  const galleryImagesId = useId();
  const statusMessage =
    status && status in statusMessageByCode
      ? statusMessageByCode[status as keyof typeof statusMessageByCode]
      : null;
  const errors: AdminCaseStudyEditorFieldErrors = serverState.fieldErrors;
  const previewPath = `/api/preview/work?slug=${caseStudy.slug}`;
  const currentPath = `/admin/work/${caseStudy.slug}`;
  const keepAllGalleryImages = useMemo(
    () => caseStudy.galleryUrls.length === 0,
    [caseStudy.galleryUrls.length],
  );

  useEffect(() => {
    setMetricRows(
      caseStudy.metrics.length
        ? caseStudy.metrics.map((row, index) =>
            createMetricRowState(row, index),
          )
        : [createMetricRowState({}, 0)],
    );
  }, [caseStudy.id, caseStudy.metrics]);

  useEffect(() => {
    if (serverState.status !== "success" || !serverState.redirectTo) {
      return;
    }

    const redirectTo = serverState.redirectTo;

    startTransition(() => {
      router.replace(redirectTo);
    });
  }, [router, serverState.redirectTo, serverState.status]);

  function addMetricRow() {
    setMetricRows((currentRows) => [
      ...currentRows,
      createMetricRowState({}, currentRows.length),
    ]);
  }

  function removeMetricRow(id: string) {
    setMetricRows((currentRows) => {
      const nextRows = currentRows.filter((row) => row.id !== id);

      return nextRows.length ? nextRows : [createMetricRowState({}, 0)];
    });
  }

  function updateMetricRow(
    id: string,
    field: "label" | "value",
    value: string,
  ) {
    setMetricRows((currentRows) =>
      currentRows.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: value,
            }
          : row,
      ),
    );
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_22rem]">
        <div className="rounded-[1.65rem] border border-border/70 bg-[linear-gradient(160deg,rgba(252,205,3,0.15),rgba(255,255,255,0.96)_42%,rgba(241,239,234,0.9))] p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Case-study editor
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-foreground md:text-4xl">
            {caseStudy.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            Manage the work page narrative, outcome metrics, and supporting
            assets that feed the public case-study experience.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/admin/work">Back to work</Link>
            </Button>
            <Button asChild variant="ghost" className="rounded-full">
              <Link href={previewPath} prefetch={false}>
                Preview latest
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          <article className="rounded-[1.5rem] border border-border/70 bg-surface-container-lowest/82 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Status
            </p>
            <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
              {caseStudy.published ? "Published" : "Draft"}
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-border/70 bg-surface-container-lowest/82 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Route
            </p>
            <p className="mt-3 truncate text-sm font-semibold text-foreground">
              /work/{caseStudy.slug}
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-border/70 bg-surface-container-lowest/82 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Last updated
            </p>
            <p className="mt-3 text-sm font-semibold text-foreground">
              {formatUpdatedAt(caseStudy.updatedAt)}
            </p>
          </article>
        </div>
      </section>

      <form
        action={formAction}
        className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]"
      >
        <input type="hidden" name="caseStudyId" value={caseStudy.id} />
        <input type="hidden" name="currentSlug" value={caseStudy.slug} />

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
                hint="Internal and public title for this case study."
                htmlFor={titleId}
                label="Title"
              >
                <Input
                  id={titleId}
                  name="title"
                  defaultValue={caseStudy.title}
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={buildDescribedBy({
                    error: errors.title,
                    hint: "Internal and public title for this case study.",
                    id: titleId,
                  })}
                  placeholder="Coastal hospitality relaunch"
                  required
                />
              </Field>

              <Field
                error={errors.slug}
                hint="Lowercase route segment. Leave blank to derive it from the title."
                htmlFor={slugId}
                label="Slug"
              >
                <Input
                  id={slugId}
                  name="slug"
                  defaultValue={caseStudy.slug}
                  aria-invalid={Boolean(errors.slug)}
                  aria-describedby={buildDescribedBy({
                    error: errors.slug,
                    hint: "Lowercase route segment. Leave blank to derive it from the title.",
                    id: slugId,
                  })}
                  placeholder="coastal-hospitality-relaunch"
                  spellCheck={false}
                />
              </Field>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <Field
                error={errors.clientName}
                hint="Optional client name shown in the public case study."
                htmlFor={clientNameId}
                label="Client name"
                optionalLabel="Optional"
              >
                <Input
                  id={clientNameId}
                  name="clientName"
                  defaultValue={caseStudy.clientName}
                  aria-invalid={Boolean(errors.clientName)}
                  aria-describedby={buildDescribedBy({
                    error: errors.clientName,
                    hint: "Optional client name shown in the public case study.",
                    id: clientNameId,
                  })}
                  placeholder="Confidential client"
                />
              </Field>

              <Field
                error={errors.industry}
                hint="Optional industry tag shown in the work index and detail page."
                htmlFor={industryId}
                label="Industry"
                optionalLabel="Optional"
              >
                <Input
                  id={industryId}
                  name="industry"
                  defaultValue={caseStudy.industry}
                  aria-invalid={Boolean(errors.industry)}
                  aria-describedby={buildDescribedBy({
                    error: errors.industry,
                    hint: "Optional industry tag shown in the work index and detail page.",
                    id: industryId,
                  })}
                  placeholder="Hospitality"
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field
                error={errors.services}
                hint="Enter one service tag per line. Blank lines are ignored."
                htmlFor={servicesId}
                label="Services"
                optionalLabel="Optional"
              >
                <Textarea
                  id={servicesId}
                  name="services"
                  defaultValue={caseStudy.services.join("\n")}
                  aria-invalid={Boolean(errors.services)}
                  aria-describedby={buildDescribedBy({
                    error: errors.services,
                    hint: "Enter one service tag per line. Blank lines are ignored.",
                    id: servicesId,
                  })}
                  className="min-h-32"
                  placeholder={
                    "Brand direction\nWebsite strategy\nConversion design"
                  }
                />
              </Field>
            </div>
          </section>

          <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
            <div className="grid gap-5">
              <Field
                error={errors.challenge}
                hint="Explain the core friction or weakness that needed to change."
                htmlFor={challengeId}
                label="Challenge"
                optionalLabel="Optional"
              >
                <Textarea
                  id={challengeId}
                  name="challenge"
                  defaultValue={caseStudy.challenge}
                  aria-invalid={Boolean(errors.challenge)}
                  aria-describedby={buildDescribedBy({
                    error: errors.challenge,
                    hint: "Explain the core friction or weakness that needed to change.",
                    id: challengeId,
                  })}
                  className="min-h-40"
                  placeholder="What was blocking trust, clarity, or momentum?"
                />
              </Field>

              <Field
                error={errors.approach}
                hint="Describe how the strategic or design direction translated into the page."
                htmlFor={approachId}
                label="Approach"
                optionalLabel="Optional"
              >
                <Textarea
                  id={approachId}
                  name="approach"
                  defaultValue={caseStudy.approach}
                  aria-invalid={Boolean(errors.approach)}
                  aria-describedby={buildDescribedBy({
                    error: errors.approach,
                    hint: "Describe how the strategic or design direction translated into the page.",
                    id: approachId,
                  })}
                  className="min-h-40"
                  placeholder="How was the direction turned into a clearer public surface?"
                />
              </Field>

              <Field
                error={errors.outcomes}
                hint="Summarize the commercial or strategic shift visible after the work."
                htmlFor={outcomesId}
                label="Outcomes"
                optionalLabel="Optional"
              >
                <Textarea
                  id={outcomesId}
                  name="outcomes"
                  defaultValue={caseStudy.outcomes}
                  aria-invalid={Boolean(errors.outcomes)}
                  aria-describedby={buildDescribedBy({
                    error: errors.outcomes,
                    hint: "Summarize the commercial or strategic shift visible after the work.",
                    id: outcomesId,
                  })}
                  className="min-h-40"
                  placeholder="Describe the shift in trust, quality of enquiries, clarity, or internal confidence."
                />
              </Field>
            </div>
          </section>

          <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
            <Field
              error={errors.metrics}
              hint="Add key outcome rows. Empty rows are ignored only if both fields are blank."
              htmlFor={metricsId}
              label="Outcome metrics"
              optionalLabel="Optional"
            >
              <div
                id={metricsId}
                aria-describedby={buildDescribedBy({
                  error: errors.metrics,
                  hint: "Add key outcome rows. Empty rows are ignored only if both fields are blank.",
                  id: metricsId,
                })}
                className="space-y-3"
              >
                {metricRows.map((row, index) => (
                  <div
                    key={row.id}
                    className="grid gap-3 rounded-[1.2rem] border border-border/70 bg-white/70 p-4 md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.42fr)_auto]"
                  >
                    <Input
                      name="metricLabel"
                      value={row.label}
                      onChange={(event) =>
                        updateMetricRow(row.id, "label", event.target.value)
                      }
                      placeholder={`Metric label ${index + 1}`}
                    />
                    <Input
                      name="metricValue"
                      value={row.value}
                      onChange={(event) =>
                        updateMetricRow(row.id, "value", event.target.value)
                      }
                      placeholder="e.g. +34% direct enquiries"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeMetricRow(row.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addMetricRow}>
                  Add metric row
                </Button>
              </div>
            </Field>
          </section>

          <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
            <div className="grid gap-6">
              <Field
                error={errors.coverImage}
                hint="Upload a replacement cover image. Leave empty to keep the current cover."
                htmlFor={coverImageId}
                label="Cover image"
                optionalLabel="Optional"
              >
                <div className="space-y-4">
                  {caseStudy.coverImageUrl ? (
                    <div className="overflow-hidden rounded-[1.35rem] border border-border/70 bg-white/70">
                      <Image
                        src={caseStudy.coverImageUrl}
                        alt={`${caseStudy.title} cover image`}
                        width={1200}
                        height={900}
                        className="aspect-[1.35] w-full object-cover"
                      />
                    </div>
                  ) : null}

                  {caseStudy.coverImageUrl ? (
                    <label className="flex items-start gap-3 rounded-[1.15rem] border border-border/70 bg-white/70 px-4 py-3">
                      <input
                        type="checkbox"
                        name="removeCoverImage"
                        value="true"
                        className="mt-1 size-4 rounded border-border/70 accent-[#111311]"
                      />
                      <span className="text-sm leading-6 text-muted-foreground">
                        Remove the current cover image if no replacement file is
                        uploaded.
                      </span>
                    </label>
                  ) : null}

                  <input
                    id={coverImageId}
                    type="file"
                    name="coverImage"
                    accept="image/avif,image/jpeg,image/png,image/webp"
                    className="block w-full rounded-[1.15rem] border border-border/70 bg-white/80 px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-primary-foreground"
                  />
                </div>
              </Field>

              <Field
                error={errors.galleryImages}
                hint="Keep or remove existing gallery images and append new uploads."
                htmlFor={galleryImagesId}
                label="Gallery"
                optionalLabel="Optional"
              >
                <div className="space-y-4">
                  {caseStudy.galleryUrls.length ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {caseStudy.galleryUrls.map((url, index) => (
                        <label
                          key={`${url}-${index}`}
                          className="overflow-hidden rounded-[1.35rem] border border-border/70 bg-white/70"
                        >
                          <Image
                            src={url}
                            alt={`${caseStudy.title} gallery image ${index + 1}`}
                            width={1200}
                            height={900}
                            className="aspect-[1.2] w-full object-cover"
                          />
                          <div className="flex items-start gap-3 border-t border-border/70 px-4 py-3">
                            <input
                              type="checkbox"
                              name="existingGalleryUrl"
                              value={url}
                              defaultChecked
                              className="mt-1 size-4 rounded border-border/70 accent-[#111311]"
                            />
                            <div className="text-sm leading-6 text-muted-foreground">
                              Keep this gallery image
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[1.2rem] border border-dashed border-border/70 bg-white/70 px-4 py-4 text-sm leading-6 text-muted-foreground">
                      No gallery images are attached yet.
                    </div>
                  )}

                  {!keepAllGalleryImages ? (
                    <p className="text-sm leading-6 text-muted-foreground">
                      Uncheck any existing image you want removed from the
                      gallery on save.
                    </p>
                  ) : null}

                  <input
                    id={galleryImagesId}
                    type="file"
                    name="galleryImages"
                    multiple
                    accept="image/avif,image/jpeg,image/png,image/webp"
                    className="block w-full rounded-[1.15rem] border border-border/70 bg-white/80 px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-primary-foreground"
                  />
                </div>
              </Field>
            </div>
          </section>

          <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
            <div className="grid gap-5">
              <Field
                error={errors.seoTitle}
                hint="Optional title override for search and social metadata."
                htmlFor={seoTitleId}
                label="SEO title"
                optionalLabel="Optional"
              >
                <Input
                  id={seoTitleId}
                  name="seoTitle"
                  defaultValue={caseStudy.seoTitle}
                  aria-invalid={Boolean(errors.seoTitle)}
                  aria-describedby={buildDescribedBy({
                    error: errors.seoTitle,
                    hint: "Optional title override for search and social metadata.",
                    id: seoTitleId,
                  })}
                  placeholder="Coastal Hospitality Relaunch | Work | Scalzo Studio"
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
                  defaultValue={caseStudy.seoDescription}
                  aria-invalid={Boolean(errors.seoDescription)}
                  aria-describedby={buildDescribedBy({
                    error: errors.seoDescription,
                    hint: "Optional description override for search and social previews.",
                    id: seoDescriptionId,
                  })}
                  className="min-h-28"
                  placeholder="Summarize the page shift and the commercial outcome in one concise paragraph."
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
              <PublishField defaultChecked={caseStudy.published} />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Saving from the editor keeps `published` and `published_at`
              aligned with the public work routes.
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
                <dt className="font-semibold text-foreground">Public route</dt>
                <dd className="break-all">/work/{caseStudy.slug}</dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Published at</dt>
                <dd>
                  {caseStudy.publishedAt
                    ? formatUpdatedAt(caseStudy.publishedAt)
                    : "Not published"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Asset status
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                Cover image: {caseStudy.coverImageUrl ? "Present" : "Missing"}
              </p>
              <p>Gallery items: {caseStudy.galleryUrls.length}</p>
              <p>Metrics rows: {caseStudy.metrics.length}</p>
            </div>
          </section>

          <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Save
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Saving revalidates the public work index, the case-study detail
              route, and the admin work listing.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <SubmitButton />
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/admin/work">Cancel</Link>
              </Button>
            </div>
          </section>
        </aside>
      </form>
    </div>
  );
}
