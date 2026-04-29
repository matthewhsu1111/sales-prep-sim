CREATE OR REPLACE FUNCTION public.get_weekly_leaderboard(_limit integer DEFAULT 50)
 RETURNS TABLE(user_id uuid, first_name text, name text, current_level integer, current_streak integer, weekly_xp integer, weekly_stars integer, leaderboard_visible boolean, rank bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT up.user_id,
         p.first_name,
         p.name,
         up.current_level,
         up.current_streak,
         up.weekly_xp,
         up.weekly_stars,
         up.leaderboard_visible,
         rank() OVER (ORDER BY up.weekly_stars DESC, up.weekly_xp DESC) AS rank
  FROM public.user_progress up
  LEFT JOIN public.profiles p ON p.user_id = up.user_id
  ORDER BY rank
  LIMIT _limit;
$function$;

CREATE OR REPLACE FUNCTION public.get_all_time_leaderboard(_limit integer DEFAULT 50)
 RETURNS TABLE(user_id uuid, first_name text, name text, current_level integer, current_streak integer, total_stars integer, leaderboard_visible boolean, rank bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT up.user_id,
         p.first_name,
         p.name,
         up.current_level,
         up.current_streak,
         up.total_stars,
         up.leaderboard_visible,
         rank() OVER (ORDER BY up.total_stars DESC) AS rank
  FROM public.user_progress up
  LEFT JOIN public.profiles p ON p.user_id = up.user_id
  ORDER BY rank
  LIMIT _limit;
$function$;