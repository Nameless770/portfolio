import { CATS, CHRONICLE, CONTACTS, CV_URL, ITEMS, PROFILE, QUESTS } from '../data.js';

const contact = (label) => CONTACTS.find((c) => c.label === label);

/** The whole CV on one readable page, no game. */
export default function PlainCV({ actions }) {
  const experience = CHRONICLE.filter((c) => c.kicker.includes('Experience'));
  const volunteering = CHRONICLE.filter((c) => c.kicker.includes('Volunteering'));

  return (
    <div className="plain">
      <div className="plain-wrap">
        <div className="plain-bar">
          <button type="button" className="btn btn--lg" onClick={actions.backToGame}>
            ← Back to the game
          </button>
          <a href={CV_URL} download={PROFILE.cvFile} onClick={actions.onDownload} className="btn btn--on btn--lg">
            Download PDF
          </a>
        </div>

        <article className="cv">
          <header>
            <h1>{PROFILE.name}</h1>
            <div className="cv-role">{PROFILE.title}</div>
            <div className="cv-links">
              <span>{PROFILE.home}</span>
              {['Phone', 'Email', 'GitHub', 'LinkedIn'].map((label) => {
                const c = contact(label);
                const external = c.href.startsWith('http');
                return (
                  <a key={label} href={c.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    {c.value}
                  </a>
                );
              })}
            </div>
          </header>

          <section>
            <h2>About me</h2>
            <p>{PROFILE.bio}</p>
          </section>

          <section>
            <h2>Education</h2>
            <div className="cv-line">
              <strong>MIU International University — Cairo, Egypt</strong>
              <span className="cv-when">2024 – Present</span>
            </div>
            <div>Bachelor of Computer Science</div>
          </section>

          <section className="cv-gap-md">
            <h2>Experience</h2>
            {experience.map((e) => (
              <div key={e.org} className="cv-entry">
                <div className="cv-line">
                  <strong>{e.title} — {e.org}</strong>
                  <span className="cv-when">{e.meta}</span>
                </div>
                <div>{e.note}</div>
              </div>
            ))}
          </section>

          <section>
            <h2>Technical skills</h2>
            <div className="cv-skills">
              {CATS.map((c) => (
                <div key={c.id} style={{ display: 'contents' }}>
                  <strong>{c.name}</strong>
                  <span>{ITEMS.filter((x) => x.cat === c.id).map((x) => x.full).join(', ')}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="cv-gap-lg">
            <h2>Projects</h2>
            {QUESTS.map((q) => (
              <div key={q.title} className="cv-project">
                <div className="cv-line cv-line--base">
                  <strong>{q.title} – {q.sub}</strong>
                  <a href={q.url} target="_blank" rel="noopener noreferrer">{q.repo}</a>
                </div>
                <div className="cv-stack">{q.stack.join(', ')}</div>
                {q.intro && <div>{q.intro}</div>}
                <ul>
                  {q.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section>
            <h2>Volunteering</h2>
            {volunteering.map((v) => (
              <div key={v.org} className="cv-entry">
                <strong>{v.title} — {v.org}</strong>
                <div>{v.note}</div>
              </div>
            ))}
          </section>
        </article>
      </div>
    </div>
  );
}
