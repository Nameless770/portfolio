// Background music: public-domain classical pieces, arranged for chiptune.
//
// Notation: space-separated notes, each NOTE/LENGTH, where LENGTH counts sixteenth notes
// (so /4 is a quarter note, /2 an eighth, /12 a dotted half). "-" is a rest. "|" is a bar
// line: it makes no sound, but the dev build checks every bar adds up to `bar` sixteenths.
//
// Each voice plays its `intro` once, then loops `notes`. Every voice in a track must have the
// same total length, so they stay in step. After `passes` loops the playlist moves on.
//
// Voice options: wave ('pulse' is a thin NES-style lead, or 'square' / 'triangle' / 'sine'),
// vol (loudness), legato (how much of each note's length it sounds, 0–1), release (seconds a
// note rings on after it ends).

const repeat = (s, n) => Array(n).fill(s).join(' ');

// ─── Minuet in G major (Christian Petzold, long credited to J. S. Bach) ─── 3/4
const MINUET_A = `
  D5/4 G4/2 A4/2 B4/2 C5/2 | D5/4 G4/4 G4/4 | E5/4 C5/2 D5/2 E5/2 F#5/2 | G5/4 G4/4 G4/4 |
  C5/4 D5/2 C5/2 B4/2 A4/2 | B4/4 C5/2 B4/2 A4/2 G4/2 | F#4/4 G4/2 A4/2 B4/2 G4/2 | A4/12 |
  D5/4 G4/2 A4/2 B4/2 C5/2 | D5/4 G4/4 G4/4 | E5/4 C5/2 D5/2 E5/2 F#5/2 | G5/4 G4/4 G4/4 |
  C5/4 D5/2 C5/2 B4/2 A4/2 | B4/4 C5/2 B4/2 A4/2 G4/2 | A4/4 B4/2 A4/2 G4/2 F#4/2 | G4/12 |`;
const MINUET_B = `
  B5/4 G5/2 A5/2 B5/2 G5/2 | A5/4 D5/2 E5/2 F#5/2 D5/2 | G5/4 E5/2 F#5/2 G5/2 D5/2 | C#5/4 B4/2 C#5/2 A4/4 |
  A4/2 B4/2 C#5/2 D5/2 E5/2 F#5/2 | G5/4 F#5/4 E5/4 | F#5/4 A4/4 C#5/4 | D5/12 |
  D5/4 G4/2 F#4/2 G4/4 | E5/4 G4/2 F#4/2 G4/4 | D5/4 C5/4 B4/4 | A4/2 G4/2 F#4/2 G4/2 A4/4 |
  D4/2 E4/2 F#4/2 G4/2 A4/2 B4/2 | C5/4 B4/4 A4/4 | B4/2 D5/2 G4/4 F#4/4 | G4/12 |`;
const MINUET_BASS_A = `
  G2/12 | B2/12 | C3/12 | B2/12 | A2/12 | G2/12 | D3/12 | D3/4 A2/4 F#2/4 |
  G2/12 | B2/12 | C3/12 | B2/12 | A2/8 D3/4 | G2/12 | C3/4 D3/4 D2/4 | G2/12 |`;
const MINUET_BASS_B = `
  G2/12 | F#2/12 | E2/12 | A2/12 | A2/12 | A2/4 B2/4 C#3/4 | D3/4 A2/8 | D3/4 A2/4 F#2/4 |
  G2/12 | C3/12 | B2/4 A2/4 G2/4 | D3/12 | D2/12 | A2/4 G2/4 F#2/4 | G2/8 D2/4 | G2/12 |`;

// ─── Canon in D (Johann Pachelbel) ─── 4/4
// Over the famous ground bass, two voices play the same melody one cycle apart: a real canon.
const GROUND = `D3/4 A2/4 B2/4 F#2/4 | G2/4 D2/4 G2/4 A2/4 |`;
const CANON_1 = `F#5/4 E5/4 D5/4 C#5/4 | B4/4 A4/4 B4/4 C#5/4 |`;
const CANON_2 = `D5/4 C#5/4 B4/4 A4/4 | G4/4 F#4/4 G4/4 E4/4 |`;
const CANON_3 = `D4/2 F#4/2 A4/2 G4/2 F#4/2 D4/2 F#4/2 E4/2 | D4/2 B3/2 D4/2 A4/2 G4/2 B4/2 A4/2 G4/2 |`;
const CANON_4 = `F#4/2 D4/2 E4/2 C#5/2 D5/2 F#5/2 A5/2 A4/2 | B4/2 G4/2 A4/2 F#4/2 D4/2 D5/2 E5/2 C#5/2 |`;
const CYCLE_REST = `-/16 | -/16 |`;

// ─── Für Elise (Ludwig van Beethoven) ─── 3/8
const ELISE_RH_A = `
  E5/1 D#5/1 E5/1 B4/1 D5/1 C5/1 | A4/2 -/1 C4/1 E4/1 A4/1 | B4/2 -/1 E4/1 G#4/1 B4/1 | C5/2 -/1 E4/1 E5/1 D#5/1 |
  E5/1 D#5/1 E5/1 B4/1 D5/1 C5/1 | A4/2 -/1 C4/1 E4/1 A4/1 | B4/2 -/1 E4/1 C5/1 B4/1 |`;
const ELISE_LH_A = `
  -/6 | A2/1 E3/1 A3/1 -/3 | E2/1 E3/1 G#3/1 -/3 | A2/1 E3/1 A3/1 -/3 |
  -/6 | A2/1 E3/1 A3/1 -/3 | E2/1 E3/1 G#3/1 -/3 |`;

