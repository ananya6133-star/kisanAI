-- =====================================================================
-- KISANAI COMPLETE SUPABASE DATABASE SETUP SCRIPT
-- Paste this entire file into your Supabase SQL Editor and click RUN.
-- =====================================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Profiles Table (Linked with Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  farm_location text,
  preferred_language text default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Advisories Table
create table if not exists public.advisories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default 'a0000000-0000-0000-0000-000000000001',

  -- Farm & Crop Basics
  crop_name text not null,
  category text not null,
  farm_area numeric,
  area_unit text default 'acres',

  -- Soil & Water
  soil_type text,
  soil_ph numeric,
  irrigation_available boolean default false,
  water_source text,

  -- Environmental & Practice Context
  location text,
  season text,
  previous_crop text,
  farming_method text,
  growth_stage text,

  -- Health, Symptoms & Inputs
  pest_symptoms text,
  disease_symptoms text,
  fertilizer_information text,
  additional_information text,

  -- Structured Payloads
  request_payload jsonb not null,
  advisory_result jsonb not null,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Constraints
alter table public.advisories drop constraint if exists soil_ph_range;
alter table public.advisories add constraint soil_ph_range check (soil_ph is null or (soil_ph >= 0 and soil_ph <= 14));

alter table public.advisories drop constraint if exists farm_area_positive;
alter table public.advisories add constraint farm_area_positive check (farm_area is null or farm_area > 0);

-- 5. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.advisories enable row level security;

-- 6. RLS Policies for Profiles
drop policy if exists "Allow all on profiles" on public.profiles;
create policy "Allow all on profiles" on public.profiles for all using (true) with check (true);

-- 7. Permissive RLS Policies for Advisories (Allows both logged in and demo users)
drop policy if exists "Allow all inserts into advisories" on public.advisories;
create policy "Allow all inserts into advisories" on public.advisories for insert with check (true);

drop policy if exists "Allow all reads from advisories" on public.advisories;
create policy "Allow all reads from advisories" on public.advisories for select using (true);

drop policy if exists "Allow all updates on advisories" on public.advisories;
create policy "Allow all updates on advisories" on public.advisories for update using (true);

drop policy if exists "Allow all deletes on advisories" on public.advisories;
create policy "Allow all deletes on advisories" on public.advisories for delete using (true);

-- 8. Functions and Triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

drop trigger if exists set_advisories_updated_at on public.advisories;
create trigger set_advisories_updated_at
  before update on public.advisories
  for each row execute function public.handle_updated_at();

-- 9. Performance Indexes
create index if not exists advisories_user_id_idx on public.advisories(user_id);
create index if not exists advisories_created_at_idx on public.advisories(created_at desc);
create index if not exists advisories_crop_name_idx on public.advisories(crop_name);
create index if not exists advisories_category_idx on public.advisories(category);
