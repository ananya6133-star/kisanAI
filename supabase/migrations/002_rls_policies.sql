-- =====================================================================
-- Migration 002: Row Level Security (RLS) Policies
-- =====================================================================

-- Enable RLS on profiles and advisories
alter table public.profiles enable row level security;
alter table public.advisories enable row level security;

-- ---------------------------------------------------------------------
-- Profiles Policies
-- ---------------------------------------------------------------------
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------
-- Advisories Policies (Strict User Isolation)
-- ---------------------------------------------------------------------
drop policy if exists "Users can view own advisories" on public.advisories;
create policy "Users can view own advisories"
  on public.advisories
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own advisories" on public.advisories;
create policy "Users can insert own advisories"
  on public.advisories
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own advisories" on public.advisories;
create policy "Users can update own advisories"
  on public.advisories
  for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own advisories" on public.advisories;
create policy "Users can delete own advisories"
  on public.advisories
  for delete
  using (auth.uid() = user_id);
