import { useCallback, useEffect, useState } from 'react';
import type {
  InitResponse,
  DigResponse,
  MuseumResponse,
  RelicDef,
  Tile,
} from '../../shared/api';
import { curatorLine, isFoolsGold } from '../curator';
import {
  setSoundEnabled,
  isSoundEnabled,
  sfxThud,
  sfxFind,
  sfxRare,
  sfxLegendary,
  sfxComplete,
} from '../sound';

export type { RelicDef };

type Toast = { relic: RelicDef; piece: number; completed: boolean; curator: string; foolsGold: boolean } | null;

export function useDig() {
  const [username, setUsername] = useState<string>('');
  const [siteId, setSiteId] = useState<string>('');
  const [catalog, setCatalog] = useState<RelicDef[]>([]);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [heat, setHeat] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [bonusDigs, setBonusDigs] = useState(0);
  const [digsUsed, setDigsUsed] = useState(0);
  const [digsTotal, setDigsTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [digging, setDigging] = useState(false);
  const [justDug, setJustDug] = useState<number | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [error, setError] = useState<string | null>(null);
  const [sound, setSound] = useState(true);

  const [museum, setMuseum] = useState<MuseumResponse | null>(null);
  const [museumOpen, setMuseumOpen] = useState(false);

  useEffect(() => {
    setSoundEnabled(true);
    (async () => {
      try {
        const res = await fetch('/api/init');
        const data = (await res.json()) as InitResponse;
        setUsername(data.username);
        setSiteId(data.siteId);
        setCatalog(data.catalog);
        setTiles(data.tiles);
        setHeat(data.heat ?? []);
        setStreak(data.streak ?? 0);
        setBonusDigs(data.bonusDigs ?? 0);
        setDigsUsed(data.digsUsed);
        setDigsTotal(data.digsTotal);
      } catch {
        setError('Could not open the dig site. Try refreshing.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleSound = useCallback(() => {
    setSound((prev) => {
      const next = !prev;
      setSoundEnabled(next);
      return next;
    });
  }, []);

  const dig = useCallback(
    async (index: number) => {
      if (digging) return;
      const tile = tiles[index];
      if (!tile || tile.dug) return;
      if (digsUsed >= digsTotal) return;

      setDigging(true);
      setJustDug(index);
      try {
        const res = await fetch('/api/dig', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ index }),
        });
        if (!res.ok) {
          setDigging(false);
          return;
        }
        const data = (await res.json()) as DigResponse;
        setTiles((prev) =>
          prev.map((t) =>
            t.index === index ? { ...t, dug: true, content: data.content } : t
          )
        );
        setHeat(data.heat ?? []);
        setStreak(data.streak ?? 0);
        setBonusDigs(data.bonusDigs ?? 0);
        setDigsUsed(data.digsUsed);
        setDigsTotal(data.digsTotal);

        if (data.content.kind === 'empty') {
          sfxThud();
        } else if (data.revealed) {
          const r = data.revealed.rarity;
          if (r === 'legendary') sfxLegendary();
          else if (r === 'rare') sfxRare();
          else sfxFind();
          if (data.completedRelic) setTimeout(() => sfxComplete(), 500);
          const piece = data.content.kind === 'relic' ? data.content.piece : 1;
          const fg = isFoolsGold(data.revealed.rarity);
          setToast({ relic: data.revealed, piece, completed: data.completedRelic, curator: curatorLine(data.revealed.rarity), foolsGold: fg });
        }
      } catch {
        setError('That dig hit bedrock. Try again.');
      } finally {
        setDigging(false);
        setTimeout(() => setJustDug(null), 400);
      }
    },
    [digging, tiles, digsUsed, digsTotal]
  );

  const openMuseum = useCallback(async () => {
    setMuseumOpen(true);
    try {
      const res = await fetch('/api/museum');
      const data = (await res.json()) as MuseumResponse;
      setMuseum(data);
    } catch {
      // leave museum null; UI shows empty state
    }
  }, []);

  const closeMuseum = useCallback(() => setMuseumOpen(false), []);
  const dismissToast = useCallback(() => setToast(null), []);

  // DEV: reset today's digs and reload the grid.
  const devReset = useCallback(async () => {
    try {
      await fetch('/api/dev/reset', { method: 'POST' });
      const res = await fetch('/api/init');
      const data = (await res.json()) as InitResponse;
      setTiles(data.tiles);
      setHeat(data.heat ?? []);
        setStreak(data.streak ?? 0);
        setBonusDigs(data.bonusDigs ?? 0);
      setDigsUsed(data.digsUsed);
      setDigsTotal(data.digsTotal);
      setToast(null);
    } catch {
      setError('Reset failed.');
    }
  }, []);

  return {
    username, siteId, catalog, tiles, heat, streak, bonusDigs,
    digsUsed, digsTotal, loading, digging, justDug,
    toast, error, sound, museum, museumOpen,
    dig, toggleSound, openMuseum, closeMuseum, dismissToast, devReset,
  };
}

export { isSoundEnabled };
