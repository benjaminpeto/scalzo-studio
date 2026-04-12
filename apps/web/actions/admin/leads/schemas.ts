import { z } from "zod";

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const leadUpdateSchema = z.object({
  internalNotes: z.string().max(5000).optional(),
  leadId: z.string().uuid(),
  status: z.enum(LEAD_STATUSES),
});

export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;
