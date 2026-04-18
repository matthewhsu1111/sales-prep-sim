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
  { level: 1, minXP: 0, maxXP: 100 },
  { level: 2, minXP: 100, maxXP: 250 },
  { level: 3, minXP: 250, maxXP: 500 },
  { level: 4, minXP: 500, maxXP: 1000 },
  { level: 5, minXP: 1000, maxXP: 2000 },
  { level: 6, minXP: 2000, maxXP: 3500 },
  { level: 7, minXP: 3500, maxXP: 5000 },
  { level: 8, minXP: 5000, maxXP: 7500 },
  { level: 9, minXP: 7500, maxXP: 10000 },
  { level: 10, minXP: 10000, maxXP: Infinity },
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
