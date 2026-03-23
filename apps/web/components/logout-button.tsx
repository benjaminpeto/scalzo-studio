"use client";

import { signOutCurrentUser } from "@/actions/auth/client";
import { cn } from "@/lib/utils";
import { Button } from "@ui/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LogoutButtonProps {
  className?: string;
  label?: string;
  message?: string;
  redirectPath?: string;
  size?: React.ComponentProps<typeof Button>["size"];
  variant?: React.ComponentProps<typeof Button>["variant"];
}

export function LogoutButton({
  className,
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
      className={cn(className)}
      disabled={isLoading}
      onClick={logout}
      size={size}
      variant={variant}
    >
      {isLoading ? "Signing out..." : label}
    </Button>
  );
}
