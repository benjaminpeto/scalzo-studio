begin;

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text not null,
  status text not null default 'pending',
  placement text not null,
  page_path text not null,
  provider text not null default 'resend',
  provider_contact_id text,
  confirmation_token_hash text,
  confirmation_sent_at timestamptz,
  confirmation_expires_at timestamptz,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  constraint newsletter_subscribers_status_check
    check (status in ('pending', 'confirmed', 'unsubscribed')),
  constraint newsletter_subscribers_placement_check
    check (placement in ('home', 'insights-index', 'insights-detail', 'footer')),
  constraint newsletter_subscribers_provider_check
    check (provider in ('resend'))
);

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'set_updated_at_newsletter_subscribers'
  ) then
    create trigger set_updated_at_newsletter_subscribers
    before update on public.newsletter_subscribers
    for each row execute procedure public.set_updated_at();
  end if;
end $$;

alter table public.newsletter_subscribers enable row level security;

create policy "newsletter_subscribers_admin_only" on public.newsletter_subscribers
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create unique index if not exists idx_newsletter_subscribers_email_lower
  on public.newsletter_subscribers (lower(email));

create index if not exists idx_newsletter_subscribers_created_at
  on public.newsletter_subscribers (created_at desc);

commit;
