# Vercel Deployment Setup

This project is deployed as a Git-connected Vercel project.

## Project settings

Configure the Vercel project with:

- Framework Preset: `Next.js`
- Root Directory: `apps/web`
- Node.js: `20.x`
- Production Branch: `main`
- Install Command: use the default monorepo install behavior
- Build Command: `npm run build`

## Branch and environment rules

- `main` is the only production branch.
- Every non-`main` branch should produce a Preview Deployment.
- Pull requests should be reviewed against the Preview Deployment before merging.
- Use branch-specific Preview environment variables only when a branch needs different third-party credentials or a stable preview URL.

## Environment variable mapping

Set environment variables in all three Vercel environments as needed:

### Production

- `NEXT_PUBLIC_SITE_URL`: live canonical domain, for example `https://scalzostudio.com`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CAL_BOOKING_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_NEWSLETTER_TOPIC_ID`
- `CAL_WEBHOOK_SECRET`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`
- Optional analytics and Turnstile keys

### Preview

- `NEXT_PUBLIC_SITE_URL`: preview or staging domain used for QA
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CAL_BOOKING_URL`
- Optional preview-safe server keys if preview needs forms, auth writes, anti-spam validation, or Resend smoke tests:
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `RESEND_API_KEY`
  - `RESEND_NEWSLETTER_TOPIC_ID`
  - `CAL_WEBHOOK_SECRET`
  - `CONTACT_TO_EMAIL`
  - `CONTACT_FROM_EMAIL`

### Development

- Mirror local values in `apps/web/.env.local`
- Keep `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- Mirror `NEXT_PUBLIC_CAL_BOOKING_URL` and `CAL_WEBHOOK_SECRET` locally when preview or production enables Cal.com booking

## Cache behavior

Static unversioned public assets are configured in
[`apps/web/next.config.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/next.config.ts)
with:

- Browser revalidation via `Cache-Control: public, max-age=0, must-revalidate`
- Edge caching via `Vercel-CDN-Cache-Control: s-maxage=86400, stale-while-revalidate=604800`

This applies to:

- `/placeholders/*`
- `/favicon.ico`
- `/opengraph-image.png`
- `/twitter-image.png`

## Verification

After connecting the project in Vercel:

1. Confirm Preview Deployments appear for pull requests and non-`main` pushes.
2. Confirm merges to `main` create Production Deployments.
3. Inspect response headers on the configured static assets and verify both cache headers are present.
4. If Cal.com booking is enabled, verify the Preview deployment can load the `/contact` embed and receive signed webhooks at `/api/webhooks/cal`.
5. Run `npm run check` before merging any deployment-affecting change.
