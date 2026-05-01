import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import { previewRequestSchema } from "../schemas";

export async function GET(request: NextRequest) {
  const parsedRequest = previewRequestSchema.safeParse({
    slug: request.nextUrl.searchParams.get("slug"),
  });

  const fallbackPath = "/admin/insights";
  const nextPath = parsedRequest.success
    ? `/admin/insights/${parsedRequest.data.slug}`
    : fallbackPath;

  await requireCurrentAdminAccess(nextPath);

  if (!parsedRequest.success) {
    return NextResponse.redirect(new URL(fallbackPath, request.url));
  }

  const preview = await draftMode();
  preview.enable();

  return NextResponse.redirect(
    new URL(`/insights/${parsedRequest.data.slug}`, request.url),
  );
}
