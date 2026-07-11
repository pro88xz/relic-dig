import './index.css';
import './relic.css';

import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { Rarity, RelicDef, MuseumEntry } from '../shared/api';
import { useDig } from './hooks/useDig';
import { iconForRelic, ICONS } from './icons';
import { curatorComplete, FOOLS_GOLD_LINE } from './curator';
import { SubmitPanel } from './Submit';

const RARITY_COLOR: Record<Rarity, string> = {
  junk: '#8a8175',
  common: '#c9b38a',
  rare: '#5aa6c9',
  legendary: '#e0a93b',
};
const RARITY_LABEL: Record<Rarity, string> = {
  junk: 'Junk',
  common: 'Common',
  rare: 'Rare',
  legendary: 'Legendary',
};

function Svg({ markup, color, size }: { markup: string; color: string; size: number }) {
  return (
    <span
      className="relic-svg"
      style={{ color, width: size, height: size, filter: `drop-shadow(0 0 6px ${color}aa)` }}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

function Tile({
  dug,
  relicId,
  color,
  heat,
  shaking,
  glyph,
  disabled,
  onClick,
}: {
  dug: boolean;
  relicId: string | null;
  glyph: string | null;
  color: string | null;
  heat: number;
  shaking: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const heatClass = !dug && heat === 2 ? ' relic-tile-hot' : !dug && heat === 1 ? ' relic-tile-warm' : '';
  return (
    <button
      onClick={onClick}
      disabled={disabled || dug}
      className={'relic-tile' + (dug ? ' relic-tile-dug' : '') + (shaking ? ' relic-tile-shake' : '') + heatClass}
      aria-label={dug ? 'excavated' : 'buried ground'}
    >
      {dug && relicId ? (
        <Svg markup={iconForRelic(relicId, glyph ?? undefined)} color={color ?? '#c9b38a'} size={26} />
      ) : dug ? (
        <span className="relic-empty">·</span>
      ) : null}
    </button>
  );
}

function RevealToast({
  relic,
  piece,
  completed,
  curator,
  foolsGold,
  onDismiss,
}: {
  relic: RelicDef;
  piece: number;
  completed: boolean;
  curator: string;
  foolsGold: boolean;
  onDismiss: () => void;
}) {
  const color = foolsGold ? '#8a8175' : RARITY_COLOR[relic.rarity];
  const legendary = relic.rarity === 'legendary' && !foolsGold;
  return (
    <>
      {legendary ? <div className="relic-legendary-dim" /> : null}
      <div
        className={'relic-toast' + (legendary ? ' relic-toast-legendary' : '') + (foolsGold ? ' relic-toast-fake' : '')}
        onClick={onDismiss}
        role="button"
      >
        {legendary ? <div className="relic-legendary-kicker">◆ A LEGEND SURFACES ◆</div> : null}
        <div className="relic-toast-glyph">
          <Svg markup={iconForRelic(relic.id, relic.glyph)} color={color} size={64} />
        </div>
        <div className="relic-toast-rarity" style={{ color }}>
          {foolsGold ? "Fool's Gold" : RARITY_LABEL[relic.rarity]}
          {!foolsGold && relic.pieces > 1 ? ` · piece ${piece} of ${relic.pieces}` : ''}
        </div>
        <div className="relic-toast-name">{relic.name}</div>
        <div className="relic-toast-plaque">{foolsGold ? FOOLS_GOLD_LINE : relic.plaque}</div>
        {completed && !foolsGold ? <div className="relic-toast-complete">{curatorComplete()}</div> : null}
        {!foolsGold ? <div className="relic-toast-curator">{curator}</div> : null}
        <div className="relic-toast-dismiss">tap to continue</div>
      </div>
    </>
  );
}

function Museum({
  entries,
  catalog,
  onClose,
}: {
  entries: MuseumEntry[];
  catalog: RelicDef[];
  onClose: () => void;
}) {
  const byId = Object.fromEntries(catalog.map((r) => [r.id, r]));
  const held = entries
    .map((e) => ({ entry: e, relic: byId[e.relicId] }))
    .filter((x) => x.relic)
    .sort((a, b) => rank(b.relic!.rarity) - rank(a.relic!.rarity));

  const totalKinds = catalog.filter((r) => r.rarity !== 'junk').length;
  const completeCount = held.filter((h) => h.entry.complete && h.relic!.rarity !== 'junk').length;

  return (
    <div className="relic-museum-backdrop" onClick={onClose}>
      <div className="relic-museum" onClick={(e) => e.stopPropagation()}>
        <div className="relic-museum-head">
          <span>THE MUSEUM</span>
          <button onClick={onClose} className="relic-museum-close" aria-label="close">✕</button>
        </div>
        <div className="relic-museum-progress">
          {completeCount} / {totalKinds} relics restored
        </div>
        {held.length === 0 ? (
          <div className="relic-museum-empty">Nothing catalogued yet. The dig awaits.</div>
        ) : (
          <div className="relic-museum-grid">
            {held.map(({ entry, relic }) => {
              const total = relic!.pieces;
              const have = entry.piecesHeld.filter((n) => n > 0).length;
              const color = RARITY_COLOR[relic!.rarity];
              return (
                <div
                  key={entry.relicId}
                  className="relic-card"
                  style={{ borderColor: color, opacity: entry.complete ? 1 : 0.9 }}
                >
                  <div className="relic-card-glyph">
                    <Svg markup={iconForRelic(relic!.id, relic!.glyph)} color={color} size={34} />
                  </div>
                  <div className="relic-card-name">{relic!.name}</div>
                  <div className="relic-card-rarity" style={{ color }}>{RARITY_LABEL[relic!.rarity]}</div>
                  {total > 1 ? (
                    <div className="relic-card-progress">
                      {entry.complete ? '◆ complete' : `${have} / ${total} pieces`}
                    </div>
                  ) : null}
                  <div className="relic-card-plaque">{relic!.plaque}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function rank(r: Rarity): number {
  return { junk: 0, common: 1, rare: 2, legendary: 3 }[r];
}

export const App = () => {
  const {
    username, siteId, catalog, tiles, heat, streak, bonusDigs, theme,
    digsUsed, digsTotal, loading, digging, justDug,
    toast, error, sound, museum, museumOpen,
    dig, toggleSound, openMuseum, closeMuseum, dismissToast, devReset,
  } = useDig();
  const [workshopOpen, setWorkshopOpen] = useState(false);

  const digsLeft = digsTotal - digsUsed;
  const catById = Object.fromEntries(catalog.map((r) => [r.id, r]));

  const rootStyle = theme
    ? ({
        background: `radial-gradient(circle at 50% -10%, ${theme.bgTop} 0%, ${theme.bgBottom} 70%)`,
        ['--relic-lamp' as string]: theme.accent,
      } as React.CSSProperties)
    : undefined;

  return (
    <div className="relic-root" style={rootStyle}>
      <header className="relic-header">
        <div className="relic-title">RELIC</div>
        <div className="relic-theme-name" style={theme ? { color: theme.accent } : undefined}>
          {theme ? theme.kicker : ''}
        </div>
        <div className="relic-sub">
          {theme ? theme.name : 'Dig Site'} · {siteId || '…'}
          {username ? <span className="relic-digger"> · {username}</span> : null}
        </div>
        {theme ? <div className="relic-theme-blurb">{theme.blurb}</div> : null}
      </header>

      <div className="relic-status">
        <div className="relic-digs">
          <span className="relic-digs-label">Digs left</span>
          <span className="relic-digs-count">
            {loading ? '…' : Math.max(digsLeft, 0)}
            <span className="relic-digs-total"> / {digsTotal}</span>
          </span>
          {streak > 0 ? (
            <span className="relic-streak">🔥 {streak}-day streak{bonusDigs > 0 ? ` · +${bonusDigs} dig${bonusDigs > 1 ? 's' : ''}` : ''}</span>
          ) : null}
        </div>
        <div className="relic-controls">
          <button
            className={'relic-newsite-btn' + (digsLeft <= 0 ? ' relic-newsite-btn-ready' : '')}
            onClick={devReset}
            title="Excavate a fresh dig site"
          >
            ↻ New site
          </button>
          <button className="relic-icon-btn" onClick={toggleSound} aria-label="toggle sound">
            {sound ? '🔊' : '🔈'}
          </button>
          <button className="relic-museum-btn" onClick={openMuseum}>Museum</button>
          <button className="relic-museum-btn" onClick={() => setWorkshopOpen(true)}>Workshop</button>
        </div>
      </div>

      {error ? <div className="relic-error">{error}</div> : null}

      <div className="relic-grid">
        {loading
          ? Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="relic-tile relic-tile-skeleton" />
            ))
          : tiles.map((t) => {
              const relicId =
                t.dug && t.content?.kind === 'relic' ? t.content.relicId : null;
              const color = relicId
                ? RARITY_COLOR[catById[relicId]?.rarity ?? 'common']
                : null;
              const relicGlyph = relicId ? (catById[relicId]?.glyph ?? null) : null;
              return (
                <Tile
                  key={t.index}
                  dug={t.dug}
                  relicId={relicId}
                  glyph={relicGlyph}
                  color={color}
                  heat={heat[t.index] ?? 0}
                  shaking={justDug === t.index}
                  disabled={digging || digsLeft <= 0}
                  onClick={() => dig(t.index)}
                />
              );
            })}
      </div>

      {digsLeft <= 0 && !loading ? (
        <div className="relic-done">Today&apos;s digs are spent. Fresh ground tomorrow.</div>
      ) : (
        <div className="relic-hint">Warm tiles sit near buried treasure. Dig wisely.</div>
      )}

      {toast ? (
        <RevealToast
          relic={toast.relic}
          piece={toast.piece}
          completed={toast.completed}
          curator={toast.curator}
          foolsGold={toast.foolsGold}
          onDismiss={dismissToast}
        />
      ) : null}

      {workshopOpen ? <SubmitPanel onClose={() => setWorkshopOpen(false)} /> : null}

      {museumOpen && museum ? (
        <Museum entries={museum.entries} catalog={museum.catalog} onClose={closeMuseum} />
      ) : null}
      {museumOpen && !museum ? (
        <div className="relic-museum-backdrop" onClick={closeMuseum}>
          <div className="relic-museum-empty">Opening the archive…</div>
        </div>
      ) : null}
    </div>
  );
};

// touch ICONS so the import is used even if all lookups go through iconForRelic
void ICONS;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
