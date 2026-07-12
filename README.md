# ⛏️ RELIC

**A daily archaeology dig where the community buries the treasure.**

RELIC is a daily game for Reddit, built on the Developer Platform (Devvit Web). Every day a fresh dig site appears. You get **8 digs** to excavate a 6×6 grid and unearth relics for your Museum — from a Roman Denarius to the Mask of Tutankhamun. The twist: the rarest treasures are designed by other players.

Built for **Reddit's Games with a Hook Hackathon** (July 2026).

---

## How to play

1. **Open the daily dig site.** Each day generates the same grid for everyone — a shared challenge.
2. **Read the ground.** After each dig, nearby tiles glow **warm** or **hot** when buried treasure is close. You're not guessing — you're following a trail.
3. **Spend your 8 digs wisely.** Under the soil: worthless potsherds, common coins, rare fragments, and the occasional legendary artifact.
4. **Build your Museum.** Everything you find is catalogued and persists across days. Rare relics come in **fragments** — you collect the pieces over multiple days to complete a set.
5. **Come back tomorrow.** A new themed site, a growing streak, and you're always one shard away from completing something.

---

## Features

### The daily hook
- A fresh **6×6 dig site every day**, identical for all players so finds can be compared.
- **Proximity heat** turns blind digging into deduction — warmth radiates from explored ground toward buried treasure.
- A persistent **Museum** with rarity tiers (junk → common → rare → legendary) and multi-day **set collection**.

### Retention mechanics
- **Daily streaks** that grant bonus digs (+1 at 3 days, +2 at 7).
- **Five rotating themed dig sites** — the Classic Dig, Pirate Cove, the Pharaoh's Tomb, the Cursed Crypt, and the Sunken Temple — each with its own palette, background, and flavor.

### User contributions
- A **Workshop** where players design their own relics: name, museum plaque, rarity, and icon.
- The community **upvotes** submissions, and the **top-voted relics get buried in the live dig site** for everyone else to find.
- The treasure is, quite literally, made by the players.

### Identity & polish
- **The Curator** — a dry, deadpan museum committee that reacts to every find and authenticates the occasional forgery ("Fool's Gold").
- A dramatic **legendary reveal** when a true masterpiece surfaces.
- **24 real historical artifacts** with museum-style plaques, and ~40 hand-drawn SVG icons grouped by rarity tier.
- **Synthesized audio** (Web Audio API) — every sound is generated in-browser, so there are no audio files to load.

---

## Tech

Built entirely on Reddit's Developer Platform with **Devvit Web**.

- **Client:** React + TypeScript
- **Server:** Hono
- **Storage:** Redis (Museum collections, daily dig state, streaks, community submissions)
- **Audio:** Web Audio API (fully synthesized)
- **Icons:** custom inline SVG set

Everything runs on Reddit's infrastructure — no external hosting.

### Notable engineering
- **Deterministic daily generation:** each day's grid is derived from a date seed, so every player digs the identical site without the server storing a grid.
- **Server-side proximity heat:** warmth is computed from the player's dug tiles and radiates toward rare/legendary treasure, keeping it a game of deduction rather than a solved map.
- **The contribution loop:** player-designed relics are threaded through the same deterministic generator that places the built-in catalog, so community creations become real, diggable treasure.

---

## Running locally
npm install
npm run dev
Requires the Devvit CLI and a Reddit developer account. `npm run dev` starts a playtest session on your test subreddit.

---

*Built with Devvit, React, TypeScript, Hono, Redis, and the Web Audio API.*
