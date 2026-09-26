import { useEffect, useState } from 'react';
import { Sprite } from './Pixel.jsx';

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Byte the owl's dialogue box. Types each new line out two characters at a time,
 * "talking" in blips as it goes; click to skip ahead (Byte hoots).
 */
export default function GuideBox({ text, id, owl, onBlip, onPoke }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!text || reducedMotion()) {
      setShown(text.length);
      return undefined;
    }
    setShown(0);
    let n = 0;
    let tick = 0;
    const timer = setInterval(() => {
      n += 2;
      // A blip every third tick (~14 per second), skipping spaces so words sound like words.
      if (tick++ % 3 === 0 && n < text.length && text[n] !== ' ') onBlip?.();
      if (n >= text.length) clearInterval(timer);
      setShown(n);
    }, 24);
    return () => clearInterval(timer);
  }, [text, id, onBlip]);

  const done = text && shown >= text.length;

  const skip = () => {
    setShown(text.length);
    onPoke?.();
  };

  return (
    <div className="guide frame" onClick={skip}>
      <div className="guide-portrait well">
        <Sprite src={owl} alt="Byte the owl" />
      </div>
      <div className="guide-body">
        <div className="guide-name">BYTE · GUIDE</div>
        <p className="guide-text" aria-hidden="true">{text.slice(0, shown)}</p>
        <p className="sr-only" aria-live="polite">{text}</p>
      </div>
      {done && (
        <div className="guide-arrow" aria-hidden="true">
          <span>▼</span>
        </div>
      )}
    </div>
  );
}
