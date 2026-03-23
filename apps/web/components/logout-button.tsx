"use client";

import { signOutCurrentUser } from "@/actions/auth/client";
import { Button } from "@ui/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await signOutCurrentUser();
    router.push("/auth/login");
  };

  return <Button onClick={logout}>Logout</Button>;
}
