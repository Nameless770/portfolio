// Chiptune sound effects, synthesised live with Web Audio (no audio files).
//
// Each effect is a list of notes. A note is either a tone or a burst of filtered noise:
//   f     tone frequency in Hz            noise  noise band centre in Hz
//   d     length in seconds               q      noise band width (higher = narrower)
//   type  'square' | 'triangle' | 'sawtooth' | 'sine' (tones only, default 'square')
//   to    slide the frequency (or noise band) to this Hz by the end of the note
//   v     relative volume (default 1)
//   at    start offset in seconds. Notes without `at` play one after another;
//         notes with `at` are layered on top and don't move the sequence along.

export const SFX = {
  // Interface
  move: [{ f: 880, d: 0.035 }],
  hover: [{ f: 1760, d: 0.012, type: 'triangle', v: 0.35 }],
  select: [{ f: 523, d: 0.06 }, { f: 784, d: 0.09 }],
  back: [{ f: 392, d: 0.06 }, { f: 262, d: 0.1 }],
  click: [{ f: 1400, d: 0.015, v: 0.6 }, { noise: 4000, d: 0.025, v: 0.6, at: 0 }],
  open: [{ f: 392, d: 0.04 }, { f: 587, d: 0.04 }, { f: 784, d: 0.07 }],
  close: [{ f: 784, d: 0.04 }, { f: 587, d: 0.04 }, { f: 392, d: 0.07 }],
  toggleOn: [{ f: 700, d: 0.03 }, { f: 1050, d: 0.05 }],
  toggleOff: [{ f: 700, d: 0.03 }, { f: 467, d: 0.05 }],
  powerOn: [{ f: 220, to: 880, d: 0.14 }, { f: 1319, d: 0.07, type: 'triangle' }],
  powerOff: [{ f: 880, to: 160, d: 0.2 }],
  denied: [{ f: 147, d: 0.08, type: 'sawtooth', v: 1.4 }, { f: 110, d: 0.16, type: 'sawtooth', v: 1.4, at: 0.1 }],
  bump: [{ f: 95, to: 60, d: 0.07, v: 0.8 }],
  blip: [{ f: 660, d: 0.022, v: 0.3 }],

  // Jingles
  start: [
    { f: 523, d: 0.09 }, { f: 659, d: 0.09 }, { f: 784, d: 0.09 }, { f: 1047, d: 0.3 },
    { f: 131, d: 0.18, type: 'triangle', at: 0 }, { f: 196, d: 0.09, type: 'triangle', at: 0.18 }, { f: 262, d: 0.3, type: 'triangle', at: 0.27 },
  ],
  levelup: [
    { f: 659, d: 0.05 }, { f: 784, d: 0.05 }, { f: 988, d: 0.05 }, { f: 1319, d: 0.14 },
    { f: 2637, d: 0.05, type: 'triangle', v: 0.6, at: 0.2 }, { f: 3136, d: 0.08, type: 'triangle', v: 0.5, at: 0.25 },
  ],
  ach: [
    { f: 523, d: 0.08 }, { f: 659, d: 0.08 }, { f: 784, d: 0.08 }, { f: 1047, d: 0.18 },
    { f: 262, d: 0.42, type: 'triangle', v: 0.6, at: 0 },
  ],
  complete: [
    { f: 523, d: 0.09 }, { f: 659, d: 0.09 }, { f: 784, d: 0.09 }, { f: 1047, d: 0.18 },
    { f: 988, d: 0.09 }, { f: 1047, d: 0.09 }, { f: 1319, d: 0.09 }, { f: 1568, d: 0.4 },
    { f: 131, d: 0.36, type: 'triangle', at: 0 }, { f: 196, d: 0.36, type: 'triangle', at: 0.36 }, { f: 262, d: 0.4, type: 'triangle', at: 0.72 },
  ],
  secret: [{ f: 392, d: 0.07 }, { f: 523, d: 0.07 }, { f: 659, d: 0.07 }, { f: 784, d: 0.07 }, { f: 1047, d: 0.07 }, { f: 1319, d: 0.25 }],
  loot: [{ f: 110, to: 70, d: 0.07 }, { f: 988, d: 0.07 }, { f: 1319, d: 0.28 }],

  // Places and things
  bag: [{ noise: 1500, d: 0.05, v: 0.8 }, { noise: 2200, d: 0.05, v: 0.7 }, { f: 1200, d: 0.02, v: 0.5 }],
  scroll: [{ noise: 900, to: 4200, d: 0.2, v: 0.9 }, { f: 784, d: 0.05, type: 'triangle', at: 0.14 }, { f: 1047, d: 0.09, type: 'triangle', at: 0.19 }],
  page: [{ noise: 2600, to: 1200, d: 0.07, v: 0.9, q: 0.7 }, { noise: 1800, to: 3600, d: 0.09, v: 0.7, q: 0.7 }],
  paper: [{ noise: 2000, to: 4500, d: 0.12, v: 0.9, q: 0.7 }, { f: 784, d: 0.05, type: 'triangle' }],
  chestOpen: [{ f: 196, to: 150, d: 0.06 }, { f: 98, d: 0.08, type: 'triangle' }, { f: 784, d: 0.05, type: 'triangle' }, { f: 1175, d: 0.12, type: 'triangle' }],
  raven: [{ noise: 700, to: 3200, d: 0.22, v: 0.9 }, { f: 1500, to: 2300, d: 0.05, type: 'triangle', at: 0.14 }, { f: 1700, to: 2700, d: 0.06, type: 'triangle', at: 0.21 }],
  warp: [{ f: 180, to: 1400, d: 0.32, type: 'sawtooth', v: 0.6 }, { f: 360, to: 2800, d: 0.32, type: 'triangle', v: 0.5, at: 0 }, { f: 1568, d: 0.08, type: 'triangle' }],
  hoot: [{ f: 560, to: 470, d: 0.15, type: 'sine' }, { f: 520, to: 420, d: 0.22, type: 'sine', at: 0.2 }],

  // Equipping an inventory item, one per item class
  eq_gem: [{ f: 1568, d: 0.04, type: 'triangle' }, { f: 2093, d: 0.04, type: 'triangle' }, { f: 2637, d: 0.1, type: 'triangle' }],
  eq_sword: [{ noise: 5500, d: 0.16, v: 0.8, q: 2 }, { f: 2200, to: 3000, d: 0.14, type: 'sawtooth', v: 0.25, at: 0 }],
  eq_chest: [{ f: 120, to: 80, d: 0.08 }, { f: 988, d: 0.05, type: 'triangle' }, { f: 1319, d: 0.09, type: 'triangle' }],
  eq_book: [{ noise: 1500, to: 3800, d: 0.1, v: 0.9, q: 0.8 }, { f: 659, d: 0.06, type: 'triangle', at: 0.08 }],
  eq_potion: [{ f: 320, to: 900, d: 0.05, type: 'sine' }, { f: 420, to: 1100, d: 0.05, type: 'sine' }, { f: 540, to: 1400, d: 0.07, type: 'sine' }],
  eq_shield: [{ f: 196, d: 0.05 }, { noise: 3000, d: 0.1, v: 0.8, q: 2, at: 0 }, { f: 294, d: 0.1, type: 'triangle' }],
};

