import { contactFieldStepMap } from "@/constants/contact/content";
import type { ContactFieldName } from "@/interfaces/contact/form";

export function getContactStepIndexForField(field: ContactFieldName) {
  return contactFieldStepMap[field];
}
