export const AUTH_DEFAULT_REDIRECT_PATH = "/admin";

export const ADMIN_AUTH_ACCESS_DENIED_MESSAGE =
  "This account is authenticated but does not have admin access.";

export const SELF_SERVICE_SIGN_UP_DISABLED_MESSAGE =
  "Self-service sign-up is disabled. Access is provisioned manually.";

export function normalizeAuthRedirectPath(
  next: string | null | undefined,
  fallback = AUTH_DEFAULT_REDIRECT_PATH,
) {
  if (!next) {
    return fallback;
  }

  if (!next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }

  return next;
}

export function buildAuthConfirmUrl(origin: string, next?: string | null) {
  const redirectPath = normalizeAuthRedirectPath(next);
  const confirmUrl = new URL("/auth/confirm", origin);

  confirmUrl.searchParams.set("next", redirectPath);

  return confirmUrl.toString();
}

export function buildPasswordUpdateUrl(origin: string) {
  return new URL("/auth/update-password", origin).toString();
}
