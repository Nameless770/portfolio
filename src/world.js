// Colour realms (UI theme + background world palette) and the animated
// 320x180 pixel-art landscape painted on the background canvas.

export const REALMS = {
  moon: {
    id: 'moon', name: 'Moonlit Keep', desc: 'Night sky, blue stone and gold trim',
    ui: { bg: '#0a0c1c', panel: '#1b2142', hi: '#2a335e', lo: '#11152e', frame: '#06070f', trim: '#e9c46a', head: '#f2cf73', ink: '#f3ead3', dim: '#b7bddb', accent: '#7ee0d2', aink: '#0a1a1f', parch: '#efe2c0', plo: '#dccb9f', pedge: '#6b4a2b', pt: '#2a1c10', pd: '#6b5438', xp: '#7ee0d2', veil: 'rgba(6,7,20,.62)' },
    w: { sky: ['#0a0e24', '#141b44', '#232c66', '#3b3d7e'], moon: '#f4e9c8', moonS: '#cdbf98', star: '#fff6d5', m1: '#2a2f63', m1h: '#565c9c', m2: '#1c2048', m2h: '#2e3468', m3: '#10122c', castle: '#0c0d22', win: '#ffcf5a', fly: '#ffe28a' },
  },
  elder: {
    id: 'elder', name: 'Elderwood', desc: 'Deep forest, moss and amber light',
    ui: { bg: '#08120e', panel: '#1b3024', hi: '#2a4735', lo: '#102017', frame: '#040a06', trim: '#dcae4e', head: '#e8bd5c', ink: '#f1ead2', dim: '#b9c8b4', accent: '#a6e36b', aink: '#12200a', parch: '#ece0bd', plo: '#d6c595', pedge: '#5b3d22', pt: '#2a1c10', pd: '#66502f', xp: '#a6e36b', veil: 'rgba(4,10,6,.6)' },
    w: { sky: ['#0c1d18', '#15332a', '#1f4a38', '#3a6848'], moon: '#f3eccd', moonS: '#cfc6a0', star: '#f7f3d0', m1: '#1f4332', m1h: '#46775a', m2: '#153023', m2h: '#22452f', m3: '#0a1a12', castle: '#07130d', win: '#ffd66b', fly: '#d8f58a' },
  },
  ember: {
    id: 'ember', name: 'Ember Hall', desc: 'Torchlit halls, dark stone and embers',
    ui: { bg: '#0e0807', panel: '#2a1c19', hi: '#3d2a25', lo: '#1a100e', frame: '#060303', trim: '#f0a13c', head: '#f7b24e', ink: '#f6e7cf', dim: '#cdb9a0', accent: '#ff7a45', aink: '#1f0a04', parch: '#f1e0bf', plo: '#dcc294', pedge: '#5e2f19', pt: '#2b150b', pd: '#6e4a30', xp: '#ffb347', veil: 'rgba(10,4,3,.6)' },
    w: { sky: ['#120909', '#2a1210', '#4a1c14', '#7a2e18'], moon: '#f7c77a', moonS: '#d9a55a', star: '#ffd9a0', m1: '#3a1a14', m1h: '#6a3322', m2: '#26110d', m2h: '#3a1a12', m3: '#150a08', castle: '#0e0706', win: '#ffb347', fly: '#ff9a3c' },
  },
  royal: {
    id: 'royal', name: 'Royal Parchment', desc: 'Daylight, parchment, leather and wax',
    ui: { bg: '#e9d6ae', panel: '#f6ead0', hi: '#fff8e8', lo: '#e6d3ab', frame: '#3b2616', trim: '#b8862f', head: '#7a3f1c', ink: '#2b1d12', dim: '#5f4a36', accent: '#b5472e', aink: '#fff6e8', parch: '#fffaf0', plo: '#efe3c8', pedge: '#7a5332', pt: '#2b1d12', pd: '#6a5238', xp: '#6f8f4f', veil: 'rgba(233,214,174,.45)' },
    w: { sky: ['#f6e4bd', '#efd3a0', '#e6bb84', '#d9a06c'], moon: '#fff6dc', moonS: '#f3e1b0', star: '#fffaf0', m1: '#b98b62', m1h: '#e2c09a', m2: '#8f6a4a', m2h: '#a67e5a', m3: '#5e4632', castle: '#4a3526', win: '#fff0b8', fly: '#fff7d0' },
  },
  arcane: {
    id: 'arcane', name: 'Arcane', desc: 'Violet sky and spell-light. Secret realm',
    ui: { bg: '#0b0314', panel: '#22103a', hi: '#341a56', lo: '#150a24', frame: '#05010a', trim: '#ff8af3', head: '#ff9cf5', ink: '#f5ecff', dim: '#c9b8e6', accent: '#6ff7ff', aink: '#06131a', parch: '#f2e8ff', plo: '#dccbf2', pedge: '#4b2275', pt: '#1e0f33', pd: '#5b477a', xp: '#6ff7ff', veil: 'rgba(8,2,16,.6)' },
    w: { sky: ['#12051f', '#25093d', '#3d0f5c', '#5c1a7a'], moon: '#e9d7ff', moonS: '#c4a8f0', star: '#ffffff', m1: '#3a1257', m1h: '#6a2c94', m2: '#270b3d', m2h: '#3a1458', m3: '#160624', castle: '#0d0316', win: '#6ff7ff', fly: '#ff8af3' },
  },
};

