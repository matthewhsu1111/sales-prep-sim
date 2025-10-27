-- Fix the streak reset function to check the correct interval
CREATE OR REPLACE FUNCTION check_and_reset_streak(user_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  last_practice TIMESTAMP WITH TIME ZONE;
  hours_since_practice NUMERIC;
BEGIN
  SELECT last_practice_date INTO last_practice
  FROM user_progress
  WHERE user_id = user_uuid;
  
  -- Calculate hours since last practice
  IF last_practice IS NOT NULL THEN
    hours_since_practice := EXTRACT(EPOCH FROM (NOW() - last_practice)) / 3600;
    
    -- If last practice was more than 24 hours ago, reset streak to 0
    IF hours_since_practice > 24 THEN
      UPDATE user_progress
      SET current_streak = 0
      WHERE user_id = user_uuid;
    END IF;
  END IF;
END;
$$;