/** Effects listed in Options → Sound test, in order. */
export const SOUND_TEST = [
  ['start', 'New game'], ['move', 'Cursor'], ['select', 'Select'], ['back', 'Back'],
  ['levelup', 'Level up'], ['ach', 'Trophy'], ['complete', 'Completionist'], ['loot', 'Loot'],
  ['bag', 'Open bag'], ['eq_gem', 'Crystal'], ['eq_sword', 'Blade'], ['eq_chest', 'Chest'],
  ['eq_book', 'Tome'], ['eq_potion', 'Potion'], ['eq_shield', 'Shield'], ['scroll', 'Quest scroll'],
  ['page', 'Page turn'], ['raven', 'Raven'], ['warp', 'Realm warp'], ['hoot', 'Byte'],
  ['blip', 'Byte talks'], ['denied', 'Locked'], ['bump', 'Bump'], ['secret', 'Cheat code'],
];

// Jingles never overlap: each waits for the previous one to finish.
const JINGLES = new Set(['start', 'levelup', 'ach', 'complete', 'secret', 'loot']);

const BASE = 0.035;
// Rough loudness compensation so every waveform sits at a similar level.
const TYPE_GAIN = { square: 1, sawtooth: 0.8, triangle: 2.2, sine: 2.2, noise: 3.2 };

