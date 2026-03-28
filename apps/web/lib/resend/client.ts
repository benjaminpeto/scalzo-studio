import "server-only";

import { Resend, type CreateEmailOptions } from "resend";

import { serverEnv } from "@/lib/env/server";

export class ResendSendError extends Error {
  code: string;
  statusCode: number | null;

  constructor(input: {
    code: string;
    message: string;
    statusCode: number | null;
  }) {
    super(input.message);

    this.name = "ResendSendError";
    this.code = input.code;
    this.statusCode = input.statusCode;
  }
}

let resendClient: Resend | null = null;

function getResendClient() {
  if (!serverEnv.resendApiKey) {
    throw new Error(
      "Resend is not configured. Set RESEND_API_KEY before sending email.",
    );
  }

  resendClient ??= new Resend(serverEnv.resendApiKey);

  return resendClient;
}

export async function sendResendEmail(payload: CreateEmailOptions) {
  const response = await getResendClient().emails.send(payload);

  if (response.error) {
    throw new ResendSendError({
      code: response.error.name,
      message: response.error.message,
      statusCode: response.error.statusCode,
    });
  }

  return response.data;
}
