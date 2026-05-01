import { getContactPublicContent } from "@/constants/contact/public-content";
import { bookingProviderConfig } from "@/lib/booking/config";
import { Button } from "@ui/components/ui/button";

import { CalBookingEmbed } from "./cal-booking-embed";

export function BookingPanel({ locale = "en" }: { locale?: string }) {
  const bookingContent = getContactPublicContent(locale).booking;
  const bookingHref =
    bookingProviderConfig.bookingUrl ??
    "mailto:hello@scalzostudio.com?subject=Discovery%20call%20request";
  const bookingLabel = bookingProviderConfig.bookingUrl
    ? bookingContent.ctaPrimaryLabel
    : bookingContent.fallbackLabel;

  return (
    <div
      id="booking"
      className="surface-grain rounded-4xl border border-white/12 bg-[#111311] p-6 text-white shadow-[0_28px_70px_rgba(0,0,0,0.22)] sm:p-8 lg:sticky lg:top-24"
    >
      <p className="section-kicker text-white/58">{bookingContent.kicker}</p>
      <h3 className="mt-4 font-display text-[2.2rem] leading-[0.96] tracking-[-0.05em] text-white sm:text-[2.9rem]">
        {bookingContent.title}
      </h3>
      <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
        {bookingContent.intro}
      </p>

      <div className="mt-7 overflow-hidden rounded-[1.6rem] border border-white/12 bg-white/6">
        <CalBookingEmbed bookingConfig={bookingProviderConfig} />
      </div>

      <div className="mt-6 space-y-3">
        {bookingContent.notes.map((note) => (
          <p key={note} className="text-sm leading-6 text-white/72">
            {note}
          </p>
        ))}
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <Button
          asChild
          className="h-12 rounded-full bg-primary px-6 text-[0.78rem] uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90"
        >
          <a href={bookingHref}>{bookingLabel}</a>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-12 rounded-full border-white/14 bg-transparent px-6 text-[0.78rem] uppercase tracking-[0.2em] text-white hover:bg-white/8"
        >
          <a href="#contact-form">{bookingContent.ctaSecondaryLabel}</a>
        </Button>
      </div>
    </div>
  );
}