const noiseBuffers = new WeakMap();
function noiseBuffer(C) {
  let buf = noiseBuffers.get(C);
  if (!buf) {
    buf = C.createBuffer(1, Math.floor(C.sampleRate * 0.5), C.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    noiseBuffers.set(C, buf);
  }
  return buf;
}

/** Schedule effect `name` on any AudioContext, starting at time t0. Returns its length in seconds. */
export function scheduleSfx(C, dest, name, t0, pitch = 1) {
  const notes = SFX[name];
  if (!notes) return 0;
  let cursor = 0;
  let length = 0;
  for (const n of notes) {
    const offset = n.at ?? cursor;
    const start = t0 + offset;
    const end = start + n.d;
    const kind = n.noise ? 'noise' : n.type || 'square';

    const gain = C.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(BASE * TYPE_GAIN[kind] * (n.v ?? 1), start + Math.min(0.004, n.d / 4));
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    gain.connect(dest);

    let src;
    if (n.noise) {
      src = C.createBufferSource();
      src.buffer = noiseBuffer(C);
      const band = C.createBiquadFilter();
      band.type = 'bandpass';
      band.Q.value = n.q ?? 1.2;
      band.frequency.setValueAtTime(n.noise, start);
      if (n.to) band.frequency.exponentialRampToValueAtTime(n.to, end);
      src.connect(band);
      band.connect(gain);
    } else {
      src = C.createOscillator();
      src.type = kind;
      src.frequency.setValueAtTime(n.f * pitch, start);
      if (n.to) src.frequency.exponentialRampToValueAtTime(n.to * pitch, end);
      src.connect(gain);
    }
    src.start(start);
    src.stop(end + 0.02);

    if (n.at === undefined) cursor = offset + n.d;
    length = Math.max(length, offset + n.d);
  }
  return length;
}

let ac = null;
let jingleFreeAt = 0;
const jingleListeners = new Set();

/**
 * The page's one AudioContext, shared by sound effects and music. Browsers only let audio
 * start after a click or key press, so the first call should come from one. Null without Web Audio.
 */
export function audioContext() {
  try {
    if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === 'suspended' && !document.hidden) ac.resume();
    return ac;
  } catch {
    return null;
  }
}

/** Call `fn(startTime, seconds)` whenever a jingle is scheduled (the music ducks under them). */
export function onJingle(fn) {
  jingleListeners.add(fn);
  return () => jingleListeners.delete(fn);
}

/** Play an effect now (jingles queue behind any jingle already playing). `pitch` scales every tone. */
export function playSfx(name, { pitch = 1 } = {}) {
  try {
    const C = audioContext();
    if (!C) return;
    let t0 = C.currentTime + 0.01;
    const jingle = JINGLES.has(name);
    if (jingle) {
      t0 = Math.max(t0, jingleFreeAt);
      if (t0 - C.currentTime > 2) return; // don't let a backlog build up
    }
    const length = scheduleSfx(C, C.destination, name, t0, pitch);
    if (jingle) {
      jingleFreeAt = t0 + length + 0.06;
      jingleListeners.forEach((fn) => fn(t0, length));
    }
  } catch {
    // Audio is optional; ignore browsers that block or lack Web Audio.
  }
}
