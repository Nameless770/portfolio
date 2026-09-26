import { Component, createRef } from 'react';
import { ACHIEVEMENTS, CATS, CV_URL, DEFAULTS, ITEMS, KONAMI, LINES, PROFILE, TABS, XP_KEYS } from './data.js';
import { getSprites } from './sprites.js';
import { REALMS, drawWorld, realmVars } from './world.js';
import { audioContext, playSfx } from './sfx.js';
import { onTrackChange, playMusic, stopMusic } from './music.js';
import { TRACKS } from './tracks.js';
import TitleScreen from './components/TitleScreen.jsx';
import GameScreen from './components/GameScreen.jsx';
import PlainCV from './components/PlainCV.jsx';
import { AchievementsModal, SecretModal, Toast } from './components/Overlays.jsx';

// The sound each page makes when you open it.
const TAB_SFX = { inventory: 'bag', quests: 'scroll', chronicle: 'page', save: 'chestOpen', quit: 'back' };

export default class App extends Component {
  canvasRef = createRef();
  contentRef = createRef();
  hudRef = createRef();
  mx = 0; // current parallax offset
  tmx = 0; // target parallax offset from the mouse
  keys = []; // recent key presses, for the Konami code
  toastQueue = [];
  toasting = false;
  pend = {}; // XP/achievement ids already granted this tick (guards against double setState)
  timers = new Set();

  state = {
    scene: DEFAULTS.startScene,
    titleIdx: 0,
    tab: 'status',
    seen: {},
    questIdx: 0,
    itemId: 'ts',
    filter: 'all',
    inspected: {},
    ach: {},
    toastTitle: '',
    toastOn: false,
    npc: { text: '', id: 0 },
    music: DEFAULTS.music,
    musicArmed: false, // set by the first New Game or music toggle: browsers only allow audio after one
    track: 0,
    sound: DEFAULTS.sound,
    voice: DEFAULTS.voice,
    guide: DEFAULTS.guide,
    scan: DEFAULTS.scanlines,
    realm: DEFAULTS.realm,
    secret: false,
    achOpen: false,
    secretOpen: false,
    saved: false,
    xpPop: 0,
    blink: false,
  };

  // Stable action callbacks handed to child components.
  actions = {
    startGame: () => this.startGame(),
    toTitle: () => this.toTitle(),
    toPlain: () => this.toPlain(),
    backToGame: () => {
      this.setState((s) => ({ scene: Object.keys(s.seen).length ? 'game' : 'title' }));
      this.beep('back');
      window.scrollTo(0, 0);
    },
    download: () => this.download(),
    onDownload: () => this.onDownload(),
    openTab: (id) => this.openTab(id),
    selectQuest: (i) => this.selectQuest(i),
    selectItem: (id) => this.selectItem(id),
    setFilter: (id) => { this.setState({ filter: id }); this.beep('click'); },
    setRealm: (id) => this.setRealm(id),
    lockedRealm: () => { this.beep('denied'); this.say(LINES.locked); },
    setSound: (on) => {
      if (on === this.state.sound) return;
      this.setState({ sound: on });
      playSfx(on ? 'powerOn' : 'powerOff');
    },
    setMusic: (on) => {
      if (on === this.state.music && this.state.musicArmed) return;
      this.setState({ music: on, musicArmed: true });
      this.beep(on ? 'toggleOn' : 'toggleOff');
    },
    // On the title screen music is "on" but silent until the visitor acts, so N starts it rather than muting it.
    toggleMusic: () => this.actions.setMusic(!(this.state.music && this.state.musicArmed)),
    pickTrack: (i) => {
      const t = TRACKS[i];
      this.setState({ track: i, music: true, musicArmed: true });
      this.say(LINES.nowPlaying.replace('{title}', t.title).replace('{composer}', t.composer));
    },
    setVoice: (on) => this.toggle('voice', on),
    setGuide: (on) => this.toggle('guide', on),
    setScan: (on) => this.toggle('scan', on),
    openAch: () => { this.setState({ achOpen: true }); this.beep('open'); },
    closeAch: () => { this.setState({ achOpen: false }); this.beep('close'); },
    closeSecret: () => { this.setState({ secretOpen: false }); this.beep('close'); },
    sendRaven: () => { this.beep('raven'); this.unlock('raven'); },
    unlock: (id) => this.unlock(id),
    beep: (type) => this.beep(type),
    // Mouse-only hover tick, so taps on touch screens don't double up with the click sound.
    hover: (e) => { if (e.pointerType === 'mouse') this.beep('hover'); },
    // Byte's voice: a short blip at a slightly random pitch.
    blip: () => { if (this.state.voice) this.beep('blip', false, { pitch: 0.92 + Math.random() * 0.16 }); },
    poke: () => this.beep('hoot'),
    bump: () => this.beep('bump'),
    // Sound test plays even with sound effects off: the visitor asked to hear it.
    playTest: (name) => playSfx(name),
    hoverTitle: (i) => {
      if (this.state.titleIdx !== i) { this.setState({ titleIdx: i }); this.beep('move'); }
    },
  };

