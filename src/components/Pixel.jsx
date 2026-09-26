import { getSprites } from '../sprites.js';

/** A pixel-art image. Pass either a sprite `name` or a ready `src`. */
export function Sprite({ name, src, alt = '', className = '', ...rest }) {
  return <img src={src ?? getSprites()[name]} alt={alt} className={`pixel ${className}`} {...rest} />;
}

/** The bobbing gold pointer shown next to the selected row. */
export function Cursor() {
  return <Sprite name="cursor" className="cursor" />;
}

/** Holds the cursor's slot so rows don't shift when it appears. */
export function CursorSlot({ active }) {
  return <span className="cursor-slot">{active && <Cursor />}</span>;
}

/** Ten-segment level bar. */
export function Pips({ level, className = '' }) {
  return (
    <div className={`pips ${className}`} role="img" aria-label={`Level ${level} of 10`}>
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className="pip" style={{ background: i < level ? 'var(--c-xp)' : 'var(--c-lo)' }} />
      ))}
    </div>
  );
}

export function PageHead({ kicker, title }) {
  return (
    <div className="page-head">
      <span className="kicker">{kicker}</span>
      <h2 className="page-title">{title}</h2>
    </div>
  );
}
