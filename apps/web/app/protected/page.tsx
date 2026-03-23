import { redirect } from "next/navigation";

import { ADMIN_AUTH_ACCESS_DENIED_MESSAGE } from "@/lib/supabase/auth-flow";
import { getCurrentUserAdminState } from "@/lib/supabase/auth";
import { connection } from "next/server";

export default async function ProtectedPage() {
  await connection();
  const { errorMessage, isAdmin, user } = await getCurrentUserAdminState();

  if (!user) {
    redirect("/auth/login?next=/protected");
  }

  if (!isAdmin) {
    redirect(
      `/auth/login?error=${encodeURIComponent(
        errorMessage ?? ADMIN_AUTH_ACCESS_DENIED_MESSAGE,
      )}`,
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Protected</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Admin session active
        </h1>
        <p className="text-sm text-muted-foreground">
          This route is only accessible to authenticated admin users.
        </p>
      </div>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Session claims</h2>
        <pre className="max-h-80 overflow-auto rounded-lg border bg-card p-4 text-xs">
          {JSON.stringify(user.claims, null, 2)}
        </pre>
      </div>
      <p className="text-sm text-muted-foreground">
        {isAdmin
          ? "This account is registered in public.admins."
          : (errorMessage ?? "This account does not have admin access.")}
      </p>
    </div>
  );
}
