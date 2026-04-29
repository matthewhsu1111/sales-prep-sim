
REVOKE EXECUTE ON FUNCTION public.get_weekly_leaderboard(int) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_all_time_leaderboard(int) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_weekly_leaderboard(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_time_leaderboard(int) TO authenticated;
