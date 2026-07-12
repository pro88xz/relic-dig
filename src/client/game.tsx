import './index.css';
import './relic.css';

import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { Rarity, RelicDef } from '../shared/api';
import { useDig } from './hooks/useDig';
import { iconForRelic, ICONS } from './icons';
import { curatorComplete, FOOLS_GOLD_LINE } from './curator';
import { SubmitPanel } from './Submit';
import { CollectionsPanel } from './Collections';

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


export const App = () => {
  const {
    username, siteId, catalog, tiles, heat, streak, bonusDigs, theme,
    digsUsed, digsTotal, loading, digging, justDug,
    toast, error, sound,
    dig, toggleSound, dismissToast, devReset,
  } = useDig();
  const [workshopOpen, setWorkshopOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

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
          <button className="relic-museum-btn" onClick={() => setCollectionsOpen(true)}>Museum</button>
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

      {collectionsOpen ? <CollectionsPanel onClose={() => setCollectionsOpen(false)} /> : null}
      {workshopOpen ? <SubmitPanel onClose={() => setWorkshopOpen(false)} /> : null}

      
      
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
