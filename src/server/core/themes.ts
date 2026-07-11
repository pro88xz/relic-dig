import { currentSiteId } from './relics';

export type ThemeId = 'classic' | 'pirate' | 'crypt' | 'tomb' | 'temple';

export type Theme = {
  id: ThemeId;
  name: string;
  kicker: string;
  blurb: string;
  accent: string;
  bgTop: string;
  bgBottom: string;
  favored: string[];
};

export const THEMES: Record<ThemeId, Theme> = {
  classic: {
    id: 'classic', name: 'The Dig Site', kicker: 'DAILY DIG SITE',
    blurb: 'Ordinary ground, extraordinary luck.',
    accent: '#e0a93b', bgTop: '#2a1e13', bgBottom: '#14100b', favored: [],
  },
  pirate: {
    id: 'pirate', name: 'Pirate Cove', kicker: 'PIRATE COVE',
    blurb: 'The tide went out. It left something behind.',
    accent: '#3fb6a8', bgTop: '#0e2a2e', bgBottom: '#08171a',
    favored: ['c_denarius', 'c_beads', 'r_astrolabe', 'r_torc', 'l_crown'],
  },
  crypt: {
    id: 'crypt', name: 'The Cursed Crypt', kicker: 'CURSED CRYPT',
    blurb: 'Something down here does not want to be found.',
    accent: '#9b6ad0', bgTop: '#211533', bgBottom: '#0f0a18',
    favored: ['j_bone', 'c_shabti', 'c_seal', 'r_phaistos', 'l_ife'],
  },
  tomb: {
    id: 'tomb', name: "The Pharaoh's Tomb", kicker: "PHARAOH'S TOMB",
    blurb: 'Gold, and the silence of three thousand years.',
    accent: '#e0b93b', bgTop: '#33260e', bgBottom: '#1a1206',
    favored: ['c_scarab', 'c_shabti', 'c_oillamp', 'r_lyre', 'l_tut'],
  },
  temple: {
    id: 'temple', name: 'The Sunken Temple', kicker: 'SUNKEN TEMPLE',
    blurb: 'The jungle swallowed it. You are digging it back out.',
    accent: '#5a9e4a', bgTop: '#14290f', bgBottom: '#0a1608',
    favored: ['c_arrowhead', 'c_beads', 'r_olmec', 'r_antikythera', 'l_ife'],
  },
};

const ROTATION: ThemeId[] = ['classic', 'pirate', 'tomb', 'crypt', 'temple'];

export function themeForSite(siteId = currentSiteId()): Theme {
  const days = Math.floor(new Date(siteId + 'T00:00:00Z').getTime() / 86400000);
  const id = ROTATION[((days % ROTATION.length) + ROTATION.length) % ROTATION.length];
  return THEMES[id];
}