// ─── Ode to Joy (Ludwig van Beethoven, Symphony No. 9) ─── 4/4
const JOY_LINE = `F#5/4 F#5/4 G5/4 A5/4 | A5/4 G5/4 F#5/4 E5/4 | D5/4 D5/4 E5/4 F#5/4 |`;
const JOY_D = `D4/2 A4/2 F#4/2 A4/2`; // half a bar of D major, broken
const JOY_A = `C#4/2 A4/2 E4/2 A4/2`; // half a bar of A major, broken

export const TRACKS = [
  {
    id: 'minuet',
    title: 'Minuet in G',
    composer: 'Christian Petzold (long credited to J. S. Bach)',
    bpm: 126,
    bar: 12,
    passes: 1,
    voices: [
      { wave: 'pulse', vol: 0.03, legato: 0.85, notes: [MINUET_A, MINUET_A, MINUET_B, MINUET_B].join(' ') },
      { wave: 'triangle', vol: 0.06, legato: 0.92, notes: [MINUET_BASS_A, MINUET_BASS_A, MINUET_BASS_B, MINUET_BASS_B].join(' ') },
    ],
  },
  {
    id: 'canon',
    title: 'Canon in D',
    composer: 'Johann Pachelbel',
    bpm: 72,
    bar: 16,
    passes: 3,
    voices: [
      { wave: 'triangle', vol: 0.06, legato: 0.95, intro: repeat(GROUND, 2), notes: repeat(GROUND, 4) },
      { wave: 'pulse', vol: 0.028, legato: 0.95, release: 0.2, intro: [CYCLE_REST, CANON_1].join(' '), notes: [CANON_2, CANON_3, CANON_4, CANON_1].join(' ') },
      { wave: 'square', vol: 0.014, legato: 0.95, release: 0.2, intro: repeat(CYCLE_REST, 2), notes: [CANON_1, CANON_2, CANON_3, CANON_4].join(' ') },
    ],
  },
  {
    id: 'elise',
    title: 'Für Elise',
    composer: 'Ludwig van Beethoven',
    bpm: 100,
    bar: 6,
    passes: 4,
    voices: [
      {
        wave: 'pulse',
        vol: 0.03,
        legato: 0.95,
        intro: 'E5/1 D#5/1',
        notes: `${ELISE_RH_A} A4/2 -/2 E5/1 D#5/1 | ${ELISE_RH_A} A4/2 -/1 B4/1 C5/1 D5/1 |
          E5/3 G4/1 F5/1 E5/1 | D5/3 F4/1 E5/1 D5/1 | C5/3 E4/1 D5/1 C5/1 | B4/2 -/1 E4/1 E5/1 D#5/1 |`,
      },
      {
        wave: 'triangle',
        vol: 0.06,
        legato: 0.95,
        release: 0.35, // lets the broken chords ring, like a sustain pedal
        intro: '-/2',
        notes: `${ELISE_LH_A} A2/1 E3/1 A3/1 -/3 | ${ELISE_LH_A} A2/1 E3/1 A3/1 -/3 |
          C3/1 G3/1 C4/1 -/3 | G2/1 G3/1 B3/1 -/3 | A2/1 E3/1 A3/1 -/3 | E2/1 E3/1 G#3/1 -/3 |`,
      },
    ],
  },
  {
    id: 'joy',
    title: 'Ode to Joy',
    composer: 'Ludwig van Beethoven',
    bpm: 116,
    bar: 16,
    passes: 2,
    voices: [
      {
        wave: 'pulse',
        vol: 0.03,
        legato: 0.9,
        notes: `${JOY_LINE} F#5/6 E5/2 E5/8 | ${JOY_LINE} E5/6 D5/2 D5/8 |
          E5/4 E5/4 F#5/4 D5/4 | E5/4 F#5/2 G5/2 F#5/4 D5/4 | E5/4 F#5/2 G5/2 F#5/4 E5/4 | D5/4 E5/4 A4/8 |
          ${JOY_LINE} E5/6 D5/2 D5/8 |`,
      },
      {
        wave: 'square',
        vol: 0.009,
        legato: 0.6,
        notes: `${JOY_D} ${JOY_D} | ${JOY_A} ${JOY_A} | ${JOY_D} ${JOY_D} | ${JOY_A} ${JOY_A} |
          ${JOY_D} ${JOY_D} | ${JOY_A} ${JOY_A} | ${JOY_D} ${JOY_D} | ${JOY_A} ${JOY_D} |
          ${JOY_A} ${JOY_D} | ${JOY_A} ${JOY_D} | ${JOY_A} ${JOY_A} | D4/2 F#4/2 E4/2 G#4/2 ${JOY_A} |
          ${JOY_D} ${JOY_D} | ${JOY_A} ${JOY_A} | ${JOY_D} ${JOY_D} | ${JOY_A} ${JOY_D} |`,
      },
      {
        wave: 'triangle',
        vol: 0.06,
        legato: 0.9,
        notes: `D2/4 D3/4 D2/4 D3/4 | A2/4 A3/4 A2/4 A3/4 | D2/4 D3/4 D2/4 D3/4 | A2/4 A3/4 A2/4 A3/4 |
          D2/4 D3/4 D2/4 D3/4 | A2/4 A3/4 A2/4 A3/4 | D2/4 D3/4 D2/4 D3/4 | A2/4 A3/4 D3/4 D2/4 |
          A2/4 A3/4 D3/4 D2/4 | A2/4 A3/4 D3/4 D2/4 | A2/4 A3/4 A2/4 A3/4 | B2/4 G#2/4 A2/4 A3/4 |
          D2/4 D3/4 D2/4 D3/4 | A2/4 A3/4 A2/4 A3/4 | D2/4 D3/4 D2/4 D3/4 | A2/4 A3/4 D3/4 D2/4 |`,
      },
    ],
  },
];
