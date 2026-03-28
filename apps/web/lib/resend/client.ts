import "server-only";

import {
  Resend,
  type CreateContactOptions,
  type CreateEmailOptions,
  type UpdateContactOptions,
  type UpdateContactTopicsOptions,
} from "resend";

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

export class ResendContactError extends Error {
  code: string;
  statusCode: number | null;

  constructor(input: {
    code: string;
    message: string;
    statusCode: number | null;
  }) {
    super(input.message);

    this.name = "ResendContactError";
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

export async function getResendContactByEmail(email: string) {
  const response = await getResendClient().contacts.get({ email });

  if (response.error) {
    if (response.error.name === "not_found") {
      return null;
    }

    throw new ResendContactError({
      code: response.error.name,
      message: response.error.message,
      statusCode: response.error.statusCode,
    });
  }

  return response.data;
}

export async function createResendContact(payload: CreateContactOptions) {
  const response = await getResendClient().contacts.create(payload);

  if (response.error) {
    throw new ResendContactError({
      code: response.error.name,
      message: response.error.message,
      statusCode: response.error.statusCode,
    });
  }

  return response.data;
}

export async function updateResendContact(payload: UpdateContactOptions) {
  const response = await getResendClient().contacts.update(payload);

  if (response.error) {
    throw new ResendContactError({
      code: response.error.name,
      message: response.error.message,
      statusCode: response.error.statusCode,
    });
  }

  return response.data;
}

export async function updateResendContactTopics(
  payload: UpdateContactTopicsOptions,
) {
  const response = await getResendClient().contacts.topics.update(payload);

  if (response.error) {
    throw new ResendContactError({
      code: response.error.name,
      message: response.error.message,
      statusCode: response.error.statusCode,
    });
  }

  return response.data;
}

export async function createOrUpdateResendContactWithTopic(input: {
  email: string;
  pagePath: string;
  placement: string;
  topicId: string;
}) {
  const existingContact = await getResendContactByEmail(input.email);

  if (!existingContact) {
    const createdContact = await createResendContact({
      email: input.email,
      properties: {
        latest_page_path: input.pagePath,
        latest_placement: input.placement,
      },
      topics: [
        {
          id: input.topicId,
          subscription: "opt_in",
        },
      ],
      unsubscribed: false,
    });

    return createdContact.id;
  }

  await updateResendContact({
    email: input.email,
    properties: {
      latest_page_path: input.pagePath,
      latest_placement: input.placement,
    },
    unsubscribed: false,
  });
  const updatedTopics = await updateResendContactTopics({
    email: input.email,
    topics: [
      {
        id: input.topicId,
        subscription: "opt_in",
      },
    ],
  });

  return updatedTopics.id ?? existingContact.id;
}
