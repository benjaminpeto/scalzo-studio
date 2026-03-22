export { cn } from "@ui/lib/utils";

// This check can be removed later. It keeps parity with the starter while
// auth and environment hardening are still being implemented.
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
