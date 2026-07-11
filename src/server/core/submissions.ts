import { redis, reddit } from '@devvit/web/server';
import type { Rarity } from '../../shared/api';

export type Submission = {
  id: string;
  author: string;
  name: string;
  plaque: string;
  rarity: Rarity;
  icon: string;
  votes: number;
  createdAt: number;
};

const SUB_PREFIX = 'sub:';
const SUB_INDEX = 'sub:index';
const VOTE_PREFIX = 'subvote:';

function newId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export async function createSubmission(input: {
  author: string; name: string; plaque: string; rarity: Rarity; icon: string;
}): Promise<Submission> {
  const sub: Submission = {
    id: newId(),
    author: input.author,
    name: input.name.slice(0, 60),
    plaque: input.plaque.slice(0, 200),
    rarity: input.rarity,
    icon: input.icon,
    votes: 0,
    createdAt: Date.now(),
  };
  await redis.set(SUB_PREFIX + sub.id, JSON.stringify(sub));
  const idxRaw = await redis.get(SUB_INDEX);
  const ids: string[] = idxRaw ? (JSON.parse(idxRaw) as string[]) : [];
  ids.push(sub.id);
  await redis.set(SUB_INDEX, JSON.stringify(ids));
  return sub;
}

export async function listSubmissions(limit = 50): Promise<Submission[]> {
  const idxRaw = await redis.get(SUB_INDEX);
  if (!idxRaw) return [];
  const ids: string[] = JSON.parse(idxRaw) as string[];
  const recent = ids.slice(-limit).reverse();
  const out: Submission[] = [];
  for (const id of recent) {
    const raw = await redis.get(SUB_PREFIX + id);
    if (raw) {
      try { out.push(JSON.parse(raw) as Submission); } catch { /* skip */ }
    }
  }
  out.sort((a, b) => b.votes - a.votes || b.createdAt - a.createdAt);
  return out;
}

export async function voteSubmission(id: string, user: string): Promise<Submission | null> {
  const voteKey = VOTE_PREFIX + id + ':' + user;
  const already = await redis.get(voteKey);
  const raw = await redis.get(SUB_PREFIX + id);
  if (!raw) return null;
  const sub = JSON.parse(raw) as Submission;
  if (already) {
    await redis.del(voteKey);
    sub.votes = Math.max(0, sub.votes - 1);
  } else {
    await redis.set(voteKey, '1');
    sub.votes += 1;
  }
  await redis.set(SUB_PREFIX + id, JSON.stringify(sub));
  return sub;
}

export async function hasVoted(id: string, user: string): Promise<boolean> {
  const v = await redis.get(VOTE_PREFIX + id + ':' + user);
  return !!v;
}

import type { RelicDef } from '../../shared/api';

const APPROVE_THRESHOLD = 1;

function submissionToRelic(sub: Submission): RelicDef {
  return {
    id: `u_${sub.id}`,
    name: sub.name,
    rarity: sub.rarity,
    plaque: sub.plaque,
    glyph: sub.icon,
    pieces: sub.rarity === 'legendary' ? 3 : sub.rarity === 'rare' ? 2 : 1,
  };
}

export async function approvedRelics(limit = 12): Promise<RelicDef[]> {
  const subs = await listSubmissions(100);
  return subs
    .filter((s) => s.votes >= APPROVE_THRESHOLD)
    .slice(0, limit)
    .map(submissionToRelic);
}
