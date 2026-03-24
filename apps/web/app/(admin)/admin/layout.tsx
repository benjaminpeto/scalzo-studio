import { connection } from "next/server";
import { Suspense } from "react";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import { AdminShell } from "@/components/admin/admin-shell";

async function AdminShellBoundary({ children }: { children: React.ReactNode }) {
  await connection();

  const { user } = await requireCurrentAdminAccess("/admin");

  return <AdminShell userEmail={user.email}>{children}</AdminShell>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <AdminShellBoundary>{children}</AdminShellBoundary>
    </Suspense>
  );
}
