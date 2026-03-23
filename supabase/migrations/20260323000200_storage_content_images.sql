begin;

create or replace function public.is_content_image_bucket(bucket_id text)
returns boolean
language sql
stable
as $$
  select bucket_id in ('case-study-images', 'blog-images');
$$;

create or replace function public.is_valid_content_image_path(
  bucket_id text,
  object_name text
)
returns boolean
language sql
stable
as $$
  select case
    when bucket_id = 'case-study-images' then
      object_name ~ '^[a-z0-9]+(?:-[a-z0-9]+)*/(cover|gallery)/[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?\.(?:avif|jpe?g|png|webp)$'
    when bucket_id = 'blog-images' then
      object_name ~ '^[a-z0-9]+(?:-[a-z0-9]+)*/(cover|content)/[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?\.(?:avif|jpe?g|png|webp)$'
    else
      false
  end;
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'case-study-images',
    'case-study-images',
    true,
    10485760,
    array['image/avif', 'image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'blog-images',
    'blog-images',
    true,
    10485760,
    array['image/avif', 'image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "content_image_objects_public_read" on storage.objects;
create policy "content_image_objects_public_read" on storage.objects
for select
to public
using (
  public.is_content_image_bucket(bucket_id)
  and public.is_valid_content_image_path(bucket_id, name)
);

drop policy if exists "content_image_objects_admin_insert" on storage.objects;
create policy "content_image_objects_admin_insert" on storage.objects
for insert
to authenticated
with check (
  public.is_admin(auth.uid())
  and public.is_content_image_bucket(bucket_id)
  and public.is_valid_content_image_path(bucket_id, name)
);

drop policy if exists "content_image_objects_admin_update" on storage.objects;
create policy "content_image_objects_admin_update" on storage.objects
for update
to authenticated
using (
  public.is_admin(auth.uid())
  and public.is_content_image_bucket(bucket_id)
  and public.is_valid_content_image_path(bucket_id, name)
)
with check (
  public.is_admin(auth.uid())
  and public.is_content_image_bucket(bucket_id)
  and public.is_valid_content_image_path(bucket_id, name)
);

drop policy if exists "content_image_objects_admin_delete" on storage.objects;
create policy "content_image_objects_admin_delete" on storage.objects
for delete
to authenticated
using (
  public.is_admin(auth.uid())
  and public.is_content_image_bucket(bucket_id)
  and public.is_valid_content_image_path(bucket_id, name)
);

comment on function public.is_content_image_bucket(text) is
  'Returns true when a storage bucket is part of the public content image strategy.';

comment on function public.is_valid_content_image_path(text, text) is
  'Validates storage object paths for case study and blog image uploads.';

commit;
