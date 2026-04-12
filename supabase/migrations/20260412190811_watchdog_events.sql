begin;

create table if not exists public.watchdog_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null,
  status text not null,
  reason text not null,
  context jsonb not null default '{}'::jsonb,
  constraint watchdog_events_source_check
    check (source in ('quote_request', 'newsletter_signup')),
  constraint watchdog_events_status_check
    check (status in ('success', 'error'))
);

alter table public.watchdog_events enable row level security;

create policy "watchdog_events_admin_only" on public.watchdog_events
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create index if not exists idx_watchdog_events_source_created_at
  on public.watchdog_events (source, created_at desc);

commit;
