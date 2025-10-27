import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { getLevelInfo, formatXP } from '@/utils/gamification';

export interface UserProgress {
  totalXP: number;
  currentLevel: number;
  weeklyXP: number;
  dailyXP: number;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  practicesThisWeek: number;
  leaderboardRank: number | null;
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

      // Fetch leaderboard rank
      const { data: leaderboard } = await supabase
        .from('weekly_leaderboard')
        .select('rank, user_id')
        .eq('user_id', user.id)
        .single();

      setProgress({
        totalXP: progressData.total_xp || 0,
        currentLevel: progressData.current_level || 1,
        weeklyXP: progressData.weekly_xp || 0,
        dailyXP: progressData.daily_xp || 0,
        currentStreak: progressData.current_streak || 0,
        longestStreak: progressData.longest_streak || 0,
        lastPracticeDate: progressData.last_practice_date,
        practicesThisWeek: progressData.practices_this_week || 0,
        leaderboardRank: leaderboard?.rank || null,
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  }

  async function awardXP(xpAmount: number, reason: string) {
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

      const oldTotalXP = currentProgress.total_xp || 0;
      const newTotalXP = oldTotalXP + xpAmount;
      
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
        
        // If last practice was yesterday, increment streak, otherwise reset to 1
        if (lastPracticeDate === yesterdayStr) {
          newStreak = newStreak + 1;
        } else if (lastPracticeDate !== today) {
          // If it's been more than a day, reset to 1
          newStreak = 1;
        }
      }
      
      // Calculate level
      const levelInfo = getLevelInfo(newTotalXP);
      const oldLevelInfo = getLevelInfo(oldTotalXP);
      const leveledUp = levelInfo.level > oldLevelInfo.level;

      // Update progress
      const { data: updatedProgress, error } = await supabase
        .from('user_progress')
        .update({
          total_xp: newTotalXP,
          current_level: levelInfo.level,
          weekly_xp: (currentProgress.weekly_xp || 0) + xpAmount,
          daily_xp: isFirstToday ? xpAmount : (currentProgress.daily_xp || 0) + xpAmount,
          last_practice_date: now,
          practices_this_week: (currentProgress.practices_this_week || 0) + 1,
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, currentProgress.longest_streak || 0),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      await fetchProgress();

      return {
        xpAwarded: xpAmount,
        oldTotalXP,
        newTotalXP,
        leveledUp,
        newLevel: levelInfo,
        oldLevel: oldLevelInfo,
        isFirstToday,
      };
    } catch (error) {
      console.error('Error awarding XP:', error);
      return null;
    }
  }

  const levelInfo = progress ? getLevelInfo(progress.totalXP) : null;

  return {
    progress,
    levelInfo,
    loading,
    awardXP,
    refreshProgress: fetchProgress,
    formatXP,
  };
}
