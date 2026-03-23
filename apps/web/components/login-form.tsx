"use client";

import {
  requestAdminMagicLink,
  signInAdminWithPassword,
} from "@/actions/auth/client";
import { normalizeAuthRedirectPath } from "@/lib/supabase/auth-flow";
import { cn } from "@/lib/utils";
import { Button } from "@ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { Input } from "@ui/components/ui/input";
import { Label } from "@ui/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = normalizeAuthRedirectPath(searchParams.get("next"));
  const authError = searchParams.get("error");
  const authMessage = searchParams.get("message");
  const isBusy = isLoading || isMagicLinkLoading;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError("Enter both your email and password.");
      setSuccessMessage(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await signInAdminWithPassword({
        email,
        password,
      });
      router.replace(next);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkLogin = async () => {
    if (!email.trim()) {
      setError("Enter your email to request a magic link.");
      setSuccessMessage(null);
      return;
    }

    setIsMagicLinkLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await requestAdminMagicLink({
        email,
        next,
        origin: window.location.origin,
      });

      setSuccessMessage(
        "Magic link sent. Use the email link to continue with admin sign-in.",
      );
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsMagicLinkLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Admin login</CardTitle>
          <CardDescription>
            Sign in with your password or request a magic link for your admin
            account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  aria-invalid={Boolean(error || authError)}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  aria-invalid={Boolean(error || authError)}
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error ? (
                <p className="text-sm text-red-500" role="alert">
                  {error}
                </p>
              ) : authError ? (
                <p className="text-sm text-red-500" role="alert">
                  {authError}
                </p>
              ) : null}
              {successMessage ? (
                <p className="text-sm text-emerald-700" role="status">
                  {successMessage}
                </p>
              ) : null}
              {!successMessage && authMessage ? (
                <p className="text-sm text-emerald-700" role="status">
                  {authMessage}
                </p>
              ) : null}
              <div className="rounded-2xl border border-border/70 bg-surface-container-low px-4 py-3 text-sm text-muted-foreground">
                After sign-in you will continue to{" "}
                <code className="font-semibold text-foreground">{next}</code>.
              </div>
              <Button type="submit" className="w-full" disabled={isBusy}>
                {isLoading ? "Logging in..." : "Log in with password"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isBusy}
                onClick={handleMagicLinkLogin}
              >
                {isMagicLinkLoading
                  ? "Sending magic link..."
                  : "Send magic link"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm leading-6">
              Access is provisioned manually. Contact an existing admin if you
              need an account.
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
