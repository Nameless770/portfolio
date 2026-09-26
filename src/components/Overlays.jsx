import { useEffect, useRef } from 'react';
import { ACHIEVEMENTS } from '../data.js';
import { Sprite } from './Pixel.jsx';

/** "Achievement unlocked" banner that slides down from the top. */
export function Toast({ on, title, icon }) {
  return (
    <div className={`toast frame${on ? ' is-on' : ''}`} role="status" aria-live="polite">
      <Sprite src={icon} />
      <span className="toast-text">
        <span className="toast-kicker">ACHIEVEMENT UNLOCKED</span>
        <span className="toast-title">{title}</span>
      </span>
    </div>
  );
}

function Modal({ label, className, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    ref.current?.querySelector('button')?.focus();
    return () => prev?.focus?.();
  }, []);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div ref={ref} className={`modal frame ${className}`} role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function AchievementsModal({ ach, S, onClose }) {
  const secretGot = !!ach.secret;
  return (
    <Modal label="Trophies" className="" onClose={onClose}>
      <h2>Trophies · {Object.keys(ach).length}/{ACHIEVEMENTS.length}</h2>
      <div className="trophies">
        {ACHIEVEMENTS.map((a) => {
          const got = !!ach[a.id];
          const isSecret = a.id === 'secret' && secretGot;
          return (
            <div key={a.id} className={`trophy${got ? '' : ' is-locked'}`}>
              <div className="trophy-icon">
                <Sprite src={got ? S.trophy : S.lock} alt={got ? 'Unlocked' : 'Locked'} />
              </div>
              <span className="trophy-text">
                <span className="trophy-name">{isSecret ? 'Cheat code' : a.name}</span>
                <span className="trophy-desc">{isSecret ? 'Entered the old code' : a.desc}</span>
              </span>
            </div>
          );
        })}
      </div>
      <div className="modal-foot">
        <button type="button" className="btn btn--on btn--lg" onClick={onClose}>
          Back to game
        </button>
      </div>
    </Modal>
  );
}

export function SecretModal({ onClose }) {
  return (
    <Modal label="Cheat code accepted" className="modal--secret" onClose={onClose}>
      <span className="secret-num">99</span>
      <h2>Cheat code accepted</h2>
      <p>+999 XP. The level cap was 8; you're now level 99. A new realm, Arcane, is waiting in Options.</p>
      <span className="secret-credit">Designed and built by Mahmoud Khaled.</span>
      <button type="button" className="btn btn--on btn--lg" onClick={onClose}>
        Continue
      </button>
    </Modal>
  );
}
