# Cal.com Setup

This guide covers the production-safe setup for the embedded Cal.com discovery-call flow used on `/contact`.

## 1. Create the Cal event type

In Cal.com:

1. Create or choose the event type you want to use for discovery calls.
2. Confirm the event title, duration, availability, and confirmation behavior are final enough for public traffic.
3. Copy the public booking URL for that event type.

Use a full URL such as:

```text
https://cal.eu/scalzostudio/discovery-call
```

## 2. Configure the site environment

Set these variables in [`apps/web/.env.local`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/.env.local) for local work and in Vercel for preview and production:

```env
NEXT_PUBLIC_CAL_BOOKING_URL=https://cal.eu/scalzostudio/discovery-call
CAL_WEBHOOK_SECRET=replace-with-a-random-secret
```

`NEXT_PUBLIC_CAL_BOOKING_URL` powers the inline embed and the direct booking CTA fallback.
`CAL_WEBHOOK_SECRET` is used only on the server to verify webhook authenticity.

## 3. Add the Cal webhook

In Cal.com, open the webhook settings and create a subscriber with:

- Subscriber URL:
  - local tunnel: `https://<your-tunnel-host>/api/webhooks/cal`
  - preview: `https://<preview-domain>/api/webhooks/cal`
  - production: `https://scalzostudio.com/api/webhooks/cal`
- Trigger:
  - `Booking Created`
- Secret:
  - use the exact same value as `CAL_WEBHOOK_SECRET`

Do not enable a custom payload template for this integration. The app expects the standard Cal webhook payload shape.

## 4. Run the app locally

From the repository root:

```bash
npm run dev
```

If you also need local Supabase writes for webhook verification:

```bash
npm run dev:local
```

## 5. Verify the embedded booking flow

Open `/contact` and confirm:

1. The inline Cal.com scheduler renders inside the booking panel.
2. The header CTA, mobile CTA bar, home CTA band, about CTA band, and service detail booking CTA all land on `/contact#booking`.
3. The secondary quote form still works independently.

Complete a booking and confirm the panel swaps into the on-page success state.

## 6. Verify the webhook event write

After a successful booking:

1. Confirm Cal.com sends a signed `BOOKING_CREATED` request to `/api/webhooks/cal`.
2. Inspect the `public.events` table in Supabase.
3. Verify the new row contains:
   - `event_name = booking_complete`
   - `page_path = /contact`
   - `properties.provider = cal.com`
   - `properties.providerTrigger = BOOKING_CREATED`
   - `properties.bookingSurface = contact-inline-embed`
   - `properties.bookingUid`
   - `properties.eventTypeId`
   - `properties.eventTitle`
   - `properties.startTime`
   - `properties.endTime`
   - `properties.status`
   - `properties.webhookVersion`

Verify the row does not store attendee email, attendee name, notes, or video call URLs.

## 7. Preview and production rollout

Before shipping:

1. Add `NEXT_PUBLIC_CAL_BOOKING_URL` and `CAL_WEBHOOK_SECRET` to the matching Vercel environment.
2. Update the Cal webhook subscriber URL so it points at the correct preview or production domain.
3. Run `npm run check`.
4. Smoke-test `/contact` and one booking CTA in the deployed environment.
5. Confirm at least one signed webhook request reaches `/api/webhooks/cal` and creates the expected `booking_complete` event.
