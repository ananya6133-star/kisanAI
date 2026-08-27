-- =====================================================================
-- Migration 001: Initial Schema for Crop Advisory Assistant
-- =====================================================================

-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Linked with Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  farm_location text,
  preferred_language text default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Advisories Table
create table if not exists public.advisories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

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

-- Add Constraints
alter table public.advisories
  drop constraint if exists soil_ph_range;

alter table public.advisories
  add constraint soil_ph_range
  check (
    soil_ph is null
    or (soil_ph >= 0 and soil_ph <= 14)
  );

alter table public.advisories
  drop constraint if exists farm_area_positive;

alter table public.advisories
  add constraint farm_area_positive
  check (
    farm_area is null
    or farm_area > 0
  );
