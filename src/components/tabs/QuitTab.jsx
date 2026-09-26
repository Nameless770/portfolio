import { PageHead } from '../Pixel.jsx';

export default function QuitTab({ actions }) {
  return (
    <section className="page quit-page">
      <PageHead kicker="Title screen" title="Quit" />
      <p>Return to the title screen? Your XP and trophies stay until you close the page.</p>
      <div className="quit-btns">
        <button type="button" className="btn btn--accent btn--xl" onClick={actions.toTitle}>
          Yes, return
        </button>
        <button type="button" className="btn btn--xl" onClick={() => actions.openTab('status')}>
          Stay
        </button>
      </div>
    </section>
  );
}
