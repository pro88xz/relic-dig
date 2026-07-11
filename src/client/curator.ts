type Rarity = 'junk' | 'common' | 'rare' | 'legendary';

const LINES: Record<Rarity, string[]> = {
  junk: [
    'The committee has catalogued this. Reluctantly.',
    'Filed under: why.',
    'A find of no consequence. The committee admires your persistence.',
    'The committee notes this exists. Nothing more.',
    'Provenance: regrettable. Accepted anyway.',
  ],
  common: [
    'A respectable addition. The committee nods.',
    'Catalogued without objection. A rare event.',
    'The committee approves. Do not let it go to your head.',
    'Modest, but honest work. Noted.',
    'The archive grows. So does the committee cautious optimism.',
  ],
  rare: [
    'The committee sits up. This is worth the paperwork.',
    'A genuine rarity. Someone fetch the good gloves.',
    'The committee is impressed. It will deny this later.',
    'Remarkable. The archive has been waiting for this one.',
    'A find of real merit. The committee permits a small smile.',
  ],
  legendary: [
    'The committee is speechless. This has not happened before.',
    'Silence in the archive. A legend has surfaced.',
    'The committee stands. You have unearthed history itself.',
    'This changes the collection. The committee will remember the day.',
    'A masterpiece. The committee requests a moment to compose itself.',
  ],
};

const COMPLETE_LINES = [
  'The set is whole. The committee applauds, briefly, then returns to work.',
  'Reassembled at last. The archive is complete in this small, perfect way.',
  'All fragments accounted for. The committee marks the occasion.',
];

let seed = Math.floor(Math.random() * 1000);
function pick<T>(arr: T[]): T {
  seed = (seed * 9301 + 49297) % 233280;
  return arr[Math.floor((seed / 233280) * arr.length)];
}

export function curatorLine(rarity: Rarity): string {
  return pick(LINES[rarity]);
}

export function curatorComplete(): string {
  return pick(COMPLETE_LINES);
}

export function isFoolsGold(rarity: Rarity): boolean {
  if (rarity === 'legendary' || rarity === 'junk') return false;
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280 < 0.12;
}

export const FOOLS_GOLD_LINE =
  'The committee has examined your find. It is a forgery. A convincing one, but a forgery. Better luck below.';
