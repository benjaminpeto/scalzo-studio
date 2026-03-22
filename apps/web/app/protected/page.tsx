import { redirect } from "next/navigation";

import { getCurrentUserAdminState } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function UserDetails() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return JSON.stringify(data.claims, null, 2);
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
