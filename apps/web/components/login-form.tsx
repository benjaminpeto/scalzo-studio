"use client";

import type { LoginFormProps } from "@/interfaces/auth/login-form";
import { useLoginForm } from "@/hooks/auth/use-login-form";
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

export function LoginForm({ className, ...props }: LoginFormProps) {
  const {
    authError,
    authMessage,
    email,
    error,
    handleLogin,
    handleMagicLinkLogin,
    isBusy,
    isLoading,
    isMagicLinkLoading,
    next,
    password,
    setEmail,
    setPassword,
    successMessage,
  } = useLoginForm();

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
