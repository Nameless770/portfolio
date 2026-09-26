import { QUESTS } from '../../data.js';
import { CursorSlot, PageHead, Sprite } from '../Pixel.jsx';

export default function QuestsTab({ s, actions }) {
  const q = QUESTS[s.questIdx];

  return (
    <section className="page">
      <PageHead kicker="Projects" title="Quest log" />
      <div className="quest-row">
        <div className="quest-list">
          {QUESTS.map((x, i) => {
            const active = i === s.questIdx;
            return (
              <button
                key={x.title}
                type="button"
                className={`quest-pick${active ? ' is-active' : ''}`}
                aria-pressed={active}
                onClick={() => actions.selectQuest(i)}
                onPointerEnter={active ? undefined : actions.hover}
              >
                <CursorSlot active={active} />
                <Sprite name="scroll" />
                <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                  <span className="quest-pick-name">{x.title}</span>
                  <span className="quest-pick-status">
                    {x.rarity} · {s.seen['q' + i] ? 'Read' : 'New'}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <article className="quest-card parch">
          <div className="quest-rank">
            <div style={{ display: 'flex', gap: 4 }} role="img" aria-label={`${q.stars} stars`}>
              {Array.from({ length: q.stars }, (_, i) => (
                <Sprite key={i} name="star" />
              ))}
            </div>
            <span className="quest-rarity">{q.rarity} quest · Complete</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h3 className="quest-title">{q.title}</h3>
            <span className="quest-sub">{q.sub}</span>
          </div>

          {q.intro && <p className="quest-intro">{q.intro}</p>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="kicker">Party gear</span>
            <div className="gear">
              {q.stack.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="kicker">Objectives cleared</span>
            <ul className="objectives">
              {q.bullets.map((b) => (
                <li key={b} className="objective">
                  <div className="objective-check">
                    <Sprite name="check" />
                  </div>
                  <p>{b}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="quest-foot">
            <a href={q.url} target="_blank" rel="noopener noreferrer" className="btn btn--accent btn--lg">
              View code on GitHub
            </a>
            <span className="quest-repo">{q.repo}</span>
          </div>
        </article>
      </div>
    </section>
  );
}
