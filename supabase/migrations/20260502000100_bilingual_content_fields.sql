-- Add nullable Spanish-language columns to all public content tables.
-- English values remain in existing columns (no data migration required).
-- All new columns default to null; the application falls back to English when null.

alter table public.services
  add column if not exists title_es        text,
  add column if not exists summary_es      text,
  add column if not exists content_md_es   text,
  add column if not exists seo_title_es    text,
  add column if not exists seo_description_es text;

alter table public.case_studies
  add column if not exists title_es           text,
  add column if not exists challenge_es       text,
  add column if not exists approach_es        text,
  add column if not exists outcomes_es        text,
  add column if not exists seo_title_es       text,
  add column if not exists seo_description_es text;

alter table public.posts
  add column if not exists title_es           text,
  add column if not exists excerpt_es         text,
  add column if not exists content_md_es      text,
  add column if not exists seo_title_es       text,
  add column if not exists seo_description_es text;

alter table public.testimonials
  add column if not exists quote_es text,
  add column if not exists role_es  text;
