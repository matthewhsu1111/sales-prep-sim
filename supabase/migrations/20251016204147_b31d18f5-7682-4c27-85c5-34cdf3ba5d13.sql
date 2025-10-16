-- Add interview preferences and setup completion tracking to profiles table
ALTER TABLE public.profiles
ADD COLUMN has_completed_setup BOOLEAN DEFAULT false,
ADD COLUMN interview_preferences JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.has_completed_setup IS 'Tracks if user has completed one-time device setup wizard';
COMMENT ON COLUMN public.profiles.interview_preferences IS 'Stores user device preferences: default_camera, default_mic, auto_mute, echo_cancellation, noise_suppression, auto_gain_control';