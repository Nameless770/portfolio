import { useState } from 'react';
import { CONTACTS } from '../../data.js';
import { CursorSlot, PageHead } from '../Pixel.jsx';

export default function ContactTab({ actions }) {
  const [hover, setHover] = useState(-1);
  const point = (i) => {
    if (hover !== i) {
      setHover(i);
      actions.beep('move');
    }
  };

  return (
    <section className="page">
      <PageHead kicker="Contact" title="Send a raven" />
      <div className="raven parch">
        <p className="raven-lead">Choose how to reach Mahmoud. He's based in Cairo, Egypt.</p>
        <div className="raven-list">
          {CONTACTS.map((c, i) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`raven-link${hover === i ? ' is-active' : ''}`}
              onMouseEnter={() => point(i)}
              onFocus={() => point(i)}
              onClick={actions.sendRaven}
            >
              <CursorSlot active={hover === i} />
              <span className="raven-badge" aria-hidden="true">{c.badge}</span>
              <span className="raven-text">
                <span className="raven-label">{c.label}</span>
                <span className="raven-value">{c.value}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