/** CSS custom properties for a realm's UI palette, for use as a React style object. */
export function realmVars(id) {
  const ui = (REALMS[id] || REALMS.moon).ui;
  const vars = { '--color-accent': ui.accent };
  for (const k in ui) vars['--c-' + k] = ui[k];
  return vars;
}

function rng(s) {
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hx = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

export const WORLD_W = 320;
export const WORLD_H = 180;

let sky = null;
let skyKey = '';

/**
 * Paint one frame of the landscape.
 * @param ctx  2D context of a 320x180 canvas
 * @param P    realm world palette (REALMS[id].w)
 * @param t    time in seconds (drives twinkle and fireflies)
 * @param mx   parallax offset, -1..1 from mouse X
 */
export function drawWorld(ctx, P, t, mx) {
  const W = WORLD_W, H = WORLD_H;

  // Ordered-dither sky gradient, cached per palette.
  if (skyKey !== P.sky.join()) {
    skyKey = P.sky.join();
    const img = ctx.createImageData(W, H);
    const cols = P.sky.map(hx);
    const sh = H * 0.8;
    for (let y = 0; y < H; y++) {
      const f = Math.min(y / sh, 1) * (cols.length - 1);
      const i = Math.floor(f), fr = f - i;
      for (let x = 0; x < W; x++) {
        const th = (BAYER[y & 3][x & 3] + 0.5) / 16;
        const c = cols[fr > th ? Math.min(i + 1, cols.length - 1) : i];
        const o = (y * W + x) * 4;
        img.data[o] = c[0]; img.data[o + 1] = c[1]; img.data[o + 2] = c[2]; img.data[o + 3] = 255;
      }
    }
    sky = img;
  }
  ctx.putImageData(sky, 0, 0);

  // Twinkling stars.
  const r = rng(7);
  ctx.fillStyle = P.star;
  for (let i = 0; i < 70; i++) {
    const x = Math.floor(r() * W), y = Math.floor(r() * H * 0.55), ph = r() * 6.28;
    const tw = Math.sin(t * 2 + ph);
    if (tw > -0.3) {
      ctx.fillRect(x, y, 1, 1);
      if (i % 9 === 0 && tw > 0.6) {
        ctx.globalAlpha = 0.5;
        ctx.fillRect(x - 1, y, 1, 1); ctx.fillRect(x + 1, y, 1, 1);
        ctx.fillRect(x, y - 1, 1, 1); ctx.fillRect(x, y + 1, 1, 1);
        ctx.globalAlpha = 1;
      }
    }
  }

  // Moon with craters.
  const mxp = 286, myp = 26, R = 11;
  for (let dy = -R; dy <= R; dy++) {
    for (let dx = -R; dx <= R; dx++) {
      if (dx * dx + dy * dy <= R * R) {
        const crater = (dx - 3) ** 2 + (dy + 2) ** 2 < 10 || (dx + 5) ** 2 + (dy - 4) ** 2 < 5 || (dx + 1) ** 2 + (dy - 7) ** 2 < 3;
        ctx.fillStyle = crater ? P.moonS : P.moon;
        ctx.fillRect(mxp + dx, myp + dy, 1, 1);
      }
    }
  }

  // Far mountains.
  const o1 = Math.round(mx * 3);
  for (let x = 0; x < W; x++) {
    const X = x + o1 + 40;
    const y = Math.round(114 - 40 * Math.pow(1 - Math.abs(Math.sin(X * 0.026 + 1.1)), 1.6) - 8 * Math.sin(X * 0.07 + 0.5) - 3 * Math.sin(X * 0.21));
    ctx.fillStyle = P.m1; ctx.fillRect(x, y, 1, H - y);
    if (y < 90) { ctx.fillStyle = P.m1h; ctx.fillRect(x, y, 1, Math.max(1, Math.round((90 - y) / 4))); }
  }

  // Near hills.
  const o2 = Math.round(mx * 6);
  for (let x = 0; x < W; x++) {
    const X = x + o2;
    const y = Math.round(134 - 9 * Math.sin(X * 0.022 + 4.1) - 4 * Math.sin(X * 0.061 + 1));
    ctx.fillStyle = P.m2; ctx.fillRect(x, y, 1, H - y);
    ctx.fillStyle = P.m2h; ctx.fillRect(x, y, 1, 1);
  }

  // Castle silhouette with lit windows and a flag.
  const cx = 238 + o2, gy = 128;
  ctx.fillStyle = P.castle;
  const tower = (x, w, h, roof) => {
    ctx.fillRect(x, gy - h, w, h + 14);
    for (let i = 0; i <= roof; i++) {
      const ww = Math.max(1, w + 2 - Math.round((i * (w + 2)) / roof));
      ctx.fillRect(x + Math.floor((w - ww) / 2), gy - h - i, ww, 1);
    }
  };
  ctx.fillRect(cx - 4, gy - 18, 52, 32);
  for (let i = 0; i < 13; i++) if (i % 2 === 0) ctx.fillRect(cx - 4 + i * 4, gy - 21, 3, 3);
  tower(cx - 10, 9, 30, 10); tower(cx + 14, 13, 44, 14); tower(cx + 46, 9, 30, 10); tower(cx + 30, 6, 24, 8);
  ctx.fillStyle = P.win;
  [[cx - 7, gy - 22], [cx + 18, gy - 36], [cx + 22, gy - 36], [cx + 20, gy - 26], [cx + 49, gy - 22], [cx + 32, gy - 16], [cx + 4, gy - 10]].forEach(([x, y]) => ctx.fillRect(x, y, 1, 2));
  ctx.fillStyle = P.castle; ctx.fillRect(cx + 20, gy - 66, 1, 8);
  ctx.fillStyle = P.win; ctx.fillRect(cx + 21, gy - 66, 4, 2); ctx.fillRect(cx + 21, gy - 64, 3, 1);

  // Foreground pine forest.
  const r2 = rng(3), o3 = Math.round(mx * 12);
  ctx.fillStyle = P.m3; ctx.fillRect(0, H - 12, W, 12);
  for (let x = -24; x < W + 24;) {
    const h = 12 + Math.floor(r2() * 22);
    const tx = x + o3;
    for (let i = 0; i < h; i++) {
      const w = Math.floor(i / 5) + Math.floor((i % 5) * 0.6);
      ctx.fillRect(tx - w, H - 12 - h + i, w * 2 + 1, 1);
    }
    x += 6 + Math.floor(r2() * 9);
  }

  // Fireflies.
  const r3 = rng(11);
  ctx.fillStyle = P.fly;
  for (let i = 0; i < 18; i++) {
    const x0 = r3() * W, y0 = H * 0.55 + r3() * H * 0.4, ph = r3() * 6.28;
    const x = Math.round(x0 + Math.sin(t * 0.6 + ph) * 6), y = Math.round(y0 + Math.cos(t * 0.8 + ph) * 4);
    if (Math.sin(t * 1.5 + ph * 3) > -0.2) ctx.fillRect(x, y, 1, 1);
  }
}
