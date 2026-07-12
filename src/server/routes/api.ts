import { Hono } from 'hono';
import { context, redis, reddit } from '@devvit/web/server';
import type {
  InitResponse,
  DigResponse,
  MuseumResponse,
  MuseumEntry,
  Tile,
  TileContent,
  ErrorResponse,
  SubmitResponse,
  ListSubmissionsResponse,
  SubmissionWithVote,
  VoteResponse,
  ProgressResponse,
  LeaderboardResponse,
} from '../../shared/api';
import {
  CATALOG,
  getRelic,
  buildSiteGrid,
  computeHeat,
  currentSiteId,
  GRID_SIZE,
  DIGS_PER_DAY,
} from '../core/relics';
import { getStreak, touchStreak } from '../core/streak';
import { registerApprovedRelics, getApprovedRelics } from '../core/relics';
import { themeForSite } from '../core/themes';
import { collectionProgress, rankForCompleted } from '../core/collections';
import { getExhibit, addToExhibit } from '../core/exhibit';
import { updateScore, topCurators, myStanding } from '../core/leaderboard';
import { createSubmission, listSubmissions, voteSubmission, hasVoted, approvedRelics } from '../core/submissions';

export const api = new Hono();

const digsKey = (user: string, siteId: string) => `digs:${siteId}:${user}`;
const museumKey = (user: string) => `museum:${user}`;

async function getUser(): Promise<string> {
  const u = await reddit.getCurrentUsername();
  return u ?? 'anonymous';
}

async function loadDug(user: string, siteId: string): Promise<Set<number>> {
  const raw = await redis.get(digsKey(user, siteId));
  if (!raw) return new Set();
  try {
    return new Set(JSON.parse(raw) as number[]);
  } catch {
    return new Set();
  }
}

async function saveDug(user: string, siteId: string, dug: Set<number>): Promise<void> {
  await redis.set(digsKey(user, siteId), JSON.stringify([...dug]));
  await redis.expire(digsKey(user, siteId), 60 * 60 * 24 * 3);
}

async function loadMuseum(user: string): Promise<Record<string, number[]>> {
  const all = await redis.hGetAll(museumKey(user));
  const out: Record<string, number[]> = {};
  for (const [relicId, val] of Object.entries(all ?? {})) {
    try {
      out[relicId] = JSON.parse(val) as number[];
    } catch {
      // ignore malformed
    }
  }
  return out;
}

async function addPiece(user: string, relicId: string, piece: number): Promise<boolean> {
  const relic = getRelic(relicId);
  if (!relic) return false;
  const museum = await loadMuseum(user);
  const held = museum[relicId] ?? new Array(relic.pieces).fill(0);
  if (piece >= 1 && piece <= relic.pieces) {
    held[piece - 1] = (held[piece - 1] ?? 0) + 1;
  }
  await redis.hSet(museumKey(user), { [relicId]: JSON.stringify(held) });
  return held.every((n) => n > 0);
}

