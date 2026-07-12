import { redis } from '@devvit/web/server';

const GOAL = 500;

function weekId(now = new Date()): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const week =
    1 +
    Math.round(
      ((d.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7
    );
  return `${d.getUTCFullYear()}-W${week}`;
}

const exhibitKey = (week: string) => `exhibit:${week}`;

const WEEKLY_EXHIBITS = [
  { name: 'The Amber Room Fragment', blurb: 'A shard of the lost eighth wonder, reassembled by the whole community.' },
  { name: "The Emperor's Jade Seal", blurb: 'Recovered stone by stone through collective effort.' },
  { name: 'The Star Chart of Nineveh', blurb: 'The community pieced together the oldest map of the sky.' },
  { name: 'The Golden Fleece', blurb: 'Myth made real by many hands digging as one.' },
];

export type ExhibitState = {
  week: string;
  progress: number;
  goal: number;
  complete: boolean;
  reward: { name: string; blurb: string };
};

export async function getExhibit(): Promise<ExhibitState> {
  const week = weekId();
  const raw = await redis.get(exhibitKey(week));
  const progress = raw ? parseInt(raw, 10) || 0 : 0;
  const idx = Math.abs(hashStr(week)) % WEEKLY_EXHIBITS.length;
  const reward = WEEKLY_EXHIBITS[idx];
  return {
    week,
    progress: Math.min(progress, GOAL),
    goal: GOAL,
    complete: progress >= GOAL,
    reward,
  };
}

export async function addToExhibit(count: number): Promise<ExhibitState> {
  const week = weekId();
  await redis.incrBy(exhibitKey(week), count);
  await redis.expire(exhibitKey(week), 60 * 60 * 24 * 14);
  return getExhibit();
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
  }
  return h;
}
