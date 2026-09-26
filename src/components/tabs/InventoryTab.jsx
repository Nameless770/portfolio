import { useRef } from 'react';
import { CATS, ITEMS, QUESTS } from '../../data.js';
import { PageHead, Pips, Sprite } from '../Pixel.jsx';

const SLOT_COUNT = 30;
const catOf = (id) => CATS.find((c) => c.id === id);

export default function InventoryTab({ s, actions }) {
  const inspectRef = useRef(null);

  // On phones the detail panel sits above the grid; bring it back into view after a pick.
  const pick = (id) => {
    actions.selectItem(id);
    const panel = inspectRef.current;
    if (panel && window.matchMedia('(max-width: 600px)').matches && panel.getBoundingClientRect().top < 96) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filters = [{ id: 'all', label: 'All' }, ...CATS.map((c) => ({ id: c.id, label: c.short }))];
  const items = ITEMS.filter((x) => s.filter === 'all' || x.cat === s.filter);
  const empties = Math.max(0, SLOT_COUNT - items.length);

  const item = ITEMS.find((x) => x.id === s.itemId) || ITEMS[0];
  const cat = catOf(item.cat);

  return (
    <section className="page">
      <PageHead kicker="Skills" title="Inventory" />

      <div className="filters" role="group" aria-label="Filter by class">
        {filters.map((f) => {
          const on = s.filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              className={`btn btn--chip${on ? ' btn--on' : ''}`}
              aria-pressed={on}
              onClick={() => actions.setFilter(f.id)}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="inv-row">
        <div className="inv-grid">
          {items.map((x) => {
            const active = x.id === s.itemId;
            return (
              <button
                key={x.id}
                type="button"
                title={x.full}
                className={`inv-slot${active ? ' is-active' : ' well'}`}
                aria-pressed={active}
                onClick={() => pick(x.id)}
                onPointerEnter={active ? undefined : actions.hover}
              >
                <Sprite name={catOf(x.cat).icon} />
                <span className="inv-slot-name">{x.short}</span>
              </button>
            );
          })}
          {Array.from({ length: empties }, (_, i) => (
            <div key={'empty' + i} className="inv-slot inv-slot--empty well" aria-hidden="true" onClick={actions.bump} />
          ))}
        </div>

        <div ref={inspectRef} className="inspect" aria-live="polite">
          <div className="inspect-head">
            <div className="inspect-icon">
              <Sprite name={cat.icon} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <span className="inspect-name">{item.full}</span>
              <span className="inspect-cls">{cat.name} · {cat.kind}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="inspect-level">
              <span>{cat.name} level</span>
              <span>Lv {cat.level}</span>
            </div>
            <Pips level={cat.level} className="pips--sm" />
          </div>

          {item.uses.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span className="kicker">Used in quests</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {item.uses.map((i) => (
                  <button key={i} type="button" className="btn btn--sm btn--on" onClick={() => actions.selectQuest(i)}>
                    {QUESTS[i].title} →
                  </button>
                ))}
              </div>
            </div>
          )}

          <span className="inspect-count">
            Inspected {Object.keys(s.inspected).length} of {ITEMS.length} items
          </span>
        </div>
      </div>
    </section>
  );
}
