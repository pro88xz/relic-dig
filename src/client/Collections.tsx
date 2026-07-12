import { useEffect, useState } from 'react';
import type { ProgressResponse, LeaderboardResponse } from '../shared/api';
import { iconForRelic } from './icons';

const RARITY_COLOR: Record<string, string> = {
  junk: '#8a8175', common: '#c9b38a', rare: '#5aa6c9', legendary: '#e0a93b',
};

function Svg({ markup, color, size }: { markup: string; color: string; size: number }) {
  return (
    <span className="relic-svg" style={{ color, width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: markup }} />
  );
}

export function CollectionsPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'wings' | 'board'>('wings');
  const [data, setData] = useState<ProgressResponse | null>(null);
  const [board, setBoard] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/progress');
        setData(await res.json());
        const lb = await fetch('/api/leaderboard');
        setBoard(await lb.json());
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="relic-museum-backdrop" onClick={onClose}>
      <div className="relic-museum" onClick={(e) => e.stopPropagation()}>
        <div className="relic-museum-head">
          <span>THE MUSEUM</span>
          <button onClick={onClose} className="relic-museum-close" aria-label="close">✕</button>
        </div>
        <div className="relic-tabs">
          <button className={'relic-tab' + (tab === 'wings' ? ' relic-tab-active' : '')} onClick={() => setTab('wings')}>Wings</button>
          <button className={'relic-tab' + (tab === 'board' ? ' relic-tab-active' : '')} onClick={() => setTab('board')}>Top Curators</button>
        </div>
        {loading ? (
          <div className="relic-museum-empty">Opening the archive…</div>
        ) : !data ? (
          <div className="relic-museum-empty">Could not load your progress.</div>
        ) : (
          <div className="relic-collections">
            <div className="relic-rank">
              <div className="relic-rank-label">YOUR RANK</div>
              <div className="relic-rank-title">{data.rank}</div>
              <div className="relic-rank-sub">
                {data.completedCollections} of {data.totalCollections} wings complete
              </div>
            </div>
            <div className="relic-exhibit">
              <div className="relic-exhibit-head"><span>WEEKLY COMMUNITY EXHIBIT</span></div>
              <div className="relic-exhibit-name">{data.exhibit.reward.name}</div>
              <div className="relic-exhibit-blurb">{data.exhibit.reward.blurb}</div>
              <div className="relic-exhibit-bar">
                <div className="relic-exhibit-fill"
                  style={{ width: `${Math.min(100, (data.exhibit.progress / data.exhibit.goal) * 100)}%` }} />
              </div>
              <div className="relic-exhibit-count">
                {data.exhibit.complete
                  ? '◆ UNLOCKED — the community did it!'
                  : `${data.exhibit.progress} / ${data.exhibit.goal} relics unearthed by the community`}
              </div>
            </div>
            {tab === 'wings' ? (
              data.collections.map((col) => (
              <div key={col.id} className={'relic-wing' + (col.complete ? ' relic-wing-complete' : '')}>
                <div className="relic-wing-head">
                  <div className="relic-wing-name">{col.name}</div>
                  <div className="relic-wing-count">
                    {col.complete ? '◆ COMPLETE' : `${col.have} / ${col.total}`}
                  </div>
                </div>
                <div className="relic-wing-blurb">{col.blurb}</div>
                <div className="relic-wing-hint">Best excavated at: {col.themeHint}</div>
                <div className="relic-wing-relics">
                  {col.relics.map((r) => {
                    const color = RARITY_COLOR[r.rarity] ?? '#c9b38a';
                    return (
                      <div key={r.id}
                        className={'relic-wing-slot' + (r.owned ? '' : ' relic-wing-slot-missing')}
                        title={r.owned ? r.name : (r.piecesHeld > 0 ? `${r.name} — ${r.piecesHeld}/${r.piecesTotal} pieces` : '???')}>
                        <Svg markup={iconForRelic(r.id)} color={r.owned ? color : '#3a2d1f'} size={24} />
                        {!r.owned && r.piecesTotal > 1 && r.piecesHeld > 0 ? (
                          <span className="relic-slot-frag">{r.piecesHeld}/{r.piecesTotal}</span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
              ))
            ) : (
              <div className="relic-board">
                {board && board.top.length > 0 ? (
                  <>
                    {board.myRank ? (
                      <div className="relic-board-me">You are ranked #{board.myRank} · {board.myScore} pts</div>
                    ) : (
                      <div className="relic-board-me">Complete a wing to join the board.</div>
                    )}
                    {board.top.map((e, i) => (
                      <div key={e.username} className={'relic-board-row' + (i < 3 ? ' relic-board-top' : '')}>
                        <span className="relic-board-rank">#{i + 1}</span>
                        <span className="relic-board-name">{e.username}</span>
                        <span className="relic-board-score">{e.wings} wings · {e.relics} relics</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="relic-museum-empty">No curators ranked yet. Be the first.</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
