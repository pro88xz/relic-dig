import { useEffect, useState } from 'react';
import type { Rarity, SubmissionWithVote } from '../shared/api';
import { ICONS, IconId, TIER_ICONS } from './icons';

const RARITY_COLOR: Record<Rarity, string> = {
  junk: '#8a8175', common: '#c9b38a', rare: '#5aa6c9', legendary: '#e0a93b',
};


function Svg({ markup, color, size }: { markup: string; color: string; size: number }) {
  return (
    <span
      className="relic-svg"
      style={{ color, width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

export function SubmitPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'design' | 'vote'>('vote');
  const [name, setName] = useState('');
  const [plaque, setPlaque] = useState('');
  const [rarity, setRarity] = useState<'common' | 'rare' | 'legendary'>('common');
  const [icon, setIcon] = useState<IconId>('coin');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [items, setItems] = useState<SubmissionWithVote[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!name.trim() || !plaque.trim()) { setMsg('Give it a name and a plaque.'); return; }
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch('/api/submit-relic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, plaque, rarity, icon }),
      });
      if (!res.ok) throw new Error();
      setName(''); setPlaque('');
      setMsg('Submitted! The committee will consider it.');
      setTab('vote');
      load();
    } catch {
      setMsg('Submission failed. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const vote = async (id: string) => {
    try {
      const res = await fetch('/api/vote-relic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setItems((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, votes: data.submission.votes, youVoted: data.youVoted } : it
        )
      );
    } catch {
      // ignore
    }
  };

  return (
    <div className="relic-museum-backdrop" onClick={onClose}>
      <div className="relic-museum" onClick={(e) => e.stopPropagation()}>
        <div className="relic-museum-head">
          <span>THE WORKSHOP</span>
          <button onClick={onClose} className="relic-museum-close" aria-label="close">✕</button>
        </div>
        <div className="relic-tabs">
          <button
            className={'relic-tab' + (tab === 'vote' ? ' relic-tab-active' : '')}
            onClick={() => setTab('vote')}
          >Vote</button>
          <button
            className={'relic-tab' + (tab === 'design' ? ' relic-tab-active' : '')}
            onClick={() => setTab('design')}
          >Design one</button>
        </div>

        {tab === 'design' ? (
          <div className="relic-design">
            <label className="relic-field-label">Relic name</label>
            <input className="relic-input" value={name} maxLength={60}
              placeholder="The Goblin's Left Sock"
              onChange={(e) => setName(e.target.value)} />
            <label className="relic-field-label">Museum plaque</label>
            <textarea className="relic-input relic-textarea" value={plaque} maxLength={200}
              placeholder="Cursed. Smells of adventure and poor decisions."
              onChange={(e) => setPlaque(e.target.value)} />
            <label className="relic-field-label">Rarity</label>
            <div className="relic-rarity-row">
              {(['common', 'rare', 'legendary'] as const).map((r) => (
                <button key={r}
                  className={'relic-rarity-chip' + (rarity === r ? ' relic-rarity-chip-on' : '')}
                  style={{ borderColor: RARITY_COLOR[r], color: rarity === r ? '#14100b' : RARITY_COLOR[r], background: rarity === r ? RARITY_COLOR[r] : 'transparent' }}
                  onClick={() => { setRarity(r); setIcon(TIER_ICONS[r][0]); }}
                >{r}</button>
              ))}
            </div>
            <label className="relic-field-label">Icon</label>
            <div className="relic-icon-row">
              {TIER_ICONS[rarity].map((ic) => (
                <button key={ic}
                  className={'relic-icon-choice' + (icon === ic ? ' relic-icon-choice-on' : '')}
                  onClick={() => setIcon(ic)}
                >
                  <Svg markup={ICONS[ic]} color={RARITY_COLOR[rarity]} size={22} />
                </button>
              ))}
            </div>
            {msg ? <div className="relic-design-msg">{msg}</div> : null}
            <button className="relic-submit-btn" onClick={submit} disabled={busy}>
              {busy ? 'Submitting…' : 'Submit to the committee'}
            </button>
          </div>
        ) : (
          <div className="relic-vote-list">
            {loading ? (
              <div className="relic-museum-empty">Loading submissions…</div>
            ) : items.length === 0 ? (
              <div className="relic-museum-empty">No submissions yet. Be the first — tap “Design one”.</div>
            ) : (
              items.map((it, rank) => {
                const buried = it.votes >= 1;
                const rankLabel = rank === 0 ? '#1 MOST WANTED' : rank === 1 ? '#2' : rank === 2 ? '#3' : null;
                return (
                <div key={it.id} className={'relic-vote-card' + (buried ? ' relic-vote-card-buried' : '')} style={{ borderColor: RARITY_COLOR[it.rarity] }}>
                  <div className="relic-vote-icon">
                    <Svg markup={ICONS[(it.icon as IconId) in ICONS ? (it.icon as IconId) : 'unknown']} color={RARITY_COLOR[it.rarity]} size={30} />
                  </div>
                  <div className="relic-vote-body">
                    <div className="relic-vote-name">{it.name}</div>
                    <div className="relic-vote-meta">
                      <span className="relic-vote-rarity" style={{ color: RARITY_COLOR[it.rarity] }}>{it.rarity}</span>
                      {rankLabel ? <span className="relic-vote-rank">{rankLabel}</span> : null}
                      {buried ? <span className="relic-vote-buried">◆ buried in the game</span> : null}
                    </div>
                    <div className="relic-vote-plaque">{it.plaque}</div>
                    <div className="relic-vote-author">by u/{it.author}</div>
                  </div>
                  <button
                    className={'relic-vote-btn' + (it.youVoted ? ' relic-vote-btn-on' : '')}
                    onClick={() => vote(it.id)}
                  >▲ {it.votes}</button>
                </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
