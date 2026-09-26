import { useState } from 'react';
import { REALMS } from '../../world.js';
import { SOUND_TEST } from '../../sfx.js';
import { CursorSlot, PageHead, Sprite } from '../Pixel.jsx';

export default function OptionsTab({ s, actions }) {
  const realms = Object.values(REALMS).filter((p) => p.id !== 'arcane' || s.secret);
  const toggles = [
    { label: 'Sound effects', desc: 'Chiptune blips on moves and unlocks (M key)', value: s.sound, set: actions.setSound },
    { label: "Byte's voice", desc: 'Byte chirps while he talks', value: s.voice, set: actions.setVoice },
    { label: 'Guide', desc: 'Byte comments as you explore', value: s.guide, set: actions.setGuide },
    { label: 'Scanlines', desc: 'Old CRT screen effect', value: s.scan, set: actions.setScan },
  ];

  return (
    <section className="page options-page">
      <PageHead kicker="Colors & sound" title="Options" />

      <div className="opt-group" role="group" aria-label="Realm">
        <span className="kicker">Realm</span>
        {realms.map((p) => {
          const active = s.realm === p.id;
          return (
            <button
              key={p.id}
              type="button"
              className={`realm${active ? ' is-active' : ''}`}
              aria-pressed={active}
              onClick={() => actions.setRealm(p.id)}
              onPointerEnter={active ? undefined : actions.hover}
            >
              <CursorSlot active={active} />
              <span className="realm-text">
                <span className="realm-name">{p.name}</span>
                <span className="realm-desc">{p.desc}</span>
              </span>
              <span className="swatches" aria-hidden="true">
                {[p.w.sky[1], p.ui.panel, p.ui.trim, p.ui.accent, p.ui.parch].map((c, i) => (
                  <span key={i} style={{ background: c }} />
                ))}
              </span>
            </button>
          );
        })}
        {!s.secret && (
          <button type="button" className="realm realm--locked" aria-label="Locked realm" onClick={actions.lockedRealm}>
            <span />
            <span className="realm-text">
              <span className="realm-name">???</span>
              <span className="realm-desc">A hidden realm. Byte knows how to find it.</span>
            </span>
            <Sprite name="lock" alt="Locked" />
          </button>
        )}
      </div>

      <div className="opt-group opt-group--settings">
        <span className="kicker">Settings</span>
        {toggles.map((t) => (
          <div key={t.label} className="toggle">
            <span className="toggle-text">
              <span className="toggle-label">{t.label}</span>
              <span className="toggle-desc">{t.desc}</span>
            </span>
            <span className="toggle-btns" role="group" aria-label={t.label}>
              <button type="button" className={`btn btn--chip ${t.value ? 'btn--on' : 'btn--off'}`} aria-pressed={t.value} onClick={() => t.set(true)}>
                ON
              </button>
              <button type="button" className={`btn btn--chip ${!t.value ? 'btn--on' : 'btn--off'}`} aria-pressed={!t.value} onClick={() => t.set(false)}>
                OFF
              </button>
            </span>
          </div>
        ))}
        <SoundTest secret={s.secret} actions={actions} />
      </div>
    </section>
  );
}

/** Old-school sound test: step through every effect and play it (works even with sound off). */
function SoundTest({ secret, actions }) {
  const [idx, setIdx] = useState(0);
  const [name, label] = SOUND_TEST[idx];
  const hidden = name === 'secret' && !secret;
  const step = (d) => {
    setIdx((i) => (i + d + SOUND_TEST.length) % SOUND_TEST.length);
    actions.beep('move');
  };

  return (
    <div className="toggle">
      <span className="toggle-text">
        <span className="toggle-label">Sound test</span>
        <span className="toggle-desc">Hear every effect in the game</span>
      </span>
      <span className="sound-test">
        <button type="button" className="btn btn--chip" aria-label="Previous sound" onClick={() => step(-1)}>◀</button>
        <span className="sound-test-name" aria-live="polite">
          <span className="sound-test-num">{String(idx + 1).padStart(2, '0')}</span>
          {hidden ? '???' : label}
        </span>
        <button type="button" className="btn btn--chip" aria-label="Next sound" onClick={() => step(1)}>▶</button>
        <button type="button" className="btn btn--chip btn--on" onClick={() => actions.playTest(hidden ? 'denied' : name)}>
          Play
        </button>
      </span>
    </div>
  );
}
