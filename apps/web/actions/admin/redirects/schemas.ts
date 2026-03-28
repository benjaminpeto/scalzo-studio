import { z } from "zod";

const returnQuerySchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : ""),
  z.string().max(200),
);

export const statusCodeFilterSchema = z.enum(["all", "301", "302"]);
export const redirectStatusCodeSchema = z.enum(["301", "302"]);

export const deleteActionSchema = z.object({
  confirmDelete: z.literal("true"),
  redirectId: z.string().uuid(),
});

export const redirectListActionSchema = z.object({
  redirectId: z.string().uuid(),
  statusCodeFilter: statusCodeFilterSchema,
  searchQuery: returnQuerySchema,
});

const pathSchema = z
  .string()
  .trim()
  .min(1, "Enter a path.")
  .max(2048, "Keep the path under 2048 characters.");

export const redirectEditorSchema = z.object({
  fromPath: pathSchema,
  statusCode: redirectStatusCodeSchema,
  toPath: pathSchema,
});

export const redirectUpdateSchema = redirectEditorSchema.extend({
  redirectId: z.string().uuid(),
});

export type RedirectEditorInput = z.infer<typeof redirectEditorSchema>;
export type RedirectUpdateInput = z.infer<typeof redirectUpdateSchema>;
