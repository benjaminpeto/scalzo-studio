import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";

import type { InsightEditorMediaHelperProps } from "@/interfaces/admin/component-props";
import { cn } from "@/lib/utils";

import { AdminEditorField } from "../shared/admin-editor-field";
import { AdminEditorTextarea } from "../shared/admin-editor-textarea";

function UploadImageButton() {
  return (
    <Button type="submit" className="rounded-full px-6">
      Upload image
    </Button>
  );
}

export function InsightEditorMediaHelper({
  insertUploadedSnippet,
  mediaAction,
  mediaState,
  post,
}: InsightEditorMediaHelperProps) {
  if (!post) {
    return (
      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Content image helper
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground">
          Save the post once before uploading article images.
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
          Content images are stored under the saved post slug in the public{" "}
          <code>blog-images</code> bucket. Create the draft first, then use the
          media helper from the editor route to upload images and insert
          markdown snippets.
        </p>
      </section>
    );
  }

  return (
    <form
      action={mediaAction}
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
            Uploaded images are stored in the public <code>blog-images</code>{" "}
            bucket under the current post slug. Use the snippet below to place
            the image directly in the article body.
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
            <AdminEditorField
              htmlFor="content-image-alt"
              hint="Optional alt text for the inserted markdown snippet."
              label="Image alt text"
              optionalLabel="Optional"
            >
              <Input
                id="content-image-alt"
                name="contentImageAlt"
                placeholder="Describe what the image shows"
              />
            </AdminEditorField>

            <div className="flex lg:items-end">
              <UploadImageButton />
            </div>
          </div>

          <AdminEditorField
            htmlFor="content-image-file"
            hint="Supported formats: AVIF, JPEG, PNG, and WebP."
            label="Content image file"
          >
            <Input
              id="content-image-file"
              name="contentImage"
              type="file"
              accept="image/avif,image/jpeg,image/png,image/webp"
              className="h-auto file:mr-4 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-sm file:font-semibold file:text-background"
              required
            />
          </AdminEditorField>

          {mediaState.snippet ? (
            <div className="space-y-3 rounded-[1.2rem] border border-border/70 bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Markdown snippet
              </p>
              <AdminEditorTextarea
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
  );
}
