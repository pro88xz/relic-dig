import { CATALOG } from './relics';
import type { RelicDef } from '../../shared/api';

export type Collection = {
  id: string;
  name: string;
  wing: string;
  blurb: string;
  relicIds: string[];
  themeHint: string;
};

export const COLLECTIONS: Collection[] = [
  {
    id: 'col_egypt',
    name: 'The Egyptian Wing',
    wing: 'Egypt',
    blurb: 'Treasures of the Nile, from humble charms to a king in gold.',
    relicIds: ['c_scarab', 'c_shabti', 'c_oillamp', 'l_tut'],
    themeHint: "Pharaoh's Tomb",
  },
  {
    id: 'col_bronze',
    name: 'The Bronze Age Hall',
    wing: 'Bronze Age',
    blurb: 'Coins, keys, and the first machines of the ancient world.',
    relicIds: ['c_denarius', 'c_fibula', 'r_antikythera', 'r_astrolabe'],
    themeHint: 'Pirate Cove',
  },
  {
    id: 'col_written',
    name: 'The Hall of the Written Word',
    wing: 'Writing',
    blurb: 'Where humanity first pressed its thoughts into clay and stone.',
    relicIds: ['c_tablet', 'c_seal', 'r_rosetta', 'r_phaistos'],
    themeHint: 'Cursed Crypt',
  },
  {
    id: 'col_lost',
    name: 'Lost Civilizations',
    wing: 'The Lost',
    blurb: 'Relics of peoples who vanished, leaving only masterpieces behind.',
    relicIds: ['c_arrowhead', 'r_olmec', 'l_ife', 'r_lyre'],
    themeHint: 'Sunken Temple',
  },
  {
    id: 'col_crown',
    name: 'The Treasury',
    wing: 'Treasury',
    blurb: 'The rarest and most precious objects the museum has ever held.',
    relicIds: ['c_beads', 'r_torc', 'l_crown', 'l_tut'],
    themeHint: 'Pirate Cove',
  },
];

export type CollectionProgress = {
  id: string;
  name: string;
  wing: string;
  blurb: string;
  themeHint: string;
  total: number;
  have: number;
  complete: boolean;
  relics: { id: string; name: string; rarity: string; owned: boolean; piecesHeld: number; piecesTotal: number }[];
};

const RELIC_BY_ID: Record<string, RelicDef> = Object.fromEntries(
  CATALOG.map((r) => [r.id, r])
);

export type PieceInfo = { held: number; total: number };

export function collectionProgress(
  ownedPieces: Record<string, PieceInfo>
): CollectionProgress[] {
  return COLLECTIONS.map((col) => {
    const relics = col.relicIds.map((id) => {
      const r = RELIC_BY_ID[id];
      const info = ownedPieces[id] ?? { held: 0, total: r?.pieces ?? 1 };
      const owned = info.held >= info.total && info.total > 0;
      return {
        id,
        name: r?.name ?? id,
        rarity: r?.rarity ?? 'common',
        owned,
        piecesHeld: info.held,
        piecesTotal: info.total,
      };
    });
    const have = relics.filter((r) => r.owned).length;
    return {
      id: col.id,
      name: col.name,
      wing: col.wing,
      blurb: col.blurb,
      themeHint: col.themeHint,
      total: col.relicIds.length,
      have,
      complete: have === col.relicIds.length,
      relics,
    };
  });
}

export const RANKS = [
  { min: 0, title: 'Museum Intern' },
  { min: 1, title: 'Field Curator' },
  { min: 2, title: 'Senior Curator' },
  { min: 3, title: 'Head Curator' },
  { min: 4, title: 'Museum Director' },
  { min: 5, title: 'Curator Emeritus' },
];

export function rankForCompleted(completedCollections: number): string {
  let title = RANKS[0].title;
  for (const r of RANKS) {
    if (completedCollections >= r.min) title = r.title;
  }
  return title;
}
