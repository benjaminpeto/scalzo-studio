import { Input } from "@ui/components/ui/input";

import type { WorkEditorContentSectionsProps } from "@/interfaces/admin/component-props";
import { buildDescribedBy } from "@/lib/admin/field";

import { AdminEditorField } from "../shared/admin-editor-field";
import { AdminEditorTextarea } from "../shared/admin-editor-textarea";

export function WorkEditorContentSections({
  approachId,
  caseStudy,
  challengeId,
  clientNameId,
  errors,
  industryId,
  outcomesId,
  servicesId,
  slugId,
  titleId,
}: WorkEditorContentSectionsProps) {
  return (
    <>
      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
        <div className="grid gap-5 lg:grid-cols-2">
          <AdminEditorField
            error={errors.title}
            hint="Internal and public title for this case study."
            htmlFor={titleId}
            label="Title"
          >
            <Input
              id={titleId}
              name="title"
              defaultValue={caseStudy?.title ?? ""}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={buildDescribedBy({
                error: errors.title,
                hint: "Internal and public title for this case study.",
                id: titleId,
              })}
              placeholder="Coastal hospitality relaunch"
              required
            />
          </AdminEditorField>

          <AdminEditorField
            error={errors.slug}
            hint="Lowercase route segment. Leave blank to derive it from the title."
            htmlFor={slugId}
            label="Slug"
          >
            <Input
              id={slugId}
              name="slug"
              defaultValue={caseStudy?.slug ?? ""}
              aria-invalid={Boolean(errors.slug)}
              aria-describedby={buildDescribedBy({
                error: errors.slug,
                hint: "Lowercase route segment. Leave blank to derive it from the title.",
                id: slugId,
              })}
              placeholder="coastal-hospitality-relaunch"
              spellCheck={false}
            />
          </AdminEditorField>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <AdminEditorField
            error={errors.clientName}
            hint="Optional client name shown in the public case study."
            htmlFor={clientNameId}
            label="Client name"
            optionalLabel="Optional"
          >
            <Input
              id={clientNameId}
              name="clientName"
              defaultValue={caseStudy?.clientName ?? ""}
              aria-invalid={Boolean(errors.clientName)}
              aria-describedby={buildDescribedBy({
                error: errors.clientName,
                hint: "Optional client name shown in the public case study.",
                id: clientNameId,
              })}
              placeholder="Confidential client"
            />
          </AdminEditorField>

          <AdminEditorField
            error={errors.industry}
            hint="Optional industry tag shown in the work index and detail page."
            htmlFor={industryId}
            label="Industry"
            optionalLabel="Optional"
          >
            <Input
              id={industryId}
              name="industry"
              defaultValue={caseStudy?.industry ?? ""}
              aria-invalid={Boolean(errors.industry)}
              aria-describedby={buildDescribedBy({
                error: errors.industry,
                hint: "Optional industry tag shown in the work index and detail page.",
                id: industryId,
              })}
              placeholder="Hospitality"
            />
          </AdminEditorField>
        </div>

        <div className="mt-5">
          <AdminEditorField
            error={errors.services}
            hint="Enter one service tag per line. Blank lines are ignored."
            htmlFor={servicesId}
            label="Services"
            optionalLabel="Optional"
          >
            <AdminEditorTextarea
              id={servicesId}
              name="services"
              defaultValue={caseStudy?.services.join("\n") ?? ""}
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
          </AdminEditorField>
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
        <div className="grid gap-5">
          <AdminEditorField
            error={errors.challenge}
            hint="Explain the core friction or weakness that needed to change."
            htmlFor={challengeId}
            label="Challenge"
            optionalLabel="Optional"
          >
            <AdminEditorTextarea
              id={challengeId}
              name="challenge"
              defaultValue={caseStudy?.challenge ?? ""}
              aria-invalid={Boolean(errors.challenge)}
              aria-describedby={buildDescribedBy({
                error: errors.challenge,
                hint: "Explain the core friction or weakness that needed to change.",
                id: challengeId,
              })}
              className="min-h-40"
              placeholder="What was blocking trust, clarity, or momentum?"
            />
          </AdminEditorField>

          <AdminEditorField
            error={errors.approach}
            hint="Describe how the strategic or design direction translated into the page."
            htmlFor={approachId}
            label="Approach"
            optionalLabel="Optional"
          >
            <AdminEditorTextarea
              id={approachId}
              name="approach"
              defaultValue={caseStudy?.approach ?? ""}
              aria-invalid={Boolean(errors.approach)}
              aria-describedby={buildDescribedBy({
                error: errors.approach,
                hint: "Describe how the strategic or design direction translated into the page.",
                id: approachId,
              })}
              className="min-h-40"
              placeholder="How was the direction turned into a clearer public surface?"
            />
          </AdminEditorField>

          <AdminEditorField
            error={errors.outcomes}
            hint="Summarize the commercial or strategic shift visible after the work."
            htmlFor={outcomesId}
            label="Outcomes"
            optionalLabel="Optional"
          >
            <AdminEditorTextarea
              id={outcomesId}
              name="outcomes"
              defaultValue={caseStudy?.outcomes ?? ""}
              aria-invalid={Boolean(errors.outcomes)}
              aria-describedby={buildDescribedBy({
                error: errors.outcomes,
                hint: "Summarize the commercial or strategic shift visible after the work.",
                id: outcomesId,
              })}
              className="min-h-40"
              placeholder="Describe the shift in trust, quality of enquiries, clarity, or internal confidence."
            />
          </AdminEditorField>
        </div>
      </section>
    </>
  );
}
