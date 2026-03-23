import { contactPageContent } from "@/lib/content/contact";
import { Button } from "@ui/components/ui/button";

export function BookingPanel() {
  const bookingContent = contactPageContent.booking;

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
        {bookingContent.embedUrl ? (
          <iframe
            src={bookingContent.embedUrl}
            title={bookingContent.frameTitle}
            className="h-128 w-full bg-white"
          />
        ) : (
          <div className="p-6 sm:p-7">
            <div className="rounded-[1.2rem] border border-dashed border-white/14 bg-black/18 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/52">
                Booking embed ready
              </p>
              <p className="mt-3 font-display text-[1.8rem] leading-none tracking-[-0.04em] text-white">
                This section can host a Cal.com or Calendly embed once the
                provider is chosen.
              </p>
              <p className="mt-4 text-sm leading-6 text-white/68">
                For now, the call route is still available by email so the
                contact page can support both quote requests and
                conversation-led scoping.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {bookingContent.notes.map((note) => (
                <p key={note} className="text-sm leading-6 text-white/72">
                  {note}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <Button
          asChild
          className="h-12 rounded-full bg-primary px-6 text-[0.78rem] uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90"
        >
          <a href={bookingContent.fallbackHref}>
            {bookingContent.fallbackLabel}
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-12 rounded-full border-white/14 bg-transparent px-6 text-[0.78rem] uppercase tracking-[0.2em] text-white hover:bg-white/8"
        >
          <a href="#contact-form">Request a quote instead</a>
        </Button>
      </div>
    </div>
  );
}
