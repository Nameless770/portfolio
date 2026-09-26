import { CV_URL, PROFILE } from '../../data.js';
import { PageHead, Sprite } from '../Pixel.jsx';

export default function SaveTab({ saved, actions }) {
  return (
    <section className="page">
      <PageHead kicker="Download CV" title="Save game" />
      <div className="slots">
        <div className="slot well">
          <span className="slot-num">01</span>
          <Sprite name="chest" />
          <span className="slot-text">
            <span className="slot-name">{PROFILE.cvFile}</span>
            <span className="slot-meta">{saved ? 'Saved. Check your downloads folder.' : 'PDF · 1 page · the full CV'}</span>
          </span>
          <a href={CV_URL} download={PROFILE.cvFile} onClick={actions.onDownload} className="btn btn--accent btn--lg">
            Download
          </a>
        </div>

        <div className="slot well">
          <span className="slot-num">02</span>
          <Sprite name="book" />
          <span className="slot-text">
            <span className="slot-name">Plain CV</span>
            <span className="slot-meta">Everything on one readable page, no game</span>
          </span>
          <button type="button" className="btn btn--lg" onClick={actions.toPlain}>
            Open
          </button>
        </div>
      </div>
    </section>
  );
}
