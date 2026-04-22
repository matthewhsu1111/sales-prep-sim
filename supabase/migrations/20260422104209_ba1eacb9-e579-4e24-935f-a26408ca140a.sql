-- Add star columns to user_progress
ALTER TABLE public.user_progress
  ADD COLUMN IF NOT EXISTS total_stars integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS weekly_stars integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS daily_stars integer NOT NULL DEFAULT 0;

-- Backfill stars from existing XP so current users keep their progress
UPDATE public.user_progress
SET total_stars = COALESCE(total_xp, 0),
    weekly_stars = COALESCE(weekly_xp, 0),
    daily_stars = COALESCE(daily_xp, 0)
WHERE total_stars = 0 AND weekly_stars = 0 AND daily_stars = 0;

-- All-time leaderboard view (mirrors weekly_leaderboard structure)
DROP VIEW IF EXISTS public.all_time_leaderboard;
CREATE VIEW public.all_time_leaderboard
WITH (security_invoker = true)
AS
SELECT
  up.user_id,
  p.name,
  p.first_name,
  up.current_level,
  up.current_streak,
  up.total_stars,
  up.leaderboard_visible,
  RANK() OVER (ORDER BY up.total_stars DESC) AS rank
FROM public.user_progress up
LEFT JOIN public.profiles p ON p.user_id = up.user_id
WHERE up.leaderboard_visible = true;

-- Recreate weekly_leaderboard to also expose weekly_stars (additive; keep weekly_xp column for backward compat)
DROP VIEW IF EXISTS public.weekly_leaderboard;
CREATE VIEW public.weekly_leaderboard
WITH (security_invoker = true)
AS
SELECT
  up.user_id,
  p.name,
  p.first_name,
  up.current_level,
  up.current_streak,
  up.weekly_xp,
  up.weekly_stars,
  up.leaderboard_visible,
  RANK() OVER (ORDER BY up.weekly_stars DESC, up.weekly_xp DESC) AS rank
FROM public.user_progress up
LEFT JOIN public.profiles p ON p.user_id = up.user_id
WHERE up.leaderboard_visible = true;

-- Update reset functions to also reset stars
CREATE OR REPLACE FUNCTION public.reset_weekly_xp()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE user_progress
  SET weekly_xp = 0,
      weekly_stars = 0,
      practices_this_week = 0,
      last_weekly_reset = CURRENT_DATE
  WHERE last_weekly_reset < CURRENT_DATE - INTERVAL '7 days';
END;
$function$;

CREATE OR REPLACE FUNCTION public.reset_daily_xp()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE user_progress
  SET daily_xp = 0,
      daily_stars = 0,
      last_daily_reset = CURRENT_DATE
  WHERE last_daily_reset < CURRENT_DATE;
END;
$function$;