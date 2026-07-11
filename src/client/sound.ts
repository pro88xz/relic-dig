// Synthesized sound via Web Audio — no asset files, no hosting. Works in the
// Devvit webview like any browser. All sounds are generated from oscillators
// and noise so there's nothing to load.

type Ctx = AudioContext | null;

let ctx: Ctx = null;
let enabled = false;

function ac(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

export function setSoundEnabled(v: boolean) {
  enabled = v;
  if (v) {
    // resume must happen after a user gesture; caller wires this to a tap
    ac()?.resume().catch(() => {});
  }
}
export function isSoundEnabled() {
  return enabled;
}

function envTone(
  freq: number,
  dur: number,
  type: OscillatorType,
  gain = 0.18,
  slideTo?: number
) {
  const a = ac();
  if (!a || !enabled) return;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, a.currentTime);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, a.currentTime + dur);
  g.gain.setValueAtTime(0.0001, a.currentTime);
  g.gain.exponentialRampToValueAtTime(gain, a.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
  osc.connect(g).connect(a.destination);
  osc.start();
  osc.stop(a.currentTime + dur + 0.02);
}

function noiseBurst(dur: number, gain = 0.15, lowpass = 1200) {
  const a = ac();
  if (!a || !enabled) return;
  const frames = Math.floor(a.sampleRate * dur);
  const buf = a.createBuffer(1, frames, a.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    // decaying noise
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  }
  const src = a.createBufferSource();
  src.buffer = buf;
  const lp = a.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = lowpass;
  const g = a.createGain();
  g.gain.value = gain;
  src.connect(lp).connect(g).connect(a.destination);
  src.start();
}

// ---- public sound events ----

/** Dull thud — empty ground. */
export function sfxThud() {
  noiseBurst(0.14, 0.12, 500);
  envTone(90, 0.16, 'sine', 0.14, 60);
}

/** Scrape + clink — found something (common/junk). */
export function sfxFind() {
  noiseBurst(0.1, 0.1, 2200);
  envTone(520, 0.12, 'triangle', 0.12);
  setTimeout(() => envTone(780, 0.1, 'triangle', 0.1), 60);
}

/** Bright ascending chime — rare. */
export function sfxRare() {
  const notes = [523, 659, 784]; // C E G
  notes.forEach((f, i) => setTimeout(() => envTone(f, 0.22, 'sine', 0.14), i * 90));
}

/** Deep resonant swell — legendary. */
export function sfxLegendary() {
  envTone(196, 0.9, 'sine', 0.2, 392); // rising G3->G4
  setTimeout(() => envTone(523, 0.7, 'triangle', 0.12), 120);
  setTimeout(() => {
    const notes = [523, 659, 784, 1046];
    notes.forEach((f, i) => setTimeout(() => envTone(f, 0.5, 'sine', 0.12), i * 110));
  }, 250);
}

/** Soft confirmation — set completed. */
export function sfxComplete() {
  const notes = [659, 880, 1319];
  notes.forEach((f, i) => setTimeout(() => envTone(f, 0.3, 'sine', 0.13), i * 120));
}
