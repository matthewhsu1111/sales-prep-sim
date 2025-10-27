-- Add gamification fields to user_progress table
ALTER TABLE user_progress 
ADD COLUMN total_xp INTEGER DEFAULT 0,
ADD COLUMN current_level INTEGER DEFAULT 1,
ADD COLUMN weekly_xp INTEGER DEFAULT 0,
ADD COLUMN daily_xp INTEGER DEFAULT 0,
ADD COLUMN last_practice_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN last_daily_reset DATE DEFAULT CURRENT_DATE,
ADD COLUMN last_weekly_reset DATE DEFAULT CURRENT_DATE,
ADD COLUMN practices_this_week INTEGER DEFAULT 0,
ADD COLUMN leaderboard_visible BOOLEAN DEFAULT true;

-- Add first_name to profiles for personalized greeting
ALTER TABLE profiles
ADD COLUMN first_name TEXT;

-- Create leaderboard view for weekly rankings
CREATE OR REPLACE VIEW weekly_leaderboard AS
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

-- Create function to reset weekly XP (to be called by a cron job or manually)
CREATE OR REPLACE FUNCTION reset_weekly_xp()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE user_progress
  SET weekly_xp = 0,
      practices_this_week = 0,
      last_weekly_reset = CURRENT_DATE
  WHERE last_weekly_reset < CURRENT_DATE - INTERVAL '7 days';
END;
$$;

-- Create function to reset daily XP
CREATE OR REPLACE FUNCTION reset_daily_xp()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE user_progress
  SET daily_xp = 0,
      last_daily_reset = CURRENT_DATE
  WHERE last_daily_reset < CURRENT_DATE;
END;
$$;

-- Create function to check and reset streak if inactive
CREATE OR REPLACE FUNCTION check_and_reset_streak(user_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  last_practice TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT last_practice_date INTO last_practice
  FROM user_progress
  WHERE user_id = user_uuid;
  
  -- If last practice was more than 1 day ago, reset streak
  IF last_practice IS NOT NULL AND last_practice < NOW() - INTERVAL '1 day' THEN
    UPDATE user_progress
    SET current_streak = 0
    WHERE user_id = user_uuid;
  END IF;
END;
$$;