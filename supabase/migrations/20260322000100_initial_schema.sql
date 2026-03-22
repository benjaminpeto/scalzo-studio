begin;

-- Scalzo Studio - Supabase schema starter
-- Version: 1.0 (2026-03-01)
--
-- Notes:
-- - Designed for a Next.js marketing site + admin dashboard.
-- - Recommended: route public form submissions (leads/events) through server code using the service role key.
-- - RLS is enabled and only admins can write to content tables.

create extension if not exists "pgcrypto";

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  note text
);

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists(select 1 from public.admins a where a.user_id = uid);
$$;

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  content_md text,
  deliverables text[] default '{}',
  order_index int not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published boolean not null default true
);

create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  client_name text,
  industry text,
  services text[] default '{}',
  challenge text,
  approach text,
  outcomes text,
  outcomes_metrics jsonb default '{}'::jsonb,
  cover_image_url text,
  gallery_urls text[] default '{}',
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published boolean not null default false
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content_md text not null,
  cover_image_url text,
  tags text[] default '{}',
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published boolean not null default false
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  role text,
  quote text not null,
  avatar_url text,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published boolean not null default true
);

create table if not exists public.redirects (
  id uuid primary key default gen_random_uuid(),
  from_path text not null unique,
  to_path text not null,
  status_code int not null default 301,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  email text,
  company text,
  website text,
  services_interest text[] default '{}',
  budget_band text,
  timeline_band text,
  message text,
  source_utm jsonb default '{}'::jsonb,
  page_path text,
  status text not null default 'new',
  internal_notes text
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text,
  user_agent text,
  event_name text not null,
  page_path text,
  referrer text,
  properties jsonb default '{}'::jsonb
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_services') then
    create trigger set_updated_at_services before update on public.services
    for each row execute procedure public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_case_studies') then
    create trigger set_updated_at_case_studies before update on public.case_studies
    for each row execute procedure public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_posts') then
    create trigger set_updated_at_posts before update on public.posts
    for each row execute procedure public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_testimonials') then
    create trigger set_updated_at_testimonials before update on public.testimonials
    for each row execute procedure public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_redirects') then
    create trigger set_updated_at_redirects before update on public.redirects
    for each row execute procedure public.set_updated_at();
  end if;
end $$;

alter table public.admins enable row level security;
alter table public.services enable row level security;
alter table public.case_studies enable row level security;
alter table public.posts enable row level security;
alter table public.testimonials enable row level security;
alter table public.redirects enable row level security;
alter table public.leads enable row level security;
alter table public.events enable row level security;

create policy "admins_select_admin_only" on public.admins
for select using (public.is_admin(auth.uid()));

create policy "admins_modify_admin_only" on public.admins
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "services_public_read" on public.services
for select using (published = true);

create policy "services_admin_full_access" on public.services
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "case_studies_public_read" on public.case_studies
for select using (published = true);

create policy "case_studies_admin_full_access" on public.case_studies
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "posts_public_read" on public.posts
for select using (published = true);

create policy "posts_admin_full_access" on public.posts
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "testimonials_public_read" on public.testimonials
for select using (published = true);

create policy "testimonials_admin_full_access" on public.testimonials
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "redirects_admin_only" on public.redirects
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "leads_admin_only" on public.leads
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "events_admin_only" on public.events
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create index if not exists idx_posts_published_at on public.posts (published_at desc);
create index if not exists idx_case_studies_published_at on public.case_studies (published_at desc);
create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_events_created_at on public.events (created_at desc);

commit;
