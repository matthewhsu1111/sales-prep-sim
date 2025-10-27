// XP Awards for different actions
export const XP_REWARDS = {
  INITIAL_SCREEN: 10,
  HIRING_MANAGER: 15,
  TECHNICAL_ROLEPLAY: 20,
  EXECUTIVE: 25,
  DAILY_TASK: 5,
  FIRST_PRACTICE_TODAY: 5,
  PERFECT_WEEK: 50,
  JOB_APPLICATION: 8,
  CONTACT_HIRING_MANAGER: 12,
} as const;

// Level definitions with XP thresholds
export const LEVELS = [
  { level: 1, name: "Nervous Newbie", minXP: 0, maxXP: 100, emoji: "😰" },
  { level: 2, name: "Eager Learner", minXP: 100, maxXP: 250, emoji: "📚" },
  { level: 3, name: "Practicing Pro", minXP: 250, maxXP: 500, emoji: "💪" },
  { level: 4, name: "Confident Caller", minXP: 500, maxXP: 1000, emoji: "😎" },
  { level: 5, name: "Objection Handler", minXP: 1000, maxXP: 2000, emoji: "🛡️" },
  { level: 6, name: "Discovery Master", minXP: 2000, maxXP: 3500, emoji: "🔍" },
  { level: 7, name: "Interview Ready", minXP: 3500, maxXP: 5000, emoji: "🎯" },
  { level: 8, name: "Sales Savage", minXP: 5000, maxXP: 7500, emoji: "🔥" },
  { level: 9, name: "Closer", minXP: 7500, maxXP: 10000, emoji: "💼" },
  { level: 10, name: "Hired Legend", minXP: 10000, maxXP: Infinity, emoji: "👑" },
] as const;

export function getLevelInfo(totalXP: number) {
  const level = LEVELS.find(l => totalXP >= l.minXP && totalXP < l.maxXP) || LEVELS[LEVELS.length - 1];
  const xpToNextLevel = level.maxXP === Infinity ? 0 : level.maxXP - totalXP;
  const progressPercentage = level.maxXP === Infinity 
    ? 100 
    : ((totalXP - level.minXP) / (level.maxXP - level.minXP)) * 100;
  
  return {
    ...level,
    xpToNextLevel,
    progressPercentage,
  };
}

export function formatXP(xp: number): string {
  return xp.toLocaleString();
}

export function getInterviewTypeXP(interviewType: string): number {
  switch (interviewType.toLowerCase()) {
    case 'hiring manager':
      return XP_REWARDS.HIRING_MANAGER;
    case 'technical':
    case 'roleplay':
      return XP_REWARDS.TECHNICAL_ROLEPLAY;
    case 'executive':
      return XP_REWARDS.EXECUTIVE;
    default:
      return XP_REWARDS.TECHNICAL_ROLEPLAY;
  }
}
