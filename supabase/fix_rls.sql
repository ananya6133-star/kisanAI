-- =====================================================================
-- FIX ROW-LEVEL SECURITY (RLS) POLICIES FOR ADVISORIES TABLE
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/npglytizsesbfrbgxvhn/sql/new
-- =====================================================================

-- 1. Remove foreign-key restriction if it exists
alter table public.advisories drop constraint if exists advisories_user_id_fkey;

-- 2. Drop existing restrictive policies on advisories
drop policy if exists "Users can view own advisories" on public.advisories;
drop policy if exists "Users can insert own advisories" on public.advisories;
drop policy if exists "Users can update own advisories" on public.advisories;
drop policy if exists "Users can delete own advisories" on public.advisories;

-- 3. Create permissive policies that allow both logged-in users and demo sessions to insert & read
create policy "Allow all inserts into advisories"
  on public.advisories
  for insert
  with check (true);

create policy "Allow all reads from advisories"
  on public.advisories
  for select
  using (true);

create policy "Allow all updates on advisories"
  on public.advisories
  for update
  using (true);

create policy "Allow all deletes on advisories"
  on public.advisories
  for delete
  using (true);
