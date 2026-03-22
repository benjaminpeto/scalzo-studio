import { AuthButton } from "@/components/auth-button";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xs">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            Authentication
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Supabase auth starter
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in, create an account, reset a password, or continue to the
            protected area once you have a session.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-4">
          <Suspense>
            <AuthButton />
          </Suspense>
          <Link
            href="/protected"
            className="text-sm text-muted-foreground underline underline-offset-4"
          >
            Go to protected page
          </Link>
        </div>
      </div>
    </main>
  );
}
