import { redis } from '@devvit/web/server';
import { currentSiteId } from './relics';

const streakKey = (user: string) => `streak:${user}`;

export type StreakInfo = {
  streak: number;
  bonusDigs: number;
  lastSite: string | null;
};

function yesterdayOf(siteId: string): string {
  const d = new Date(siteId + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function bonusFromStreak(streak: number): number {
  if (streak >= 7) return 2;
  if (streak >= 3) return 1;
  return 0;
}

export async function getStreak(user: string): Promise<StreakInfo> {
  const raw = await redis.get(streakKey(user));
  if (!raw) return { streak: 0, bonusDigs: 0, lastSite: null };
  try {
    const parsed = JSON.parse(raw) as { streak: number; lastSite: string };
    return {
      streak: parsed.streak,
      bonusDigs: bonusFromStreak(parsed.streak),
      lastSite: parsed.lastSite,
    };
  } catch {
    return { streak: 0, bonusDigs: 0, lastSite: null };
  }
}

export async function touchStreak(user: string): Promise<StreakInfo> {
  const today = currentSiteId();
  const info = await getStreak(user);
  if (info.lastSite === today) return info;
  let newStreak: number;
  if (info.lastSite === yesterdayOf(today)) newStreak = info.streak + 1;
  else newStreak = 1;
  await redis.set(streakKey(user), JSON.stringify({ streak: newStreak, lastSite: today }));
  return { streak: newStreak, bonusDigs: bonusFromStreak(newStreak), lastSite: today };
}
