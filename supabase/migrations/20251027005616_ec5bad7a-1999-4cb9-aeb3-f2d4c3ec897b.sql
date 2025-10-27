-- Drop and recreate the view without SECURITY DEFINER
DROP VIEW IF EXISTS weekly_leaderboard;

CREATE VIEW weekly_leaderboard AS
SELECT 
  up.user_id,
  p.first_name,
  p.name,
  up.weekly_xp,
  up.current_level,
  up.current_streak,
  ROW_NUMBER() OVER (ORDER BY up.weekly_xp DESC) as rank
FROM user_progress up
JOIN profiles p ON p.user_id = up.user_id
WHERE up.leaderboard_visible = true
ORDER BY up.weekly_xp DESC
LIMIT 50;