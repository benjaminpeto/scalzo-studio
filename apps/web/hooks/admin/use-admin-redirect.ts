"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";

export function useAdminRedirect(input: {
  redirectTo: string | null;
  status: "idle" | "success" | "error";
}) {
  const router = useRouter();

  useEffect(() => {
    if (input.status !== "success" || !input.redirectTo) {
      return;
    }

    startTransition(() => {
      router.replace(input.redirectTo as string);
    });
  }, [input.redirectTo, input.status, router]);
}
