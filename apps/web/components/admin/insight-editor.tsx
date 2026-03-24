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
  useRef,
  useState,
  type TextareaHTMLAttributes,
} from "react";
import { useFormStatus } from "react-dom";

import { InsightMarkdown } from "@/components/insights/insight-markdown";
import {
  initialAdminInsightEditorState,
  initialAdminInsightMediaState,
  type AdminInsightEditorFieldErrors,
  type AdminInsightEditorRecord,
  type AdminInsightEditorState,
  type AdminInsightMediaState,
} from "@/lib/admin/insight-editor";
import { cn } from "@/lib/utils";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";
import { Label } from "@ui/components/ui/label";

const statusMessageByCode = {
  created: "The post has been created and is ready for article editing.",
  saved: "The latest post changes have been saved.",
} as const;

function formatUpdatedAt(value: string | null) {
  if (!value) {
    return "Unknown";
  }

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
          Published posts appear on the public insights index and article routes
          after save and revalidation.
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
          ? "Create insight"
          : "Save changes"}
    </Button>
  );
}

function UploadImageButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="rounded-full px-6" disabled={pending}>
      {pending ? "Uploading..." : "Upload image"}
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

function normalizeTagsPreview(value: string) {
  return value
    .split(/\r?\n/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function AdminInsightEditor({
  action,
  mediaAction,
  mode,
  post,
  status,
}: {
  action: (
    state: AdminInsightEditorState,
    payload: FormData,
  ) => Promise<AdminInsightEditorState>;
  mediaAction: (
    state: AdminInsightMediaState,
    payload: FormData,
  ) => Promise<AdminInsightMediaState>;
  mode: "create" | "edit";
  post?: AdminInsightEditorRecord;
  status?: string;
}) {
  const router = useRouter();
  const [serverState, formAction] = useActionState(
    action,
    initialAdminInsightEditorState,
  );
  const [mediaState, mediaFormAction] = useActionState(
    mediaAction,
    initialAdminInsightMediaState,
  );
  const [titleValue, setTitleValue] = useState(post?.title ?? "");
  const [slugValue, setSlugValue] = useState(post?.slug ?? "");
  const [excerptValue, setExcerptValue] = useState(post?.excerpt ?? "");
  const [tagsValue, setTagsValue] = useState(post?.tags.join("\n") ?? "");
  const [contentMdValue, setContentMdValue] = useState(post?.contentMd ?? "");
  const [seoTitleValue, setSeoTitleValue] = useState(post?.seoTitle ?? "");
  const [seoDescriptionValue, setSeoDescriptionValue] = useState(
    post?.seoDescription ?? "",
  );
  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const titleId = useId();
  const slugId = useId();
  const excerptId = useId();
  const tagsId = useId();
  const contentId = useId();
  const coverImageId = useId();
  const seoTitleId = useId();
  const seoDescriptionId = useId();
  const contentImageId = useId();
  const contentImageAltId = useId();
  const errors: AdminInsightEditorFieldErrors = serverState.fieldErrors;
  const currentPath =
    mode === "create"
      ? "/admin/insights/new"
      : `/admin/insights/${post?.slug ?? ""}`;
  const previewPath =
    mode === "edit" && post ? `/api/preview/insights?slug=${post.slug}` : null;
  const previewTags = useMemo(
    () => normalizeTagsPreview(tagsValue),
    [tagsValue],
  );
  const statusMessage =
    status && status in statusMessageByCode
      ? statusMessageByCode[status as keyof typeof statusMessageByCode]
      : null;

  useEffect(() => {
    setTitleValue(post?.title ?? "");
    setSlugValue(post?.slug ?? "");
    setExcerptValue(post?.excerpt ?? "");
    setTagsValue(post?.tags.join("\n") ?? "");
    setContentMdValue(post?.contentMd ?? "");
    setSeoTitleValue(post?.seoTitle ?? "");
    setSeoDescriptionValue(post?.seoDescription ?? "");
  }, [
    post?.contentMd,
    post?.excerpt,
    post?.seoDescription,
    post?.seoTitle,
    post?.slug,
    post?.tags,
    post?.title,
  ]);

  useEffect(() => {
    if (serverState.status !== "success" || !serverState.redirectTo) {
      return;
    }

    startTransition(() => {
      router.replace(serverState.redirectTo as string);
    });
  }, [router, serverState.redirectTo, serverState.status]);

  function insertUploadedSnippet() {
    if (!mediaState.snippet) {
      return;
    }

    const snippet = mediaState.snippet;
    const textarea = contentTextareaRef.current;

    if (!textarea) {
      setContentMdValue((current) =>
        current.trim() ? `${current}\n\n${snippet}` : snippet,
      );
      return;
    }

    const selectionStart = textarea.selectionStart ?? textarea.value.length;
    const selectionEnd = textarea.selectionEnd ?? textarea.value.length;

    setContentMdValue((current) => {
      const prefix = current.slice(0, selectionStart);
      const suffix = current.slice(selectionEnd);
      const needsLeadingBreak = prefix.length > 0 && !prefix.endsWith("\n\n");
      const leading = needsLeadingBreak ? "\n\n" : "";
      const needsTrailingBreak =
        suffix.length > 0 && !suffix.startsWith("\n\n") ? "\n\n" : "";

      return `${prefix}${leading}${snippet}${needsTrailingBreak}${suffix}`;
    });

    requestAnimationFrame(() => {
      textarea.focus();
    });
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_22rem]">
        <div className="rounded-[1.65rem] border border-border/70 bg-[linear-gradient(160deg,rgba(252,205,3,0.15),rgba(255,255,255,0.96)_42%,rgba(241,239,234,0.9))] p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {mode === "create" ? "New insight" : "Insight editor"}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-foreground md:text-4xl">
            {mode === "create"
              ? "Create a new insight route."
              : (post?.title ?? "Edit article content.")}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            Manage the article body, excerpt, tags, cover image, and SEO fields
            that feed the public insights experience.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/admin/insights">Back to insights</Link>
            </Button>
            {previewPath ? (
              <Button asChild variant="ghost" className="rounded-full">
                <Link href={previewPath} prefetch={false}>
                  Preview latest
                </Link>
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
              {post
                ? post.published
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
              /insights/{slugValue || "{slug}"}
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-border/70 bg-surface-container-lowest/82 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Last updated
            </p>
            <p className="mt-3 text-sm font-semibold text-foreground">
              {post ? formatUpdatedAt(post.updatedAt) : "Will be set on save"}
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
            <input type="hidden" name="postId" value={post?.id ?? ""} />
            <input type="hidden" name="currentSlug" value={post?.slug ?? ""} />
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
                hint="Internal and public title for this article."
                htmlFor={titleId}
                label="Title"
              >
                <Input
                  id={titleId}
                  name="title"
                  value={titleValue}
                  onChange={(event) => setTitleValue(event.target.value)}
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={buildDescribedBy({
                    error: errors.title,
                    hint: "Internal and public title for this article.",
                    id: titleId,
                  })}
                  placeholder="Why premium service brands need proof before explanation"
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
                  value={slugValue}
                  onChange={(event) => setSlugValue(event.target.value)}
                  aria-invalid={Boolean(errors.slug)}
                  aria-describedby={buildDescribedBy({
                    error: errors.slug,
                    hint: "Lowercase route segment. Leave blank to derive it from the title.",
                    id: slugId,
                  })}
                  placeholder="why-premium-service-brands-need-proof-before-explanation"
                  spellCheck={false}
                />
              </Field>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <Field
                error={errors.excerpt}
                hint="Optional summary shown in the public article hero and article cards."
                htmlFor={excerptId}
                label="Excerpt"
                optionalLabel="Optional"
              >
                <Textarea
                  id={excerptId}
                  name="excerpt"
                  value={excerptValue}
                  onChange={(event) => setExcerptValue(event.target.value)}
                  aria-invalid={Boolean(errors.excerpt)}
                  aria-describedby={buildDescribedBy({
                    error: errors.excerpt,
                    hint: "Optional summary shown in the public article hero and article cards.",
                    id: excerptId,
                  })}
                  className="min-h-28"
                  placeholder="A short editorial summary for cards, the article hero, and SEO fallbacks."
                />
              </Field>

              <Field
                error={errors.tags}
                hint="Enter one tag per line. Blank lines are ignored."
                htmlFor={tagsId}
                label="Tags"
                optionalLabel="Optional"
              >
                <Textarea
                  id={tagsId}
                  name="tags"
                  value={tagsValue}
                  onChange={(event) => setTagsValue(event.target.value)}
                  aria-invalid={Boolean(errors.tags)}
                  aria-describedby={buildDescribedBy({
                    error: errors.tags,
                    hint: "Enter one tag per line. Blank lines are ignored.",
                    id: tagsId,
                  })}
                  className="min-h-28"
                  placeholder={"Positioning\nTrust\nHomepage strategy"}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
            <div className="grid gap-6 xl:grid-cols-2">
              <Field
                error={errors.contentMd}
                hint="Write the article in Markdown. The preview uses the same rendering rules as the public article page."
                htmlFor={contentId}
                label="Article body"
              >
                <textarea
                  id={contentId}
                  ref={contentTextareaRef}
                  name="contentMd"
                  value={contentMdValue}
                  onChange={(event) => setContentMdValue(event.target.value)}
                  aria-invalid={Boolean(errors.contentMd)}
                  aria-describedby={buildDescribedBy({
                    error: errors.contentMd,
                    hint: "Write the article in Markdown. The preview uses the same rendering rules as the public article page.",
                    id: contentId,
                  })}
                  className="input-shell min-h-[36rem] w-full rounded-[1.15rem] border-0 bg-transparent px-4 py-4 font-mono text-sm leading-7 text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden"
                  placeholder="# Start writing&#10;&#10;Use markdown headings, lists, quotes, links, and images."
                  spellCheck={false}
                  required
                />
              </Field>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Live preview
                  </Label>
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Public rendering
                  </span>
                </div>
                <div className="rounded-[1.35rem] border border-border/70 bg-white/75 p-4 shadow-[0_16px_44px_rgba(27,28,26,0.04)]">
                  <div className="rounded-[1.2rem] border border-border/60 bg-[rgba(250,248,241,0.72)] p-4">
                    {post?.coverImageUrl ? (
                      <div className="overflow-hidden rounded-[1.1rem] border border-border/60">
                        <Image
                          src={post.coverImageUrl}
                          alt={`Cover image for ${titleValue || post.title}`}
                          width={1600}
                          height={1100}
                          sizes="(min-width: 1280px) 30vw, 100vw"
                          className="aspect-[1.15] w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[1.15] items-center justify-center rounded-[1.1rem] border border-dashed border-border/70 bg-surface-container-low text-sm text-muted-foreground">
                        No cover image yet
                      </div>
                    )}
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {post
                            ? post.published
                              ? formatUpdatedAt(post.publishedAt)
                              : "Draft preview"
                            : "Unsaved draft"}
                        </p>
                        <h2 className="mt-3 font-display text-[2rem] leading-[0.96] tracking-[-0.04em] text-foreground">
                          {titleValue.trim() || "Untitled article"}
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          {excerptValue.trim() ||
                            "The excerpt preview updates live as you edit the article summary."}
                        </p>
                        {previewTags.length ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {previewTags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-border/70 bg-white px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <div className="max-h-[28rem] overflow-auto rounded-[1.1rem] border border-border/60 bg-white px-5 py-5">
                        <article className="space-y-8">
                          <InsightMarkdown content={contentMdValue} />
                        </article>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
            <Field
              error={errors.coverImage}
              hint="Upload a replacement cover image. Leave empty to keep the current cover."
              htmlFor={coverImageId}
              label="Cover image"
              optionalLabel="Optional"
            >
              <div className="space-y-4">
                {post?.coverImageUrl ? (
                  <div className="overflow-hidden rounded-[1.35rem] border border-border/70 bg-white/70">
                    <Image
                      src={post.coverImageUrl}
                      alt={`${post.title} cover image`}
                      width={1200}
                      height={900}
                      className="aspect-[1.35] w-full object-cover"
                    />
                  </div>
                ) : null}

                {post?.coverImageUrl ? (
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

                <Input
                  id={coverImageId}
                  name="coverImage"
                  type="file"
                  accept="image/avif,image/jpeg,image/png,image/webp"
                  aria-invalid={Boolean(errors.coverImage)}
                  aria-describedby={buildDescribedBy({
                    error: errors.coverImage,
                    hint: "Upload a replacement cover image. Leave empty to keep the current cover.",
                    id: coverImageId,
                  })}
                  className="h-auto file:mr-4 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-sm file:font-semibold file:text-background"
                />
              </div>
            </Field>
          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
            <PublishField defaultChecked={post?.published ?? false} />
          </section>

          <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
            <div className="space-y-5">
              <Field
                error={errors.seoTitle}
                hint="Optional title override for search and social previews."
                htmlFor={seoTitleId}
                label="SEO title"
                optionalLabel="Optional"
              >
                <Input
                  id={seoTitleId}
                  name="seoTitle"
                  value={seoTitleValue}
                  onChange={(event) => setSeoTitleValue(event.target.value)}
                  aria-invalid={Boolean(errors.seoTitle)}
                  aria-describedby={buildDescribedBy({
                    error: errors.seoTitle,
                    hint: "Optional title override for search and social previews.",
                    id: seoTitleId,
                  })}
                  placeholder="Article-specific search title"
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
                  value={seoDescriptionValue}
                  onChange={(event) =>
                    setSeoDescriptionValue(event.target.value)
                  }
                  aria-invalid={Boolean(errors.seoDescription)}
                  aria-describedby={buildDescribedBy({
                    error: errors.seoDescription,
                    hint: "Optional description override for search and social previews.",
                    id: seoDescriptionId,
                  })}
                  className="min-h-32"
                  placeholder="Description used for search and social cards."
                />
              </Field>
            </div>
          </section>

          <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Editor route
            </p>
            <dl className="mt-4 space-y-4">
              <div className="border-b border-border/60 pb-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Admin path
                </dt>
                <dd className="mt-2 break-all text-sm leading-6 text-foreground">
                  {currentPath}
                </dd>
              </div>
              <div className="border-b border-border/60 pb-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Public path
                </dt>
                <dd className="mt-2 break-all text-sm leading-6 text-foreground">
                  {mode === "create"
                    ? "Assigned after slug validation and save"
                    : `/insights/${slugValue || "{slug}"}`}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Post ID
                </dt>
                <dd className="mt-2 break-all text-sm leading-6 text-foreground">
                  {post?.id ?? "Assigned after create"}
                </dd>
              </div>
            </dl>
          </section>

          <div className="flex justify-end">
            <SubmitButton mode={mode} />
          </div>
        </div>
      </form>

      {mode === "edit" && post ? (
        <form
          action={mediaFormAction}
          className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6"
        >
          <input type="hidden" name="currentSlug" value={post.slug} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] xl:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Content image helper
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                Upload a blog image and insert a ready-to-use markdown snippet.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                Uploaded images are stored in the public{" "}
                <code>blog-images</code> bucket under the current post slug. Use
                the snippet below to place the image directly in the article
                body.
              </p>
            </div>

            <div className="space-y-5">
              {mediaState.message ? (
                <div
                  className={cn(
                    "rounded-[1.25rem] border px-4 py-3 text-sm leading-6",
                    mediaState.status === "error"
                      ? "border-destructive/25 bg-destructive/8 text-foreground"
                      : "border-emerald-200 bg-emerald-50/90 text-emerald-900",
                  )}
                  role={mediaState.status === "error" ? "alert" : "status"}
                >
                  {mediaState.message}
                </div>
              ) : null}

              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto]">
                <Field
                  htmlFor={contentImageAltId}
                  hint="Optional alt text for the inserted markdown snippet."
                  label="Image alt text"
                  optionalLabel="Optional"
                >
                  <Input
                    id={contentImageAltId}
                    name="contentImageAlt"
                    placeholder="Describe what the image shows"
                  />
                </Field>

                <div className="flex lg:items-end">
                  <UploadImageButton />
                </div>
              </div>

              <Field
                htmlFor={contentImageId}
                hint="Supported formats: AVIF, JPEG, PNG, and WebP."
                label="Content image file"
              >
                <Input
                  id={contentImageId}
                  name="contentImage"
                  type="file"
                  accept="image/avif,image/jpeg,image/png,image/webp"
                  className="h-auto file:mr-4 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-sm file:font-semibold file:text-background"
                  required
                />
              </Field>

              {mediaState.snippet ? (
                <div className="space-y-3 rounded-[1.2rem] border border-border/70 bg-white/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Markdown snippet
                  </p>
                  <Textarea
                    readOnly
                    value={mediaState.snippet}
                    className="min-h-28 font-mono text-sm"
                  />
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full"
                      onClick={insertUploadedSnippet}
                    >
                      Insert into article
                    </Button>
                    {mediaState.uploadedUrl ? (
                      <Button asChild variant="ghost" className="rounded-full">
                        <a
                          href={mediaState.uploadedUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open image
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </form>
      ) : (
        <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Content image helper
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground">
            Save the post once before uploading article images.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
            Content images are stored under the saved post slug in the public{" "}
            <code>blog-images</code> bucket. Create the draft first, then use
            the media helper from the editor route to upload images and insert
            markdown snippets.
          </p>
        </section>
      )}
    </div>
  );
}