api.get('/init', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'postId is required but missing from context' },
      400
    );
  }
  try {
    const username = await getUser();
    const siteId = currentSiteId();
    registerApprovedRelics(await approvedRelics());
    const theme = themeForSite(siteId);
    const grid = buildSiteGrid(siteId);
    const dug = await loadDug(username, siteId);
    const tiles: Tile[] = Array.from({ length: GRID_SIZE }, (_, i) => {
      const isDug = dug.has(i);
      return { index: i, dug: isDug, content: isDug ? (grid[i] as TileContent) : null };
    });
    const heat = computeHeat(grid, dug);
    const streakInfo = await getStreak(username);
    return c.json<InitResponse>({
      type: 'init',
      postId,
      username,
      siteId,
      gridSize: GRID_SIZE,
      digsTotal: DIGS_PER_DAY + streakInfo.bonusDigs,
      digsUsed: dug.size,
      tiles,
      catalog: [...CATALOG, ...getApprovedRelics()],
      heat,
      streak: streakInfo.streak,
      bonusDigs: streakInfo.bonusDigs,
      theme: {
        id: theme.id, name: theme.name, kicker: theme.kicker, blurb: theme.blurb,
        accent: theme.accent, bgTop: theme.bgTop, bgBottom: theme.bgBottom,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? `Initialization failed: ${error.message}` : 'Unknown error';
    console.error('RELIC init error:', error);
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

api.post('/dig', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>({ status: 'error', message: 'postId is required' }, 400);
  }
  try {
    const body = (await c.req.json().catch(() => ({}))) as { index?: number };
    const index = body.index;
    if (typeof index !== 'number' || index < 0 || index >= GRID_SIZE) {
      return c.json<ErrorResponse>({ status: 'error', message: 'invalid tile index' }, 400);
    }
    const username = await getUser();
    const siteId = currentSiteId();
    const dug = await loadDug(username, siteId);
    const isFirstDigToday = dug.size === 0;
    const streakInfo = isFirstDigToday ? await touchStreak(username) : await getStreak(username);
    const digsLimit = DIGS_PER_DAY + streakInfo.bonusDigs;
    if (dug.has(index)) {
      return c.json<ErrorResponse>({ status: 'error', message: 'tile already dug' }, 400);
    }
    if (dug.size >= digsLimit) {
      return c.json<ErrorResponse>({ status: 'error', message: 'no digs left today' }, 400);
    }
    registerApprovedRelics(await approvedRelics());
    const grid = buildSiteGrid(siteId);
    const content = grid[index] as TileContent;
    dug.add(index);
    await saveDug(username, siteId, dug);
    let completedRelic = false;
    let revealed = null;
    if (content.kind === 'relic') {
      revealed = getRelic(content.relicId) ?? null;
      completedRelic = await addPiece(username, content.relicId, content.piece);
      await addToExhibit(1);
    }
    const heat = computeHeat(grid, dug);
    return c.json<DigResponse>({
      type: 'dig',
      index,
      content,
      revealed,
      digsUsed: dug.size,
      digsTotal: digsLimit,
      completedRelic,
      heat,
      streak: streakInfo.streak,
    });
  } catch (error) {
    const message = error instanceof Error ? `Dig failed: ${error.message}` : 'Unknown error';
    console.error('RELIC dig error:', error);
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

api.post('/dev/reset', async (c) => {
  try {
    const username = await getUser();
    const siteId = currentSiteId();
    await redis.del(digsKey(username, siteId));
    return c.json({ ok: true, siteId, user: username });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'reset failed';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

api.post('/dev/wipe-museum', async (c) => {
  try {
    const username = await getUser();
    await redis.del(museumKey(username));
    return c.json({ ok: true, user: username });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'wipe failed';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

api.get('/museum', async (c) => {
  try {
    const username = await getUser();
    const museum = await loadMuseum(username);
    const entries: MuseumEntry[] = Object.entries(museum).map(([relicId, piecesHeld]) => {
      const relic = getRelic(relicId);
      const complete = relic
        ? piecesHeld.length >= relic.pieces && piecesHeld.every((n) => n > 0)
        : false;
      return { relicId, piecesHeld, complete };
    });
    return c.json<MuseumResponse>({ type: 'museum', username, entries, catalog: CATALOG });
  } catch (error) {
    const message =
      error instanceof Error ? `Museum load failed: ${error.message}` : 'Unknown error';
    console.error('RELIC museum error:', error);
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

api.post('/submit-relic', async (c) => {
  try {
    const body = (await c.req.json().catch(() => ({}))) as {
      name?: string; plaque?: string; rarity?: string; icon?: string;
    };
    const name = (body.name ?? '').trim();
    const plaque = (body.plaque ?? '').trim();
    const rarityIn = body.rarity ?? 'common';
    const icon = body.icon ?? 'unknown';
    if (!name || !plaque) {
      return c.json<ErrorResponse>({ status: 'error', message: 'name and plaque are required' }, 400);
    }
    const rarity = (['common', 'rare', 'legendary'].includes(rarityIn) ? rarityIn : 'common') as
      | 'common' | 'rare' | 'legendary';
    const author = await getUser();
    const submission = await createSubmission({ author, name, plaque, rarity, icon });
    return c.json<SubmitResponse>({ type: 'submitted', submission });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'submit failed';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

api.get('/submissions', async (c) => {
  try {
    const user = await getUser();
    const items = await listSubmissions(50);
    const withVotes: SubmissionWithVote[] = [];
    for (const s of items) {
      withVotes.push({ ...s, youVoted: await hasVoted(s.id, user) });
    }
    return c.json<ListSubmissionsResponse>({ type: 'submissions', items: withVotes });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'list failed';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

api.post('/vote-relic', async (c) => {
  try {
    const body = (await c.req.json().catch(() => ({}))) as { id?: string };
    const id = body.id ?? '';
    if (!id) return c.json<ErrorResponse>({ status: 'error', message: 'id required' }, 400);
    const user = await getUser();
    const submission = await voteSubmission(id, user);
    if (!submission) return c.json<ErrorResponse>({ status: 'error', message: 'not found' }, 404);
    const youVoted = await hasVoted(id, user);
    return c.json<VoteResponse>({ type: 'voted', submission, youVoted });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'vote failed';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

async function ownedPiecesMap(user: string): Promise<Record<string, { held: number; total: number }>> {
  const museum = await loadMuseum(user);
  const out: Record<string, { held: number; total: number }> = {};
  for (const [relicId, piecesHeld] of Object.entries(museum)) {
    const relic = getRelic(relicId);
    if (!relic) continue;
    const held = piecesHeld.filter((n) => n > 0).length;
    out[relicId] = { held, total: relic.pieces };
  }
  return out;
}

api.get('/progress', async (c) => {
  try {
    const username = await getUser();
    const owned = await ownedPiecesMap(username);
    const collections = collectionProgress(owned);
    const completed = collections.filter((col) => col.complete).length;
    const rank = rankForCompleted(completed);
    const relicsOwned = Object.values(owned).filter((pp) => pp.held >= pp.total && pp.total > 0).length;
    await updateScore(username, completed, relicsOwned);
    const exhibit = await getExhibit();
    return c.json<ProgressResponse>({
      type: 'progress',
      rank,
      completedCollections: completed,
      totalCollections: collections.length,
      collections,
      exhibit,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'progress failed';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

api.get('/leaderboard', async (c) => {
  try {
    const username = await getUser();
    const top = await topCurators(10);
    const standing = await myStanding(username);
    return c.json<LeaderboardResponse>({
      type: 'leaderboard',
      top,
      myRank: standing.rank,
      myScore: standing.score,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'leaderboard failed';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});
