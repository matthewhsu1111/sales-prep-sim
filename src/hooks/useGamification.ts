import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { getLevelInfo, formatStars } from '@/utils/gamification';

export interface UserProgress {
  totalXP: number; // total stars (kept name for backward compat)
  currentLevel: number;
  weeklyXP: number; // weekly stars
  dailyXP: number; // daily stars
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  practicesThisWeek: number;
  leaderboardRank: number | null;
  allTimeRank: number | null;
}

export function useGamification() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  async function fetchProgress() {
    if (!user) return;

    try {
      setLoading(true);

      // Check and reset streak if needed
      await supabase.rpc('check_and_reset_streak', { user_uuid: user.id });

      // Fetch user progress
      const { data: progressData, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      // Fetch weekly + all-time leaderboard rank via security-definer RPCs
      const [weeklyRes, allTimeRes] = await Promise.all([
        supabase.rpc('get_weekly_leaderboard', { _limit: 1000 }),
        supabase.rpc('get_all_time_leaderboard', { _limit: 1000 }),
      ]);

      const weeklyRank = (weeklyRes.data as any[] | null)?.find((e) => e.user_id === user.id)?.rank ?? null;
      const allTimeRank = (allTimeRes.data as any[] | null)?.find((e) => e.user_id === user.id)?.rank ?? null;

      setProgress({
        totalXP: progressData.total_stars ?? progressData.total_xp ?? 0,
        currentLevel: progressData.current_level || 1,
        weeklyXP: progressData.weekly_stars ?? progressData.weekly_xp ?? 0,
        dailyXP: progressData.daily_stars ?? progressData.daily_xp ?? 0,
        currentStreak: progressData.current_streak || 0,
        longestStreak: progressData.longest_streak || 0,
        lastPracticeDate: progressData.last_practice_date,
        practicesThisWeek: progressData.practices_this_week || 0,
        leaderboardRank: weeklyRes.data?.rank || null,
        allTimeRank: allTimeRes.data?.rank || null,
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  }

  async function awardStars(starsAmount: number, reason: string) {
    if (!user) return null;

    try {
      const now = new Date().toISOString();
      const today = new Date().toISOString().split('T')[0];

      // Get current progress
      const { data: currentProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!currentProgress) return null;

      const oldTotalStars = currentProgress.total_stars ?? currentProgress.total_xp ?? 0;
      const newTotalStars = oldTotalStars + starsAmount;

      // Check if this is first practice today
      const lastPracticeDate = currentProgress.last_practice_date
        ? new Date(currentProgress.last_practice_date).toISOString().split('T')[0]
        : null;
      const isFirstToday = lastPracticeDate !== today;

      // Update streak if needed
      let newStreak = currentProgress.current_streak || 0;
      if (isFirstToday) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastPracticeDate === yesterdayStr) {
          newStreak = newStreak + 1;
        } else if (lastPracticeDate !== today) {
          newStreak = 1;
        }
      }

      // Calculate level
      const levelInfo = getLevelInfo(newTotalStars);
      const oldLevelInfo = getLevelInfo(oldTotalStars);
      const leveledUp = levelInfo.level > oldLevelInfo.level;

      const newWeeklyStars = (currentProgress.weekly_stars ?? currentProgress.weekly_xp ?? 0) + starsAmount;
      const newDailyStars = isFirstToday
        ? starsAmount
        : (currentProgress.daily_stars ?? currentProgress.daily_xp ?? 0) + starsAmount;

      // Update progress (write both *_stars and *_xp for back-compat)
      const { error } = await supabase
        .from('user_progress')
        .update({
          total_stars: newTotalStars,
          total_xp: newTotalStars,
          current_level: levelInfo.level,
          weekly_stars: newWeeklyStars,
          weekly_xp: newWeeklyStars,
          daily_stars: newDailyStars,
          daily_xp: newDailyStars,
          last_practice_date: now,
          practices_this_week: (currentProgress.practices_this_week || 0) + 1,
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, currentProgress.longest_streak || 0),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchProgress();

      return {
        xpAwarded: starsAmount,
        starsAwarded: starsAmount,
        oldTotalXP: oldTotalStars,
        newTotalXP: newTotalStars,
        leveledUp,
        newLevel: levelInfo,
        oldLevel: oldLevelInfo,
        isFirstToday,
      };
    } catch (error) {
      console.error('Error awarding stars:', error);
      return null;
    }
  }

  const levelInfo = progress ? getLevelInfo(progress.totalXP) : null;

  return {
    progress,
    levelInfo,
    loading,
    awardXP: awardStars, // legacy alias
    awardStars,
    refreshProgress: fetchProgress,
    formatXP: formatStars,
    formatStars,
  };
}
