// Inline SVG icons for relics — tier-grouped glyphs. Rendered identically
// everywhere (emoji fonts are unreliable in the Devvit webview).

export type IconId =
  | 'coin' | 'pot' | 'beads' | 'nail' | 'arrowhead' | 'lamp' | 'bone' | 'shard' | 'hook' | 'ring' | 'spindle' | 'die' | 'whistle' | 'comb'
  | 'gear' | 'compass' | 'lyre' | 'tablet' | 'scarab' | 'scroll' | 'astrolabe' | 'chalice' | 'dagger' | 'horn' | 'urn' | 'sundial' | 'key2'
  | 'crown' | 'mask' | 'amulet' | 'gem' | 'scepter' | 'idol' | 'ankh' | 'orb' | 'tiara' | 'chest' | 'phoenix' | 'sword' | 'grail'
  | 'key' | 'sock' | 'can' | 'unknown';

const wrap = (inner: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

export const ICONS: Record<IconId, string> = {
  coin: wrap('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><path d="M12 9.5v5M10 12h4"/>'),
  pot: wrap('<path d="M7 8h10l-1 9a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3z"/><path d="M6 8c0-2 2.7-3 6-3s6 1 6 3"/><path d="M9 5.5V4M15 5.5V4"/>'),
  beads: wrap('<circle cx="6" cy="14" r="2"/><circle cx="12" cy="16" r="2.3"/><circle cx="18" cy="14" r="2"/><path d="M6 6a6 6 0 0 0 12 0"/>'),
  nail: wrap('<path d="M9 3h6l-1 4h-4z"/><path d="M11 7l1 14 1-14"/>'),
  arrowhead: wrap('<path d="M12 3l4 9-4 3-4-3z"/><path d="M12 15v6"/>'),
  lamp: wrap('<path d="M4 14c0-3 3-5 7-5s9 1 9 4c0 2-3 2-5 2H8a4 4 0 0 1-4-1z"/><path d="M20 13l2-1M11 9V6"/>'),
  bone: wrap('<path d="M7 7a2.2 2.2 0 1 0-1.5 3.7l6.8 6.8A2.2 2.2 0 1 0 17 19a2.2 2.2 0 1 0 0-2.5l-6.8-6.8A2.2 2.2 0 1 0 7 7z"/>'),
  shard: wrap('<path d="M8 4l9 5-3 11-8-4z"/><path d="M8 4l1 9 5 2"/>'),
  hook: wrap('<path d="M9 3v6a4 4 0 0 0 8 0"/><circle cx="9" cy="3" r="1.4"/><path d="M17 9l-2 2M17 9l2 2"/>'),
  ring: wrap('<circle cx="12" cy="14" r="6"/><path d="M9 8l3-4 3 4"/>'),
  spindle: wrap('<path d="M12 3v18M8 6l8 3M16 6l-8 3M8 18l8-3M16 18l-8-3"/>'),
  die: wrap('<rect x="5" y="5" width="14" height="14" rx="2"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="15" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/>'),
  whistle: wrap('<path d="M4 10h9l5-3v10l-5-3H4z"/><circle cx="7" cy="12" r="1.4"/>'),
  comb: wrap('<path d="M5 6h14v5H5z"/><path d="M6 11v7M9 11v7M12 11v7M15 11v7M18 11v7"/>'),
  gear: wrap('<circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>'),
  compass: wrap('<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z" fill="currentColor"/>'),
  lyre: wrap('<path d="M7 20V8a5 5 0 0 1 10 0v12"/><path d="M10 20V9M14 20V9M7 20h10"/>'),
  tablet: wrap('<rect x="5" y="4" width="14" height="16" rx="1"/><path d="M8 8h3M13 8h3M8 11h3M13 11h3M8 14h3M13 14h3"/>'),
  scarab: wrap('<ellipse cx="12" cy="13" rx="5" ry="7"/><path d="M12 6V3M9 5l-2-2M15 5l2-2M7 13H4M17 13h3"/>'),
  scroll: wrap('<path d="M6 5h9a2 2 0 0 1 2 2v10a2 2 0 0 0 2 2H8a2 2 0 0 1-2-2z"/><path d="M6 5a2 2 0 0 0-2 2v1h2M9 9h5M9 12h5M9 15h3"/>'),
  astrolabe: wrap('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18"/>'),
  chalice: wrap('<path d="M7 4h10l-1 6a4 4 0 0 1-8 0z"/><path d="M12 14v5M8 20h8"/>'),
  dagger: wrap('<path d="M12 2l2 12h-4z"/><path d="M8 14h8l-2 2h-4z"/><path d="M12 16v6"/>'),
  horn: wrap('<path d="M4 8c8 0 14 4 16 11"/><path d="M4 8c0 5 3 8 8 9"/><circle cx="4" cy="8" r="1.5"/>'),
  urn: wrap('<path d="M8 4h8l-1 3 2 2v7a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V9l2-2z"/><path d="M9 12h6"/>'),
  sundial: wrap('<path d="M4 18h16"/><path d="M12 18L8 8"/><path d="M6 18a6 6 0 0 1 12 0"/>'),
  key2: wrap('<circle cx="8" cy="8" r="4"/><path d="M11 11l8 8M16 16l2-2M18 18l2-2"/>'),
  crown: wrap('<path d="M4 8l3 9h10l3-9-5 4-3-6-3 6z"/><path d="M7 20h10"/>'),
  mask: wrap('<path d="M5 5c0 8 3 14 7 14s7-6 7-14c-2 1-4.5 1.5-7 1.5S7 6 5 5z"/><path d="M9 10h.01M15 10h.01"/>'),
  amulet: wrap('<path d="M6 4h12M8 4l-2 5a6 6 0 1 0 12 0l-2-5"/><path d="M12 11l1.5 2.6h-3z" fill="currentColor"/>'),
  gem: wrap('<path d="M6 4h12l4 6-10 11L2 10z"/><path d="M6 4l4 6M18 4l-4 6M2 10h20M10 10l2 11M14 10l-2 11"/>'),
  scepter: wrap('<circle cx="12" cy="5" r="3"/><path d="M12 8v13"/><path d="M9 5h6"/>'),
  idol: wrap('<path d="M12 3a4 4 0 0 1 4 4c0 2-1 3-1 5l1 9H8l1-9c0-2-1-3-1-5a4 4 0 0 1 4-4z"/><path d="M10 7h.01M14 7h.01"/>'),
  ankh: wrap('<circle cx="12" cy="7" r="4"/><path d="M12 11v10M8 15h8"/>'),
  orb: wrap('<circle cx="12" cy="13" r="7"/><path d="M12 6V3M5 13H2M22 13h-3M8 10a6 6 0 0 1 8 0"/>'),
  tiara: wrap('<path d="M4 16c2-6 4-8 8-8s6 2 8 8"/><path d="M12 8V5M8 10l-1-3M16 10l1-3"/><path d="M4 16h16"/>'),
  chest: wrap('<rect x="4" y="9" width="16" height="10" rx="1"/><path d="M4 9c0-3 2-4 8-4s8 1 8 4M12 12v3"/><circle cx="12" cy="12" r="1" fill="currentColor"/>'),
  phoenix: wrap('<path d="M12 3c2 3 6 3 8 1-1 4-4 5-4 5s4 1 5 4c-3 0-5-1-5-1M12 3c-2 3-6 3-8 1 1 4 4 5 4 5s-4 1-5 4c3 0 5-1 5-1M12 3v18"/>'),
  sword: wrap('<path d="M12 2l1.5 13h-3z"/><path d="M8 15h8v2H8z"/><path d="M12 17v5M9 20h6"/>'),
  grail: wrap('<path d="M6 4h12l-2 7a4 4 0 0 1-8 0z"/><path d="M12 15v4M8 21h8M9 4l3 5 3-5"/>'),
  key: wrap('<circle cx="8" cy="8" r="4"/><path d="M11 11l8 8M16 16l2-2M18 18l2-2"/>'),
  sock: wrap('<path d="M8 3v7l-3 4a4 4 0 0 0 3 6h2a4 4 0 0 0 3-2l3-4V3z"/><path d="M8 3h8"/>'),
  can: wrap('<ellipse cx="12" cy="6" rx="6" ry="2.2"/><path d="M6 6v12c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2V6"/><path d="M9 10l6 6M15 10l-6 6"/>'),
  unknown: wrap('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7M12 16.5h.01"/>'),
};

export const TIER_ICONS: Record<'common' | 'rare' | 'legendary', IconId[]> = {
  common: ['coin', 'pot', 'beads', 'nail', 'arrowhead', 'lamp', 'bone', 'shard', 'hook', 'ring', 'spindle', 'die', 'whistle', 'comb'],
  rare: ['gear', 'compass', 'lyre', 'tablet', 'scarab', 'scroll', 'astrolabe', 'chalice', 'dagger', 'horn', 'urn', 'sundial', 'key2'],
  legendary: ['crown', 'mask', 'amulet', 'gem', 'scepter', 'idol', 'ankh', 'orb', 'tiara', 'chest', 'phoenix', 'sword', 'grail'],
};

export const RELIC_ICON: Record<string, IconId> = {
  j_sherd: 'shard', j_nail: 'nail', j_bone: 'bone', j_slag: 'unknown', j_button: 'unknown',
  c_denarius: 'coin', c_scarab: 'scarab', c_arrowhead: 'arrowhead', c_oillamp: 'lamp',
  c_fibula: 'ring', c_beads: 'beads', c_tablet: 'tablet', c_seal: 'unknown', c_shabti: 'idol',
  r_antikythera: 'gear', r_rosetta: 'tablet', r_phaistos: 'die', r_torc: 'amulet',
  r_astrolabe: 'astrolabe', r_lyre: 'lyre', r_olmec: 'mask',
  l_tut: 'mask', l_crown: 'crown', l_ife: 'idol',
};

export function iconForRelic(relicId: string, glyphFallback?: string): string {
  let id = RELIC_ICON[relicId];
  if (!id && glyphFallback && glyphFallback in ICONS) {
    id = glyphFallback as IconId;
  }
  return ICONS[id ?? 'unknown'];
}
