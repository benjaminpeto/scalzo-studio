import { redirect } from "next/navigation";

import { Suspense } from "react";
import { getCurrentUser, getCurrentUserAdminState } from "@/lib/supabase/auth";

async function UserDetails() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return JSON.stringify(user.claims, null, 2);
}

export default function ProtectedPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Protected</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          You are signed in
        </h1>
        <p className="text-sm text-muted-foreground">
          This route is only accessible with an authenticated session.
        </p>
      </div>
      <div className="space-y-3">
        <Suspense>
          <AdminStatus />
        </Suspense>
      </div>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Session claims</h2>
        <pre className="max-h-80 overflow-auto rounded-lg border bg-card p-4 text-xs">
          <Suspense>
            <UserDetails />
          </Suspense>
        </pre>
      </div>
    </div>
  );
}

async function AdminStatus() {
  const { isAdmin } = await getCurrentUserAdminState();

  return (
    <>
      <h2 className="text-lg font-semibold">Admin access</h2>
      <p className="text-sm text-muted-foreground">
        {isAdmin
          ? "This account is registered in public.admins."
          : "This account is authenticated but does not have admin access yet."}
      </p>
    </>
  );
}
