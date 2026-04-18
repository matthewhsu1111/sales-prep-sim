-- Recreate weekly_leaderboard view to include leaderboard_visible flag
-- so we can show opted-out users as 'Anonymous' on the client.
DROP VIEW IF EXISTS public.weekly_leaderboard;

CREATE VIEW public.weekly_leaderboard
WITH (security_invoker = true)
AS
SELECT
  up.user_id,
  p.first_name,
  p.name,
  up.weekly_xp,
  up.current_level,
  up.current_streak,
  COALESCE(up.leaderboard_visible, true) AS leaderboard_visible,
  RANK() OVER (ORDER BY up.weekly_xp DESC NULLS LAST) AS rank
FROM public.user_progress up
LEFT JOIN public.profiles p ON p.user_id = up.user_id
WHERE COALESCE(up.weekly_xp, 0) > 0;