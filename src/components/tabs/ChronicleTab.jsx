import { CHRONICLE } from '../../data.js';
import { PageHead, Sprite } from '../Pixel.jsx';

export default function ChronicleTab() {
  return (
    <section className="page" style={{ gap: 28 }}>
      <PageHead kicker="Experience, education & volunteering" title="Chronicle" />
      <ol className="chron">
        {CHRONICLE.map((c) => (
          <li key={c.title} className="chron-entry">
            <div className="chron-icon">
              <Sprite name={c.icon} />
            </div>
            <div className="chron-body">
              <span className="kicker">{c.kicker}</span>
              <span className="chron-title">{c.title}</span>
              <span className="chron-org">{c.org}</span>
              {c.meta && <span className="chron-meta">{c.meta}</span>}
              {c.note && <p className="chron-note">{c.note}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
