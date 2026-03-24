import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { requireCurrentAdminAccess } from "@/actions/admin/server";

function getSafeExitPath(input: string | null) {
  if (!input) {
    return "/admin/work";
  }

  if (input === "/admin/work" || input === "/admin/insights") {
    return input;
  }

  if (/^\/work\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input)) {
    return input;
  }

  if (/^\/insights\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input)) {
    return input;
  }

  return "/admin/work";
}

export async function GET(request: NextRequest) {
  const nextPath = getSafeExitPath(request.nextUrl.searchParams.get("next"));

  await requireCurrentAdminAccess(nextPath);

  const preview = await draftMode();
  preview.disable();

  return NextResponse.redirect(new URL(nextPath, request.url));
}
