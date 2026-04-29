// Deterministic vibrant avatar color based on a seed (e.g., user_id).
// Shared across leaderboard and header so the same user always gets the same color.

export const AVATAR_COLORS = [
  'bg-red-500 text-white',
  'bg-orange-500 text-white',
  'bg-amber-500 text-white',
  'bg-yellow-500 text-black',
  'bg-lime-500 text-black',
  'bg-green-500 text-white',
  'bg-emerald-500 text-white',
  'bg-teal-500 text-white',
  'bg-cyan-500 text-black',
  'bg-sky-500 text-white',
  'bg-blue-500 text-white',
  'bg-indigo-500 text-white',
  'bg-violet-500 text-white',
  'bg-purple-500 text-white',
  'bg-fuchsia-500 text-white',
  'bg-pink-500 text-white',
  'bg-rose-500 text-white',
];

export function getAvatarColor(seed: string | null | undefined): string {
  const s = seed || 'anonymous';
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function getInitial(name: string | null | undefined): string {
  const trimmed = name?.trim();
  if (!trimmed) return '?';
  return trimmed.charAt(0).toUpperCase();
}
