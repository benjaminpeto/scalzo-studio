import "server-only";

import { headers } from "next/headers";
import { z } from "zod";

import { serverEnv } from "@/lib/env/server";

const HCAPTCHA_VERIFY_URL = "https://api.hcaptcha.com/siteverify";

const hcaptchaVerificationSchema = z.object({
  success: z.boolean().optional().default(false),
  challenge_ts: z.string().optional(),
  hostname: z.string().optional(),
  "error-codes": z.array(z.string()).optional(),
});

function readClientIp(requestHeaders: Headers) {
  const forwardedFor = requestHeaders.get("x-forwarded-for");

  if (forwardedFor) {
    const [firstAddress] = forwardedFor.split(",");
    return firstAddress?.trim() || null;
  }

  return (
    requestHeaders.get("cf-connecting-ip") ??
    requestHeaders.get("x-real-ip") ??
    null
  );
}

export async function verifyHCaptchaToken(token: string) {
  const requestHeaders = await headers();
  const remoteIp = readClientIp(requestHeaders);
  const body = new URLSearchParams({
    response: token,
    secret: serverEnv.hcaptchaSecretKey ?? "",
  });

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  const response = await fetch(HCAPTCHA_VERIFY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `hCaptcha verification failed with status ${response.status}`,
    );
  }

  const payload = hcaptchaVerificationSchema.parse(await response.json());

  return {
    challengeTimestamp: payload.challenge_ts ?? null,
    errorCodes: payload["error-codes"] ?? [],
    hasHostname: Boolean(payload.hostname),
    hasRemoteIp: Boolean(remoteIp),
    hasUserAgent: Boolean(requestHeaders.get("user-agent")),
    success: payload.success,
  };
}
