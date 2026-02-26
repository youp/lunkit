-- Add app store / play store URL columns
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS app_store_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS play_store_url TEXT;
