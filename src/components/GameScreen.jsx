import { useEffect, useRef } from 'react';
import { ACHIEVEMENTS, PROFILE, TABS, XP_KEYS } from '../data.js';
import { CursorSlot, Sprite } from './Pixel.jsx';
import GuideBox from './GuideBox.jsx';
import StatusTab from './tabs/StatusTab.jsx';
import InventoryTab from './tabs/InventoryTab.jsx';
import QuestsTab from './tabs/QuestsTab.jsx';
import ChronicleTab from './tabs/ChronicleTab.jsx';
import ContactTab from './tabs/ContactTab.jsx';
import SaveTab from './tabs/SaveTab.jsx';
import OptionsTab from './tabs/OptionsTab.jsx';
import QuitTab from './tabs/QuitTab.jsx';

export default function GameScreen({ s, S, heroSrc, actions, contentRef, hudRef }) {
  const count = XP_KEYS.filter((k) => s.seen[k]).length;
  const level = s.secret ? 99 : Math.min(8, 1 + count);

  return (
    <>
      <div className="veil" />
      <div className="game">
        <Hud s={s} S={S} heroSrc={heroSrc} level={level} count={count} actions={actions} hudRef={hudRef} />

        <div className="game-body">
          <SideMenu s={s} onOpen={actions.openTab} onHover={actions.hover} />

          <main ref={contentRef} className="content frame">
            {s.tab === 'status' && <StatusTab heroSrc={heroSrc} level={level} />}
            {s.tab === 'inventory' && <InventoryTab s={s} actions={actions} />}
            {s.tab === 'quests' && <QuestsTab s={s} actions={actions} />}
            {s.tab === 'chronicle' && <ChronicleTab />}
            {s.tab === 'contact' && <ContactTab actions={actions} />}
            {s.tab === 'save' && <SaveTab saved={s.saved} actions={actions} />}
            {s.tab === 'options' && <OptionsTab s={s} actions={actions} />}
            {s.tab === 'quit' && <QuitTab actions={actions} />}
          </main>
        </div>

        {s.guide && <GuideBox text={s.npc.text} id={s.npc.id} owl={S.owl} onBlip={actions.blip} onPoke={actions.poke} />}
      </div>
    </>
  );
}

function Hud({ s, S, heroSrc, level, count, actions, hudRef }) {
  const achCount = `${Object.keys(s.ach).length}/${ACHIEVEMENTS.length}`;
  return (
    <header ref={hudRef} className="hud frame">
      <div className="hud-avatar well">
        <Sprite src={heroSrc} />
      </div>
      <div className="hud-info">
        <div className="hud-name">{PROFILE.name}</div>
        <div className="hud-xp">
          <span className="hud-level">LV {level}</span>
          <div className="xp-bar" role="progressbar" aria-label="Experience" aria-valuemin={0} aria-valuemax={7} aria-valuenow={s.secret ? 7 : count}>
            <div className="xp-fill" style={{ width: `${s.secret ? 100 : Math.round((count / 7) * 100)}%` }} />
          </div>
          <span className="xp-text">
            {s.secret ? '999 XP' : `${count * 100} / 700 XP`}
            {s.xpPop > 0 && <span key={s.xpPop} className="xp-pop" aria-hidden="true">+100 XP</span>}
          </span>
        </div>
      </div>
      <div className="hud-actions">
        <button type="button" className="btn" onClick={actions.openAch} aria-label={`Trophies, ${achCount} unlocked`}>
          <Sprite src={S.trophy} />
          {achCount}
        </button>
        <button type="button" className="btn" onClick={() => actions.setMusic(!s.music)} aria-pressed={s.music}>
          {s.music ? 'Music: On' : 'Music: Off'}
        </button>
        <button type="button" className="btn" onClick={() => actions.setSound(!s.sound)} aria-pressed={s.sound}>
          {s.sound ? 'Sound: On' : 'Sound: Off'}
        </button>
        <button type="button" className="btn btn--accent" onClick={actions.toPlain}>
          Plain CV
        </button>
      </div>
    </header>
  );
}

function SideMenu({ s, onOpen, onHover }) {
  const navRef = useRef(null);

  // When the menu is a horizontal strip (small screens), keep the active tab in view.
  useEffect(() => {
    const nav = navRef.current;
    const item = nav?.querySelector('.is-active');
    if (!nav || !item || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({ left: item.offsetLeft - (nav.clientWidth - item.offsetWidth) / 2, behavior: 'smooth' });
  }, [s.tab]);

  return (
    <nav ref={navRef} className="menu frame" aria-label="Sections">
      {TABS.map((t) => {
        const active = s.tab === t.id;
        const isNew = t.id === 'quests' ? !(s.seen.q0 && s.seen.q1 && s.seen.q2) : XP_KEYS.includes(t.id) && !s.seen[t.id];
        return (
          <button
            key={t.id}
            type="button"
            className={`menu-item${active ? ' is-active' : ''}`}
            onClick={() => onOpen(t.id)}
            onPointerEnter={active ? undefined : onHover}
            aria-current={active ? 'page' : undefined}
          >
            <CursorSlot active={active} />
            <span className="menu-text">
              <span className="menu-label">{t.label}</span>
              <span className="menu-sub">{t.sub}</span>
            </span>
            {isNew && <span className="badge-new">NEW</span>}
          </button>
        );
      })}
    </nav>
  );
}
