import type { contactFieldStepMap } from "@/constants/contact/content";
import { BookingProviderConfig } from "@/lib/booking/config";

export type ContactFieldName = keyof typeof contactFieldStepMap;

export interface SubmitQuoteRequestState {
  status: "idle" | "error" | "success";
  message: string | null;
  captchaError?: string | null;
  fieldErrors: Partial<Record<ContactFieldName, string>>;
}

export interface CalBookingEmbedProps {
  bookingConfig: BookingProviderConfig;
}

export interface BookingSuccessData {
  endTime?: string;
  startTime?: string;
  status?: string;
  title?: string;
  uid?: string;
}

export interface BookingSuccessEvent {
  detail?: {
    data?: BookingSuccessData;
  };
}
