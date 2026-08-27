-- =====================================================================
-- Migration 003: Triggers and Performance Indexes
-- =====================================================================

-- 1. Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 2. Triggers for updated_at
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

drop trigger if exists set_advisories_updated_at on public.advisories;
create trigger set_advisories_updated_at
  before update on public.advisories
  for each row
  execute function public.handle_updated_at();

-- 3. Automatic Profile Creation on Supabase Auth Sign Up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, created_at, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    now(),
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. High-Performance Indexes
create index if not exists advisories_user_id_idx
  on public.advisories(user_id);

create index if not exists advisories_created_at_idx
  on public.advisories(created_at desc);

create index if not exists advisories_crop_name_idx
  on public.advisories(crop_name);

create index if not exists advisories_category_idx
  on public.advisories(category);
