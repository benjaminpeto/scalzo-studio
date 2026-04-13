begin;

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null check (
    bucket_id in ('case-study-images', 'blog-images', 'testimonial-avatars')
  ),
  object_path text not null,
  public_url text not null unique,
  kind text not null,
  alt_text text,
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  blur_data_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket_id, object_path)
);

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_media_assets') then
    create trigger set_updated_at_media_assets before update on public.media_assets
    for each row execute procedure public.set_updated_at();
  end if;
end $$;

alter table public.media_assets enable row level security;

create policy "media_assets_public_read" on public.media_assets
for select using (true);

create policy "media_assets_admin_full_access" on public.media_assets
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create index if not exists idx_media_assets_kind on public.media_assets (kind);

comment on table public.media_assets is
  'Metadata for public CMS-managed images used to preserve alt text, dimensions, and placeholders across public routes.';

comment on column public.media_assets.kind is
  'Managed image type: case-study cover/gallery, insight cover/content, or testimonial avatar.';

commit;
