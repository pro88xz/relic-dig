import type { RelicDef, Rarity, TileContent } from '../../shared/api';

/**
 * The starter catalog. Day 1 ships hand-authored relics so the game is never
 * empty; from Day 3, community-submitted relics get appended to this pool.
 *
 * Voice note: plaques are dry, deadpan "museum committee" tone — that's RELIC's
 * identity (the Curator). Keep them short.
 */
export const CATALOG: RelicDef[] = [
  { id: 'j_sherd', name: 'Potsherd', rarity: 'junk', glyph: 'pot', pieces: 1,
    plaque: 'A broken fragment of pottery. Archaeology is ninety percent this. The committee is tired.' },
  { id: 'j_nail', name: 'Roman Hobnail', rarity: 'junk', glyph: 'nail', pieces: 1,
    plaque: "Fell from a legionary's boot two thousand years ago. He did not come back for it." },
  { id: 'j_bone', name: 'Midden Bone', rarity: 'junk', glyph: 'bone', pieces: 1,
    plaque: "Someone's dinner, circa 800 BC. Still no dessert." },
  { id: 'j_slag', name: 'Iron Slag', rarity: 'junk', glyph: 'unknown', pieces: 1,
    plaque: 'Waste from an ancient forge. Proof people have made a mess since the Bronze Age.' },
  { id: 'j_button', name: 'Bone Button', rarity: 'junk', glyph: 'unknown', pieces: 1,
    plaque: 'Lost from a coat centuries ago. The coat is also gone. Everything is gone, really.' },
  { id: 'c_denarius', name: 'Roman Denarius', rarity: 'common', glyph: 'coin', pieces: 1,
    plaque: "A silver coin bearing an emperor's face. He is no longer available for comment." },
  { id: 'c_scarab', name: 'Faience Scarab', rarity: 'common', glyph: 'scarab', pieces: 1,
    plaque: "An Egyptian beetle amulet for good fortune. Its owner's luck is unrecorded." },
  { id: 'c_arrowhead', name: 'Flint Arrowhead', rarity: 'common', glyph: 'arrowhead', pieces: 1,
    plaque: 'Knapped by hand ten thousand years ago. Sharper than most modern opinions.' },
  { id: 'c_oillamp', name: 'Terracotta Oil Lamp', rarity: 'common', glyph: 'lamp', pieces: 1,
    plaque: 'Lit the evenings of people long gone. The wick is, regrettably, out of warranty.' },
  { id: 'c_fibula', name: 'Bronze Fibula', rarity: 'common', glyph: 'unknown', pieces: 1,
    plaque: "An ancient brooch that pinned a cloak. History's safety pin. Underappreciated." },
  { id: 'c_beads', name: 'Carnelian Beads', rarity: 'common', glyph: 'beads', pieces: 1,
    plaque: 'Traded along the Silk Road. Someone haggled hard for these. They lost the receipt.' },
  { id: 'c_tablet', name: 'Cuneiform Tablet', rarity: 'common', glyph: 'tablet', pieces: 1,
    plaque: "Clay pressed with the world's oldest writing. Likely a receipt for grain. History rhymes." },
  { id: 'c_seal', name: 'Cylinder Seal', rarity: 'common', glyph: 'unknown', pieces: 1,
    plaque: 'Rolled across wet clay to sign documents in Mesopotamia. The original digital signature.' },
  { id: 'c_shabti', name: 'Shabti Figure', rarity: 'common', glyph: 'unknown', pieces: 1,
    plaque: 'A little servant statue placed in tombs to do the dead chores. Even the afterlife has a to-do list.' },
  { id: 'r_antikythera', name: 'The Antikythera Mechanism', rarity: 'rare', glyph: 'gear', pieces: 3,
    plaque: 'A Greek bronze computer for predicting the heavens, lost in a shipwreck. Two millennia ahead of schedule.' },
  { id: 'r_rosetta', name: 'The Rosetta Stone', rarity: 'rare', glyph: 'tablet', pieces: 3,
    plaque: 'One decree in three scripts. It unlocked a dead language. Bring all three fragments; the committee insists.' },
  { id: 'r_phaistos', name: 'The Phaistos Disc', rarity: 'rare', glyph: 'unknown', pieces: 2,
    plaque: 'A clay disc stamped with symbols no one can read. Undeciphered for a century. Good luck.' },
  { id: 'r_torc', name: 'The Snettisham Torc', rarity: 'rare', glyph: 'amulet', pieces: 2,
    plaque: 'A twisted gold neck-ring of a Celtic noble. Buried for safekeeping. They never returned.' },
  { id: 'r_astrolabe', name: 'Brass Astrolabe', rarity: 'rare', glyph: 'compass', pieces: 2,
    plaque: 'Medieval astronomers held the sky in their hands with this. GPS, but it required thinking.' },
  { id: 'r_lyre', name: 'The Lyre of Ur', rarity: 'rare', glyph: 'lyre', pieces: 2,
    plaque: 'A golden bull-headed harp from a Sumerian royal tomb. The oldest known music once lived here.' },
  { id: 'r_olmec', name: 'Olmec Jade Mask', rarity: 'rare', glyph: 'mask', pieces: 2,
    plaque: 'Carved from green stone by a civilization that vanished before the Maya. It has watched a long time.' },
  { id: 'l_tut', name: 'The Mask of Tutankhamun', rarity: 'legendary', glyph: 'mask', pieces: 3,
    plaque: "Eleven kilograms of gold over a boy king's face. Sealed in darkness for 3,300 years. Handle with awe." },
  { id: 'l_crown', name: 'The Crown of the Andes', rarity: 'legendary', glyph: 'crown', pieces: 3,
    plaque: 'Gold and hundreds of emeralds, wrought in colonial Peru. Vanished and resurfaced more than once.' },
  { id: 'l_ife', name: 'The Ife Bronze Head', rarity: 'legendary', glyph: 'unknown', pieces: 3,
    plaque: 'A masterwork of West African casting so lifelike early scholars refused to believe its true makers. They were wrong.' },
];

