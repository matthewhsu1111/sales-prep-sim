// Star Awards for different actions
export const STAR_REWARDS = {
  // Interviewer bonuses (difficulty)
  INTERVIEWER_JAKE: 1,
  INTERVIEWER_MICHAEL: 2,
  INTERVIEWER_REBECCA: 3,
  // Interview type bonuses
  INITIAL_SCREEN: 1,
  HIRING_MANAGER: 2,
  TECHNICAL_ROLEPLAY: 3,
  EXECUTIVE: 4,
  // Other bonuses
  DAILY_TASK: 1,
  FIRST_PRACTICE_TODAY: 1,
  PERFECT_WEEK: 10,
  JOB_APPLICATION: 1,
  CONTACT_HIRING_MANAGER: 2,
  // Per-correct-question cap
  QUESTION_CAP: 10,
} as const;

// Backward-compatible alias for existing imports
export const XP_REWARDS = {
  ...STAR_REWARDS,
  // legacy names mapped to star equivalents
  HIRING_MANAGER: STAR_REWARDS.HIRING_MANAGER,
  TECHNICAL_ROLEPLAY: STAR_REWARDS.TECHNICAL_ROLEPLAY,
  EXECUTIVE: STAR_REWARDS.EXECUTIVE,
  DAILY_TASK: STAR_REWARDS.DAILY_TASK,
  FIRST_PRACTICE_TODAY: STAR_REWARDS.FIRST_PRACTICE_TODAY,
  PERFECT_WEEK: STAR_REWARDS.PERFECT_WEEK,
} as const;

// Level definitions with star thresholds (rescaled)
export const LEVELS = [
  { level: 1, minXP: 0, maxXP: 25 },
  { level: 2, minXP: 25, maxXP: 60 },
  { level: 3, minXP: 60, maxXP: 120 },
  { level: 4, minXP: 120, maxXP: 200 },
  { level: 5, minXP: 200, maxXP: 320 },
  { level: 6, minXP: 320, maxXP: 480 },
  { level: 7, minXP: 480, maxXP: 700 },
  { level: 8, minXP: 700, maxXP: 1000 },
  { level: 9, minXP: 1000, maxXP: 1500 },
  { level: 10, minXP: 1500, maxXP: Infinity },
] as const;

export function getLevelInfo(totalStars: number) {
  const level = LEVELS.find(l => totalStars >= l.minXP && totalStars < l.maxXP) || LEVELS[LEVELS.length - 1];
  const xpToNextLevel = level.maxXP === Infinity ? 0 : level.maxXP - totalStars;
  const progressPercentage = level.maxXP === Infinity
    ? 100
    : ((totalStars - level.minXP) / (level.maxXP - level.minXP)) * 100;

  return {
    ...level,
    xpToNextLevel,
    progressPercentage,
  };
}

export function formatXP(stars: number): string {
  return stars.toLocaleString();
}

export const formatStars = formatXP;

export function getInterviewTypeStars(interviewType: string): number {
  const t = interviewType.toLowerCase();
  if (t.includes('initial') || t.includes('screen')) return STAR_REWARDS.INITIAL_SCREEN;
  if (t.includes('hiring')) return STAR_REWARDS.HIRING_MANAGER;
  if (t.includes('technical') || t.includes('role')) return STAR_REWARDS.TECHNICAL_ROLEPLAY;
  if (t.includes('executive')) return STAR_REWARDS.EXECUTIVE;
  return STAR_REWARDS.TECHNICAL_ROLEPLAY;
}

// Legacy alias
export const getInterviewTypeXP = getInterviewTypeStars;

export function getInterviewerStars(interviewerName: string): number {
  const name = (interviewerName || '').toLowerCase();
  if (name.includes('rebecca')) return STAR_REWARDS.INTERVIEWER_REBECCA;
  if (name.includes('michael')) return STAR_REWARDS.INTERVIEWER_MICHAEL;
  if (name.includes('jake')) return STAR_REWARDS.INTERVIEWER_JAKE;
  return STAR_REWARDS.INTERVIEWER_JAKE;
}

export function getInterviewerLabel(interviewerName: string): string {
  const stars = getInterviewerStars(interviewerName);
  if (stars >= 3) return 'hard interviewer';
  if (stars === 2) return 'medium interviewer';
  return 'easy interviewer';
}
