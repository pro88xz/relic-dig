import { redis } from '@devvit/web/server';

const LB_KEY = 'leaderboard:curators:v1';

export type LeaderEntry = { username: string; score: number; wings: number; relics: number };

type StoredEntry = { username: string; score: number; wings: number; relics: number };

export function computeScore(wings: number, relics: number): number {
  return wings * 1000 + relics;
}

async function loadBoard(): Promise<StoredEntry[]> {
  const raw = await redis.get(LB_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredEntry[];
  } catch {
    return [];
  }
}

export async function updateScore(
  username: string,
  wings: number,
  relics: number
): Promise<void> {
  if (username === 'anonymous') return;
  const board = await loadBoard();
  const score = computeScore(wings, relics);
  const idx = board.findIndex((e) => e.username === username);
  if (idx >= 0) board[idx] = { username, score, wings, relics };
  else board.push({ username, score, wings, relics });
  board.sort((a, b) => b.score - a.score);
  const trimmed = board.slice(0, 100);
  await redis.set(LB_KEY, JSON.stringify(trimmed));
}

export async function topCurators(n = 10): Promise<LeaderEntry[]> {
  const board = await loadBoard();
  return board.slice(0, n);
}

export async function myStanding(username: string): Promise<{ rank: number | null; score: number }> {
  const board = await loadBoard();
  const idx = board.findIndex((e) => e.username === username);
  if (idx < 0) return { rank: null, score: 0 };
  return { rank: idx + 1, score: board[idx].score };
}