  toggle(key, on) {
    if (on === this.state[key]) return;
    this.setState({ [key]: on });
    this.beep(on ? 'toggleOn' : 'toggleOff');
  }

  componentDidMount() {
    this.applyPageTheme();
    const t0 = performance.now();
    this.draw = () => {
      const c = this.canvasRef.current;
      if (!c) return;
      this.mx += (this.tmx - this.mx) * 0.2;
      try {
        drawWorld(c.getContext('2d'), (REALMS[this.state.realm] || REALMS.moon).w, (performance.now() - t0) / 1000, this.mx);
      } catch (e) {
        console.error(e);
      }
    };
    this.draw();
    this.frameT = setInterval(this.draw, 90);

    this.onMove = (e) => { this.tmx = (e.clientX / window.innerWidth - 0.5) * 2; };
    window.addEventListener('mousemove', this.onMove);
    this.onKey = (e) => this.handleKey(e);
    window.addEventListener('keydown', this.onKey);
    // If music was started without a click (e.g. startScene 'game'), the browser holds it back: wake it on the first one.
    this.onPointer = () => { if (this.state.music && this.state.musicArmed) audioContext(); };
    window.addEventListener('pointerdown', this.onPointer);

    this.blinkT = setInterval(() => {
      this.setState({ blink: true });
      this.later(() => this.setState({ blink: false }), 160);
    }, 3600);

    // The playlist moves on by itself; keep the jukebox display in step.
    this.offTrack = onTrackChange((i) => { if (i !== this.state.track) this.setState({ track: i }); });

    if (this.state.scene === 'game') this.startGame();
  }

  componentWillUnmount() {
    clearInterval(this.frameT);
    clearInterval(this.blinkT);
    this.timers.forEach(clearTimeout);
    window.removeEventListener('mousemove', this.onMove);
    window.removeEventListener('keydown', this.onKey);
    window.removeEventListener('pointerdown', this.onPointer);
    this.offTrack?.();
    stopMusic();
  }

  componentDidUpdate(_, prev) {
    if (prev.realm !== this.state.realm) this.applyPageTheme();
    this.syncMusic();
  }

  // Music plays once the visitor has started it (browsers need a click first), except on the plain CV page.
  syncMusic() {
    const s = this.state;
    if (s.music && s.musicArmed && s.scene !== 'plain') playMusic(s.track);
    else stopMusic();
  }

  /** setTimeout that is cleared on unmount. */
  later(fn, ms) {
    const id = setTimeout(() => { this.timers.delete(id); fn(); }, ms);
    this.timers.add(id);
    return id;
  }

  // Keep the page background and browser chrome in step with the realm.
  applyPageTheme() {
    const ui = (REALMS[this.state.realm] || REALMS.moon).ui;
    document.body.style.background = ui.bg;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', ui.bg);
  }

  setRealm(id) {
    this.setState({ realm: id });
    this.beep('warp');
    this.say(LINES.realm);
  }

  beep(type, force, opts) {
    if (!this.state.sound && !force) return;
    playSfx(type, opts);
  }

  say(text) {
    this.setState((s) => ({ npc: { text, id: s.npc.id + 1 } }));
  }

  unlock(id) {
    if (this.state.ach[id] || this.pend[id]) return;
    this.pend[id] = true;
    this.setState((s) => ({ ach: { ...s.ach, [id]: true } }));
    this.toastQueue.push(id);
    if (!this.toasting) this.nextToast();
  }

  nextToast() {
    const id = this.toastQueue.shift();
    if (!id) { this.toasting = false; return; }
    this.toasting = true;
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    this.setState({ toastTitle: id === 'secret' ? 'Cheat code' : a.name, toastOn: true });
    // The cheat code already played its own jingle; Completionist gets the big fanfare.
    if (id !== 'secret') this.beep(id === 'complete' ? 'complete' : 'ach');
    this.later(() => {
      this.setState({ toastOn: false });
      this.later(() => this.nextToast(), 450);
    }, 2400);
  }

  /** Award 100 XP the first time a page is seen. */
  gain(key) {
    if (this.state.seen[key] || this.pend['xp_' + key]) return false;
    this.pend['xp_' + key] = true;
    this.setState((s) => ({ seen: { ...s.seen, [key]: true }, xpPop: s.xpPop + 1 }));
    this.beep('levelup');
    this.unlock('first');
    const has = (k) => this.state.seen[k] || this.pend['xp_' + k];
    if (has('q0') && has('q1') && has('q2')) this.unlock('quests');
    if (XP_KEYS.every(has)) {
      this.later(() => { this.unlock('complete'); this.say(LINES.done); }, 1500);
    }
    return true;
  }

  resetScroll() {
    const c = this.contentRef.current;
    if (c) c.scrollTop = 0;
    // On narrow screens the whole window scrolls: bring the page start back under the sticky tab strip.
    const hud = this.hudRef.current;
    if (hud && window.matchMedia('(max-width: 900px)').matches) {
      const y = hud.getBoundingClientRect().bottom + window.scrollY + 14;
      if (window.scrollY > y) window.scrollTo({ top: y });
    }
  }

