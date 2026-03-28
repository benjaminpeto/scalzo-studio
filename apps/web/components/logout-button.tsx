"use client";

import { signOutCurrentUser } from "@/actions/auth/client";
import type { LogoutButtonProps } from "@/interfaces/auth/logout-button";
import { cn } from "@/lib/utils";
import { Button } from "@ui/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton({
  ariaLabel,
  className,
  hideLabel = false,
  icon,
  label = "Logout",
  message = "You have been signed out.",
  redirectPath = "/auth/login",
  size,
  variant,
}: LogoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);

    try {
      await signOutCurrentUser();
      router.push(`${redirectPath}?message=${encodeURIComponent(message)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      aria-label={ariaLabel ?? label}
      className={cn(className)}
      disabled={isLoading}
      onClick={logout}
      size={size}
      variant={variant}
    >
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      {hideLabel ? null : isLoading ? "Signing out..." : label}
    </Button>
  );
}
