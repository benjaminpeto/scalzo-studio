import { AuthButton } from "@/components/auth-button";
import Link from "next/link";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-6">
        <nav className="flex items-center justify-between border-b pb-4">
          <Link href="/" className="text-sm font-semibold">
            Auth app
          </Link>
          <Suspense>
            <AuthButton />
          </Suspense>
        </nav>
        <div className="flex-1 py-10">
          <Suspense>{children}</Suspense>
        </div>
      </div>
    </main>
  );
}