  openTab(id) {
    const s = this.state;
    this.setState({ tab: id });
    this.beep(TAB_SFX[id] || 'move');
    this.resetScroll();
    if (id === 'quests') {
      this.gain('q' + s.questIdx);
      this.say(LINES.quests);
      return;
    }
    if (XP_KEYS.includes(id)) this.gain(id);
    this.say(id === 'options' && s.secret ? LINES.optionsSecret : LINES[id]);
  }

  selectQuest(i) {
    this.setState({ questIdx: i, tab: 'quests' });
    this.beep('scroll');
    this.gain('q' + i);
    this.say(LINES['q' + i]);
    this.resetScroll();
  }

  selectItem(id) {
    const inspected = { ...this.state.inspected, [id]: true };
    this.setState({ itemId: id, inspected });
    // Each item class has its own equip sound: crystal chime, blade shing, potion bubbles…
    const cat = CATS.find((c) => c.id === ITEMS.find((x) => x.id === id)?.cat);
    this.beep(cat ? 'eq_' + cat.icon : 'move');
    if (Object.keys(inspected).length >= 5) this.unlock('collector');
  }

  startGame() {
    const first = !this.state.seen.status;
    this.setState({ scene: 'game', tab: 'status', musicArmed: true });
    this.beep(first ? 'start' : 'select');
    if (first) this.gain('status');
    this.say(first ? LINES.start : LINES.status);
  }

  toTitle() {
    this.setState({ scene: 'title', titleIdx: 0 });
    this.beep('back');
  }

  toPlain() {
    this.setState({ scene: 'plain' });
    this.beep('paper');
    window.scrollTo(0, 0);
  }

  download() {
    const a = document.createElement('a');
    a.href = CV_URL;
    a.download = PROFILE.cvFile;
    document.body.appendChild(a);
    a.click();
    a.remove();
    this.onDownload();
  }

  onDownload() {
    this.setState({ saved: true });
    this.beep('loot');
    this.unlock('loot');
  }

  titleItems() {
    const started = Object.keys(this.state.seen).length > 0;
    return [
      { label: started ? 'Continue' : 'New Game', act: () => this.startGame() },
      { label: 'Plain CV', act: () => this.toPlain() },
      { label: 'Download CV', act: () => this.download() },
    ];
  }

  triggerSecret() {
    if (this.state.secret) return;
    this.setState({ secret: true, secretOpen: true });
    this.unlock('secret');
    this.beep('secret');
    this.say(LINES.secret);
  }

  handleKey(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    this.onPointer(); // a key press counts as a gesture too
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    this.keys = [...this.keys, k].slice(-KONAMI.length);
    if (this.keys.join() === KONAMI.join()) { this.triggerSecret(); return; }

    const s = this.state;
    if (k === 'Escape') {
      if (s.achOpen || s.secretOpen) {
        this.setState({ achOpen: false, secretOpen: false });
        this.beep('close');
      }
      return;
    }
    if (k === 'm') {
      this.actions.setSound(!s.sound);
      return;
    }
    if (k === 'n') {
      this.actions.toggleMusic();
      return;
    }
    if (s.achOpen || s.secretOpen) return;

    const vertical = k === 'ArrowDown' || k === 'ArrowUp';
    const step = k === 'ArrowDown' ? 1 : -1;
    if (s.scene === 'title') {
      const items = this.titleItems();
      if (vertical) {
        e.preventDefault();
        this.setState({ titleIdx: (s.titleIdx + step + items.length) % items.length });
        this.beep('move');
      } else if (k === 'Enter') {
        e.preventDefault();
        items[s.titleIdx].act();
      }
    } else if (s.scene === 'game') {
      if (vertical) {
        e.preventDefault();
        const i = TABS.findIndex((t) => t.id === s.tab);
        this.openTab(TABS[(i + step + TABS.length) % TABS.length].id);
      } else if (k === 'Enter' && s.tab === 'quit' && !e.target.closest?.('button, a')) {
        this.toTitle();
      }
    }
  }

  render() {
    const s = this.state;
    const S = getSprites();
    const heroSrc = s.blink ? S.heroBlink : S.hero;

    return (
      <div className="app" style={realmVars(s.realm)}>
        <canvas ref={this.canvasRef} className="world" width={320} height={180} aria-hidden="true" />

        {s.scene === 'title' && (
          <TitleScreen items={this.titleItems()} activeIdx={s.titleIdx} onHover={this.actions.hoverTitle} />
        )}

        {s.scene === 'game' && (
          <GameScreen s={s} S={S} heroSrc={heroSrc} actions={this.actions} contentRef={this.contentRef} hudRef={this.hudRef} />
        )}

        {s.scene === 'plain' && <PlainCV actions={this.actions} />}

        <Toast on={s.toastOn} title={s.toastTitle} icon={S.trophy} />

        {s.achOpen && <AchievementsModal ach={s.ach} S={S} onClose={this.actions.closeAch} />}
        {s.secretOpen && <SecretModal onClose={this.actions.closeSecret} />}
        {s.scan && <div className="scanlines" aria-hidden="true" />}
      </div>
    );
  }
}
