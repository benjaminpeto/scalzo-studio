import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireCurrentAdminAccess } from "@/actions/admin/server";

const previewRequestSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export async function GET(request: NextRequest) {
  const parsedRequest = previewRequestSchema.safeParse({
    slug: request.nextUrl.searchParams.get("slug"),
  });

  const fallbackPath = "/admin/work";
  const nextPath = parsedRequest.success
    ? `/admin/work/${parsedRequest.data.slug}`
    : fallbackPath;

  await requireCurrentAdminAccess(nextPath);

  if (!parsedRequest.success) {
    return NextResponse.redirect(new URL(fallbackPath, request.url));
  }

  const preview = await draftMode();
  preview.enable();

  return NextResponse.redirect(
    new URL(`/work/${parsedRequest.data.slug}`, request.url),
  );
}
