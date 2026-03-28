import Image from "next/image";

import { Input } from "@ui/components/ui/input";

import type { TestimonialEditorFormSectionsProps } from "@/interfaces/admin/component-props";
import { buildDescribedBy } from "@/lib/admin/field";

import { AdminEditorField } from "../shared/admin-editor-field";
import { AdminEditorTextarea } from "../shared/admin-editor-textarea";

export function TestimonialEditorFormSections({
  avatarId,
  companyId,
  errors,
  nameId,
  quoteId,
  roleId,
  testimonial,
}: TestimonialEditorFormSectionsProps) {
  return (
    <>
      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
        <div className="grid gap-5 lg:grid-cols-2">
          <AdminEditorField
            error={errors.name}
            hint="Public author or client name shown with the quote."
            htmlFor={nameId}
            label="Author name"
          >
            <Input
              id={nameId}
              name="name"
              defaultValue={testimonial?.name ?? ""}
              aria-describedby={buildDescribedBy({
                error: errors.name,
                hint: "Public author or client name shown with the quote.",
                id: nameId,
              })}
              aria-invalid={Boolean(errors.name)}
              placeholder="Marina Ortega"
              required
            />
          </AdminEditorField>

          <AdminEditorField
            error={errors.company}
            hint="Optional company or organization attribution."
            htmlFor={companyId}
            label="Company"
            optionalLabel="Optional"
          >
            <Input
              id={companyId}
              name="company"
              defaultValue={testimonial?.company ?? ""}
              aria-describedby={buildDescribedBy({
                error: errors.company,
                hint: "Optional company or organization attribution.",
                id: companyId,
              })}
              aria-invalid={Boolean(errors.company)}
              placeholder="Northshore Hospitality"
            />
          </AdminEditorField>
        </div>

        <div className="mt-5">
          <AdminEditorField
            error={errors.role}
            hint="Optional role or relationship label shown beside the company."
            htmlFor={roleId}
            label="Role"
            optionalLabel="Optional"
          >
            <Input
              id={roleId}
              name="role"
              defaultValue={testimonial?.role ?? ""}
              aria-describedby={buildDescribedBy({
                error: errors.role,
                hint: "Optional role or relationship label shown beside the company.",
                id: roleId,
              })}
              aria-invalid={Boolean(errors.role)}
              placeholder="Founder"
            />
          </AdminEditorField>
        </div>

        <div className="mt-5">
          <AdminEditorField
            error={errors.quote}
            hint="Main testimonial quote used in the public proof sections."
            htmlFor={quoteId}
            label="Quote"
          >
            <AdminEditorTextarea
              id={quoteId}
              name="quote"
              defaultValue={testimonial?.quote ?? ""}
              aria-describedby={buildDescribedBy({
                error: errors.quote,
                hint: "Main testimonial quote used in the public proof sections.",
                id: quoteId,
              })}
              aria-invalid={Boolean(errors.quote)}
              className="min-h-40"
              placeholder="Working with Scalzo Studio gave us clarity, pace, and a visual system that finally felt commercial."
              required
            />
          </AdminEditorField>
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
        <AdminEditorField
          error={errors.avatar}
          hint="Upload a square or portrait image. Leave empty to keep the current avatar."
          htmlFor={avatarId}
          label="Avatar"
          optionalLabel="Optional"
        >
          <div className="space-y-4">
            {testimonial?.avatarUrl ? (
              <div className="flex items-center gap-4 overflow-hidden rounded-[1.35rem] border border-border/70 bg-white/75 p-4">
                <div className="relative size-20 overflow-hidden rounded-full border border-border/70 bg-surface-container-highest">
                  <Image
                    src={testimonial.avatarUrl}
                    alt={`${testimonial.name} avatar`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    Current avatar
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Replace it with a new upload or remove it on save.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-[1.2rem] border border-dashed border-border/70 bg-white/70 px-4 py-4 text-sm leading-6 text-muted-foreground">
                No avatar is attached yet.
              </div>
            )}

            {testimonial?.avatarUrl ? (
              <label className="flex items-start gap-3 rounded-[1.15rem] border border-border/70 bg-white/70 px-4 py-3">
                <input
                  type="checkbox"
                  name="removeAvatar"
                  value="true"
                  className="mt-1 size-4 rounded border-border/70 accent-[#111311]"
                />
                <span className="text-sm leading-6 text-muted-foreground">
                  Remove the current avatar if no replacement file is uploaded.
                </span>
              </label>
            ) : null}

            <input
              id={avatarId}
              type="file"
              name="avatar"
              accept="image/avif,image/jpeg,image/png,image/webp"
              className="block w-full rounded-[1.15rem] border border-border/70 bg-white/80 px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-primary-foreground"
            />
          </div>
        </AdminEditorField>
      </section>
    </>
  );
}
