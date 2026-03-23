import { LoginForm } from "@/components/login-form";
import { Button } from "@ui/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="min-h-svh px-6 py-10 md:px-10">
      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_26rem]">
        <section className="rounded-[2rem] border border-border/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.7),rgba(245,244,240,0.92))] p-8 shadow-[0_28px_90px_rgba(27,28,26,0.08)] backdrop-blur md:p-10">
          <div className="max-w-2xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Admin access
            </p>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground md:text-5xl">
                Sign in to the studio control room.
              </h1>
              <p className="max-w-xl text-base leading-8 text-muted-foreground">
                This login is restricted to manually provisioned admin accounts.
                Use your password or request a magic link, then land directly in
                the internal dashboard.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-border/70 bg-surface-container-lowest/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Access model
                </p>
                <p className="mt-3 text-sm leading-7 text-foreground">
                  Only pre-approved auth users with membership in{" "}
                  <code>public.admins</code> can continue beyond login.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-border/70 bg-surface-container-lowest/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Session flow
                </p>
                <p className="mt-3 text-sm leading-7 text-foreground">
                  Successful sign-in continues to <code>/admin</code>, and
                  non-admin sessions are rejected at both proxy and server
                  render time.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="/">Return to site</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/auth/error">Auth help</Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="w-full">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
