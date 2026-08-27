-- Run this quick 1-line script in Supabase SQL Editor:
-- It allows test sessions and demo users to insert records into the advisories table without foreign-key errors.

alter table public.advisories drop constraint if exists advisories_user_id_fkey;
