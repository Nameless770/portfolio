// Background music player: a small step sequencer for the chiptune pieces in tracks.js.
// Notes are scheduled a moment ahead on the Web Audio clock, so timing stays exact even when
// the page is busy. The playlist loops: each piece plays its `passes`, then the next begins.
import { audioContext, onJingle } from './sfx.js';
import { TRACKS } from './tracks.js';

export const VOLUME = 0.3; // overall music level; keeps it a little under the sound effects
const LOOKAHEAD = 0.2; // seconds of music scheduled ahead of the clock
const PUMP_MS = 50; // how often the scheduler wakes up
const GAP = 1.2; // silence between pieces, in seconds
const DUCK = 0.3; // share of VOLUME kept while a reward jingle plays

const SEMITONE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** "F#4" → 369.99 Hz. */
export function noteFreq(name) {
  const m = /^([A-G])(#|b)?(\d)$/.exec(name);
  if (!m) throw new Error(`Unknown note "${name}"`);
  const midi = (Number(m[3]) + 1) * 12 + SEMITONE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  return 440 * 2 ** ((midi - 69) / 12);
}

/** "D5/4 G4/2 -/2 |" → [{ f, ticks }] (f is 0 for a rest; bar lines are skipped). */
export function parseNotes(src = '') {
  return src
    .split(/[\s|]+/)
    .filter(Boolean)
    .map((tok) => {
      const [name, len] = tok.split('/');
      const ticks = Number(len);
      if (!(ticks > 0)) throw new Error(`Bad length in "${tok}"`);
      return { f: name === '-' ? 0 : noteFreq(name), ticks };
    });
}

const total = (src) => parseNotes(src).reduce((sum, n) => sum + n.ticks, 0);

/** Problems in a track's notation: bars of the wrong length or voices out of step. Empty when fine. */
export function checkTrack(track) {
  const problems = [];
  track.voices.forEach((v, i) => {
    v.notes.split('|').forEach((bar, b) => {
      const len = total(bar);
      if (len && len !== track.bar) problems.push(`${track.id} voice ${i + 1}, bar ${b + 1}: ${len} sixteenths, expected ${track.bar}`);
    });
  });
  for (const part of ['intro', 'notes']) {
    const lengths = track.voices.map((v) => total(v[part]));
    if (new Set(lengths).size > 1) problems.push(`${track.id}: voices' ${part} lengths differ (${lengths.join(', ')})`);
  }
  return problems;
}

if (import.meta.env?.DEV) {
  for (const t of TRACKS) {
    try {
      for (const p of checkTrack(t)) console.warn('[music]', p);
    } catch (e) {
      console.warn('[music]', t.id + ':', e.message);
    }
  }
}

// A 25% pulse wave: the thin, reedy lead of 8-bit consoles.
const pulseWaves = new WeakMap();
function pulseWave(C) {
  let wave = pulseWaves.get(C);
  if (!wave) {
    const n = 48;
    const real = new Float32Array(n);
    const imag = new Float32Array(n);
    for (let k = 1; k < n; k++) real[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * 0.25);
    wave = C.createPeriodicWave(real, imag);
    pulseWaves.set(C, wave);
  }
  return wave;
}

/** Schedule one note of `voice` on any AudioContext. */
export function scheduleNote(C, dest, voice, f, t, len) {
  const osc = C.createOscillator();
  if (voice.wave === 'pulse') osc.setPeriodicWave(pulseWave(C));
  else osc.type = voice.wave;
  osc.frequency.value = f;

  const on = len * (voice.legato ?? 0.9);
  const release = voice.release ?? 0.04;
  const gain = C.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(voice.vol, t + 0.005);
  gain.gain.setTargetAtTime(voice.vol * 0.7, t + 0.005, 0.08); // gentle decay after the attack
  gain.gain.setTargetAtTime(0, t + on, release / 3);

  osc.connect(gain).connect(dest);
  osc.start(t);
  osc.stop(t + on + release + 0.05);
}

/** Schedule a whole track (intro plus `loops` loops) from time t0; returns its length in seconds. For offline rendering and tests. */
export function scheduleTrack(C, dest, track, t0, loops = 1) {
  const tick = 60 / track.bpm / 4;
  let end = t0;
  for (const voice of track.voices) {
    let t = t0;
    const seq = [...parseNotes(voice.intro), ...Array(loops).fill(parseNotes(voice.notes)).flat()];
    for (const n of seq) {
      if (n.f) scheduleNote(C, dest, voice, n.f, t, n.ticks * tick);
      t += n.ticks * tick;
    }
    end = Math.max(end, t);
  }
  return end - t0;
}

let ctx = null;
let master = null;
let current = null; // { index, track, tick, gain, voices }
let timer = null;
const listeners = new Set();

function ensureOutput() {
  ctx = audioContext();
  if (!ctx) return false;
  if (!master) {
    master = ctx.createGain();
    master.gain.value = VOLUME;
    master.connect(ctx.destination);
  }
  return true;
}

function startTrack(index, when) {
  const track = TRACKS[index];
  const gain = ctx.createGain();
  gain.connect(master);
  current = {
    index,
    track,
    tick: 60 / track.bpm / 4,
    gain,
    voices: track.voices.map((spec) => {
      const intro = parseNotes(spec.intro);
      return { spec, seq: [...intro, ...parseNotes(spec.notes)], loopStart: intro.length, i: 0, t: when, loops: 0, done: false };
    }),
  };
  listeners.forEach((fn) => fn(index));
}

function pump() {
  try {
    schedule();
  } catch (e) {
    // Music is optional: a mistake in tracks.js must never break the page.
    console.error('[music]', e);
    stopMusic();
  }
}

function schedule() {
  if (!current) return;
  const horizon = ctx.currentTime + LOOKAHEAD;
  const { track, tick, gain, voices } = current;
  for (const v of voices) {
    while (!v.done && v.t < horizon) {
      const n = v.seq[v.i];
      if (n.f) scheduleNote(ctx, gain, v.spec, n.f, v.t, n.ticks * tick);
      v.t += n.ticks * tick;
      if (++v.i >= v.seq.length) {
        v.i = v.loopStart;
        if (++v.loops >= (track.passes ?? 1)) v.done = true;
      }
    }
  }
  if (voices.every((v) => v.done)) {
    // Piece finished: queue the next one after a short pause. Its notes have all been scheduled,
    // so the old gain node can be let go once they have played.
    const endAt = Math.max(...voices.map((v) => v.t));
    const old = gain;
    setTimeout(() => old.disconnect(), Math.max(0, endAt - ctx.currentTime + 1) * 1000);
    startTrack((current.index + 1) % TRACKS.length, endAt + GAP);
  }
}

function fadeOut(c) {
  if (!c) return;
  const t = ctx.currentTime;
  c.gain.gain.cancelScheduledValues(t);
  c.gain.gain.setTargetAtTime(0, t, 0.12);
  setTimeout(() => c.gain.disconnect(), 900);
}

/** Play piece `index` (from the start). Does nothing if that piece is already playing. */
export function playMusic(index = 0) {
  if (current?.index === index || !ensureOutput()) return;
  fadeOut(current);
  try {
    startTrack(index, ctx.currentTime + 0.1);
  } catch (e) {
    console.error('[music]', e); // a mistake in tracks.js: stay silent rather than break the page
    current = null;
    return;
  }
  if (!timer) timer = setInterval(pump, PUMP_MS);
  pump();
}

/** Fade the music out and stop. */
export function stopMusic() {
  if (!current) return;
  fadeOut(current);
  current = null;
  clearInterval(timer);
  timer = null;
}

/** Call `fn(index)` whenever a new piece starts, including when the playlist moves on. Returns an unsubscribe function. */
export function onTrackChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Duck under reward jingles, so the fanfare is heard over the music.
onJingle((start, length) => {
  if (!master) return;
  const g = master.gain;
  g.cancelScheduledValues(start);
  g.setTargetAtTime(VOLUME * DUCK, start, 0.03);
  g.setTargetAtTime(VOLUME, start + length, 0.25);
});

// Pause while the tab is hidden: background tabs throttle timers, which would make the music stutter.
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!ctx || !current) return;
    if (document.hidden) ctx.suspend();
    else ctx.resume();
  });
}
