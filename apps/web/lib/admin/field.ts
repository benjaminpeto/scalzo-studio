import type { BuildDescribedByInput } from "@/interfaces/admin/component-props";

export function buildDescribedBy(input: BuildDescribedByInput) {
  if (input.error || input.hint) {
    return `${input.id}-message`;
  }

  return undefined;
}
