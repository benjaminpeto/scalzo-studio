begin;

create or replace function public.bootstrap_first_admin(
  target_email text,
  admin_note text default 'Initial admin'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_email text;
  resolved_user_id uuid;
  resolved_note text;
begin
  normalized_email := lower(trim(target_email));

  if normalized_email is null or normalized_email = '' then
    raise exception 'bootstrap_first_admin requires a non-empty email address';
  end if;

  if exists (select 1 from public.admins) then
    raise exception 'bootstrap_first_admin can only be used when no admins exist yet';
  end if;

  select u.id
  into resolved_user_id
  from auth.users as u
  where lower(u.email) = normalized_email
  order by u.created_at asc
  limit 1;

  if resolved_user_id is null then
    raise exception 'No auth user found for email: %', normalized_email;
  end if;

  resolved_note := nullif(trim(admin_note), '');

  insert into public.admins (user_id, note)
  values (resolved_user_id, coalesce(resolved_note, 'Initial admin'));

  return resolved_user_id;
end;
$$;

revoke all on function public.bootstrap_first_admin(text, text) from public;
revoke all on function public.bootstrap_first_admin(text, text) from anon;
revoke all on function public.bootstrap_first_admin(text, text) from authenticated;

comment on function public.bootstrap_first_admin(text, text) is
  'Bootstrap helper for the first admin only. Execute from privileged SQL/CLI context after the auth user exists.';

drop policy if exists "admins_select_admin_only" on public.admins;

create policy "admins_select_self_or_admin" on public.admins
for select
to authenticated
using (auth.uid() = user_id);

commit;
