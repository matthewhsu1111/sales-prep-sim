-- Fix security warnings by setting search_path for functions

-- Update existing function to set search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update initialize_user_progress function to set search_path
CREATE OR REPLACE FUNCTION public.initialize_user_progress(user_uuid UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  progress_id UUID;
BEGIN
  INSERT INTO public.user_progress (user_id)
  VALUES (user_uuid)
  ON CONFLICT (user_id) DO NOTHING
  RETURNING id INTO progress_id;
  
  IF progress_id IS NULL THEN
    SELECT id INTO progress_id FROM public.user_progress WHERE user_id = user_uuid;
  END IF;
  
  RETURN progress_id;
END;
$$;