-- Add subscription tier to profiles table
ALTER TABLE public.profiles 
ADD COLUMN subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro'));

-- Add interview count tracking
CREATE TABLE IF NOT EXISTS public.user_interview_counts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_interviews integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_interview_counts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_interview_counts
CREATE POLICY "Users can view their own interview count"
ON public.user_interview_counts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interview count"
ON public.user_interview_counts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interview count"
ON public.user_interview_counts
FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE TRIGGER update_user_interview_counts_updated_at
BEFORE UPDATE ON public.user_interview_counts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();