begin;

alter table public.newsletter_subscribers
  drop constraint if exists newsletter_subscribers_placement_check;

alter table public.newsletter_subscribers
  add constraint newsletter_subscribers_placement_check
  check (
    placement in (
      'home',
      'insights-index',
      'insights-detail',
      'footer',
      'contact'
    )
  );

commit;