const CATALOG_BY_ID: Record<string, RelicDef> = Object.fromEntries(
  CATALOG.map((r) => [r.id, r])
);

let APPROVED: RelicDef[] = [];
const APPROVED_BY_ID: Record<string, RelicDef> = {};

export function registerApprovedRelics(relics: RelicDef[]): void {
  APPROVED = relics;
  for (const r of relics) APPROVED_BY_ID[r.id] = r;
}

export function getApprovedRelics(): RelicDef[] {
  return APPROVED;
}

export function getRelic(id: string): RelicDef | undefined {
  return CATALOG_BY_ID[id] ?? APPROVED_BY_ID[id];
}

// ---- deterministic daily generation ---------------------------------------
// Everyone digging the same day sees the SAME buried grid. That makes it a
// shared daily challenge (people compare finds in comments). We derive the
// grid from a seed = siteId, using a small deterministic PRNG so no storage
// of the full grid is needed — it's recomputed identically on demand.

/** Mulberry32 — tiny deterministic PRNG. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Turn a siteId like "2026-07-11" into a numeric seed. */
function seedFromSite(siteId: string): number {
  let h = 2166136261;
  for (let i = 0; i < siteId.length; i++) {
    h ^= siteId.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Today's site id in UTC (stable across all players). */
export function currentSiteId(now = new Date()): string {
  return now.toISOString().slice(0, 10); // YYYY-MM-DD
}

export const GRID_SIZE = 36; // 6x6
export const DIGS_PER_DAY = 8;

/**
 * Build the full buried grid for a site deterministically.
 * Returns an array of TileContent, index-aligned to the grid.
 */
export function buildSiteGrid(siteId: string): TileContent[] {
  const rand = mulberry32(seedFromSite(siteId));
  const tiles: TileContent[] = new Array(GRID_SIZE).fill(null).map(() => ({
    kind: 'empty' as const,
  }));

  // pick indices without collision
  const freeIndices = shuffle(
    Array.from({ length: GRID_SIZE }, (_, i) => i),
    rand
  );
  let cursor = 0;
  const place = (relicId: string, piece: number) => {
    const idx = freeIndices[cursor++];
    if (idx === undefined) return;
    tiles[idx] = { kind: 'relic', relicId, piece };
  };

  // Daily loot budget. Tuned so a full 8 digs feels rewarding but rarely
  // clears everything — leaving a reason to care about tomorrow.
  // 1 legendary piece (maybe), a couple rare pieces, several commons, some junk.
  const pool = weightedDailyPool(rand);
  for (const { relicId, piece } of pool) {
    place(relicId, piece);
  }

  return tiles;
}

type Placement = { relicId: string; piece: number };

/**
 * Decide what gets buried today. Uses rarity weighting so legendaries are
 * scarce. Multi-piece relics contribute individual piece-placements so a
 * player might find "piece 2 of 3" and need other days to complete.
 */
function weightedDailyPool(rand: () => number): Placement[] {
  const out: Placement[] = [];

  const commons = CATALOG.filter((r) => r.rarity === 'common');
  const rares = CATALOG.filter((r) => r.rarity === 'rare');
  const legendaries = CATALOG.filter((r) => r.rarity === 'legendary');
  const junk = CATALOG.filter((r) => r.rarity === 'junk');

  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

  // junk: 4-6 tiles
  const junkCount = 4 + Math.floor(rand() * 3);
  for (let i = 0; i < junkCount; i++) out.push({ relicId: pick(junk).id, piece: 1 });

  // commons: 3-5 tiles
  const commonCount = 3 + Math.floor(rand() * 3);
  for (let i = 0; i < commonCount; i++) out.push({ relicId: pick(commons).id, piece: 1 });

  // rares: 1-2 fragments from a random rare relic
  const rareCount = 1 + Math.floor(rand() * 2);
  for (let i = 0; i < rareCount; i++) {
    const relic = pick(rares);
    const piece = 1 + Math.floor(rand() * relic.pieces);
    out.push({ relicId: relic.id, piece });
  }

  // legendary: ~40% chance of a single fragment appearing today
  if (rand() < 0.4) {
    const relic = pick(legendaries);
    const piece = 1 + Math.floor(rand() * relic.pieces);
    out.push({ relicId: relic.id, piece });
  }

  // player-designed relics: bury 1-2 approved community submissions
  if (APPROVED.length > 0) {
    const playerCount = 1 + Math.floor(rand() * 2);
    for (let i = 0; i < playerCount; i++) {
      const relic = APPROVED[Math.floor(rand() * APPROVED.length)];
      const piece = 1 + Math.floor(rand() * relic.pieces);
      out.push({ relicId: relic.id, piece });
    }
  }

  return out;
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function rarityRank(r: Rarity): number {
  return { junk: 0, common: 1, rare: 2, legendary: 3 }[r];
}

// ---- proximity heat --------------------------------------------------------
// Give players a reason to read the ground instead of blind-guessing. Each
// still-buried tile gets a warmth 0-2 based on grid distance to the nearest
// RARE or LEGENDARY tile. To keep it a game of deduction (not a solved map),
// heat is only "sensed" from tiles the player has already dug — warmth radiates
// outward from excavated ground. Undug-and-far tiles stay cold (0).

const GRID_COLS = 6;

function tileDistance(a: number, b: number): number {
  const ax = a % GRID_COLS, ay = Math.floor(a / GRID_COLS);
  const bx = b % GRID_COLS, by = Math.floor(b / GRID_COLS);
  return Math.max(Math.abs(ax - bx), Math.abs(ay - by)); // Chebyshev
}

/**
 * @param grid full buried grid
 * @param dug set of dug tile indices (the player's sensing points)
 * @returns warmth[] index-aligned to grid; 0 for dug tiles.
 */
export function computeHeat(grid: TileContent[], dug: Set<number>): number[] {
  // locate all rare/legendary tiles
  const treasures: number[] = [];
  for (let i = 0; i < grid.length; i++) {
    const t = grid[i];
    if (t && t.kind === 'relic') {
      const relic = getRelic(t.relicId);
      if (relic && (relic.rarity === 'rare' || relic.rarity === 'legendary')) {
        treasures.push(i);
      }
    }
  }

  const heat = new Array(grid.length).fill(0);
  if (treasures.length === 0) return heat;

  for (let i = 0; i < grid.length; i++) {
    if (dug.has(i)) continue; // dug tiles show their content, not heat
    // only sense heat if this tile is adjacent to something already dug
    // (warmth radiates from explored ground)
    let adjacentToDug = false;
    for (const d of dug) {
      if (tileDistance(i, d) <= 1) { adjacentToDug = true; break; }
    }
    if (!adjacentToDug) continue;

    const nearest = Math.min(...treasures.map((tr) => tileDistance(i, tr)));
    if (nearest <= 1) heat[i] = 2;      // hot — treasure adjacent
    else if (nearest <= 2) heat[i] = 1; // warm
    // else stays 0 (cold)
  }
  return heat;
}
