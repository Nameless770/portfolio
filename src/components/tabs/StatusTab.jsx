import { CATS, PROFILE } from '../../data.js';
import { PageHead, Pips, Sprite } from '../Pixel.jsx';

export default function StatusTab({ heroSrc, level }) {
  return (
    <section className="page status-page">
      <PageHead kicker="About me" title="Status" />
      <div className="status-row">
        <div className="status-side">
          <div className="portrait well">
            <Sprite src={heroSrc} alt="Pixel portrait of a hooded mage" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="status-name">{PROFILE.name}</div>
            <dl className="status-facts" style={{ margin: 0 }}>
              <dt>Class</dt><dd>{PROFILE.title}</dd>
              <dt>Academy</dt><dd>{PROFILE.academy}</dd>
              <dt>Home</dt><dd>{PROFILE.home}</dd>
              <dt>Level</dt><dd>{level}</dd>
            </dl>
          </div>
        </div>

        <div className="status-main">
          <div className="stats">
            <span className="kicker">Attributes</span>
            {CATS.map((c) => (
              <div key={c.id} className="stat">
                <span className="stat-name">{c.name}</span>
                <Pips level={c.level} className="pips--stat" />
                <span className="stat-level">Lv {c.level}</span>
              </div>
            ))}
          </div>
          <div className="bio parch">
            <span className="kicker">Biography</span>
            <p>{PROFILE.bio}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
