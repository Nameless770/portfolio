import { PROFILE } from '../data.js';
import { CursorSlot } from './Pixel.jsx';

export default function TitleScreen({ items, activeIdx, onHover }) {
  return (
    <div className="title-screen">
      <div className="title-head">
        <h1 className="title-name">{PROFILE.name}</h1>
        <div className="title-tagline">{PROFILE.tagline}</div>
      </div>

      <div className="title-menu frame">
        {items.map((t, i) => (
          <button
            key={t.label}
            type="button"
            className={`title-item${i === activeIdx ? ' is-active' : ''}`}
            onClick={t.act}
            onMouseEnter={() => onHover(i)}
            onFocus={() => onHover(i)}
          >
            <CursorSlot active={i === activeIdx} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="title-hints">
        <span>↑ ↓ choose</span>
        <span>Enter select</span>
        <span>M sound</span>
        <span>Mouse works too</span>
      </div>
    </div>
  );
}
