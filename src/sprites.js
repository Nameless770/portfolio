// Pixel-art sprites stored as run-length-encoded rows ("3. 2k 1O" = 3 transparent,
// 2 of palette colour k, 1 of palette colour O). Rendered once to data URLs.

const SD = {
  hero: { pal: { k: '#120a1c', o: '#6a4aa3', O: '#9a7ad6', d: '#46316f', f: '#120b1d', e: '#8ff5e6', r: '#3a2a60', R: '#5a4190', g: '#f0c14b', G: '#b8872d' }, rle: ['6. 4k 6.', '4. 2k 1O 3o 2k 4.', '3. 1k 2O 6o 1k 3.', '2. 1k 2O 8o 1k 2.', '2. 1k 1O 2o 4f 2o 1d 1k 2.', '1. 1k 1O 2o 6f 2o 1d 1k 1.', '1. 1k 1O 1o 1f 2e 2f 2e 1f 1o 1d 1k 1.', '1. 1k 1O 1o 8f 1o 1d 1k 1.', '1. 1k 1O 2o 6f 2o 1d 1k 1.', '1. 1k 1d 3o 4f 3o 1d 1k 1.', '1. 1k 2d 3o 2g 3o 2d 1k 1.', '1k 1R 5r 2g 5r 1R 1k', '1k 1R 5r 2G 5r 1R 1k', '1k 1R 4r 1d 2r 1d 4r 1R 1k', '1k 1R 4r 1d 2r 1d 4r 1R 1k', '16k'] },
  owl: { pal: { k: '#1a1010', b: '#8a5a3b', B: '#5e3a24', l: '#e9d3a8', w: '#f7d24a', p: '#140d1f', o: '#f09a3c' }, rle: ['16.', '2. 1k 10. 1k 2.', '2. 1k 1b 8. 1b 1k 2.', '2. 1k 1b 8k 1b 1k 2.', '1. 1k 12b 1k 1.', '1. 1k 1b 4l 2b 4l 1b 1k 1.', '1. 1k 1b 1l 2w 1l 2b 1l 2w 1l 1b 1k 1.', '1. 1k 1b 1l 1w 1p 1l 2o 1l 1p 1w 1l 1b 1k 1.', '1. 1k 1b 4l 2o 4l 1b 1k 1.', '1. 1k 1B 3b 4l 3b 1B 1k 1.', '1. 1k 1B 2b 6l 2b 1B 1k 1.', '1. 1k 1B 2b 1l 1B 2l 1B 1l 2b 1B 1k 1.', '1. 1k 1B 2b 6l 2b 1B 1k 1.', '2. 1k 1B 1b 6l 1b 1B 1k 2.', '3. 2k 1o 4k 1o 2k 3.', '16.'] },
  gem: { pal: { k: '#0d1b24', a: '#3fc7bd', h: '#b7fff6', s: '#1f8a86', w: '#ffffff' }, rle: ['16.', '16.', '5. 6k 5.', '4. 1k 1w 1h 2a 2s 1k 4.', '3. 1k 3h 3a 2s 1k 3.', '2. 1k 3h 4a 3s 1k 2.', '2. 12k 2.', '2. 1k 2h 4a 4s 1k 2.', '3. 1k 2h 3a 3s 1k 3.', '4. 1k 1h 2a 3s 1k 4.', '5. 1k 2a 2s 1k 5.', '6. 1k 1a 1s 1k 6.', '7. 2k 7.', '16.', '16.', '16.'] },
  sword: { pal: { k: '#14101a', w: '#ffffff', B: '#8796a8', g: '#f0c14b', h: '#7a4a2a', H: '#5a3420', p: '#f0c14b' }, rle: ['7. 2k 7.', '6. 1k 1w 1B 1k 6.', '6. 1k 1w 1B 1k 6.', '6. 1k 1w 1B 1k 6.', '6. 1k 1w 1B 1k 6.', '6. 1k 1w 1B 1k 6.', '6. 1k 1w 1B 1k 6.', '6. 1k 1w 1B 1k 6.', '6. 1k 1w 1B 1k 6.', '2. 12k 2.', '2. 1k 10g 1k 2.', '2. 5k 1h 1H 5k 2.', '6. 1k 1h 1H 1k 6.', '6. 1k 1H 1h 1k 6.', '5. 1k 4p 1k 5.', '6. 4k 6.'] },
  chest: { pal: { k: '#1a0f08', l: '#d08a4c', w: '#a8622f', W: '#744019', g: '#f0c14b', G: '#b8872d', x: '#1a0f08' }, rle: ['16.', '16.', '16.', '3. 10k 3.', '2. 1k 1l 1g 6l 1g 1l 1k 2.', '1. 1k 2w 1g 6w 1g 2w 1k 1.', '1. 1k 2W 1G 6W 1G 2W 1k 1.', '1. 3k 1G 1k 4g 1k 1G 3k 1.', '1. 1k 2w 1g 1k 1g 2x 1g 1k 1g 2w 1k 1.', '1. 1k 2w 1g 1k 4G 1k 1g 2w 1k 1.', '1. 1k 2w 1g 6k 1g 2w 1k 1.', '1. 1k 2W 1G 6W 1G 2W 1k 1.', '1. 14k 1.', '16.', '16.', '16.'] },
  book: { pal: { k: '#1a0d10', c: '#b23a48', C: '#7a2230', s: '#5a1822', p: '#f3e6c4', P: '#cdbb92', g: '#f0c14b', G: '#b8872d', a: '#3fc7bd' }, rle: ['16.', '2. 12k 2.', '2. 1k 1s 8c 1C 1k 2.', '2. 1k 1s 8c 1C 1k 2.', '2. 1k 1s 3c 2g 3c 1C 1k 2.', '2. 1k 1s 2c 4g 2c 1C 1k 2.', '2. 1k 1s 1c 2g 2a 2g 1c 1C 1k 2.', '2. 1k 1s 2c 4G 2c 1C 1k 2.', '2. 1k 1s 3c 2G 3c 1C 1k 2.', '2. 1k 1s 8c 1C 1k 2.', '2. 1k 1s 8c 1C 1k 2.', '2. 1k 1s 8C 1C 1k 2.', '2. 1k 1s 9p 1k 2.', '2. 1k 1s 9P 1k 2.', '2. 12k 2.', '16.'] },
  potion: { pal: { k: '#10121f', c: '#b07a45', C: '#7a4f28', g: '#e8f4ff', l: '#6b8cff', L: '#3d5bd1', h: '#c9d6ff', w: '#ffffff' }, rle: ['16.', '6. 4k 6.', '6. 1k 2c 1k 6.', '6. 1k 2C 1k 6.', '6. 1k 2g 1k 6.', '5. 2k 2g 2k 5.', '3. 2k 1h 5g 2k 3.', '2. 1k 1h 8l 1L 1k 2.', '1. 1k 1h 1w 8l 2L 1k 1.', '1. 1k 1h 9l 2L 1k 1.', '1. 1k 1h 4l 1w 4l 2L 1k 1.', '1. 1k 10l 2L 1k 1.', '1. 1k 3l 1w 5l 3L 1k 1.', '2. 1k 10L 1k 2.', '3. 2k 6L 2k 3.', '5. 6k 5.'] },
  shield: { pal: { k: '#10121f', m: '#8a97a8', f: '#3f6fb5', F: '#2b4f86', g: '#f0c14b', h: '#c8d3e0' }, rle: ['16.', '1. 14k 1.', '1. 1k 1h 11m 1k 1.', '1. 1k 1m 4f 2g 4F 1m 1k 1.', '1. 1k 1m 4f 2g 4F 1m 1k 1.', '1. 1k 1m 10g 1m 1k 1.', '1. 1k 1m 4f 2g 4F 1m 1k 1.', '1. 1k 1m 4f 2g 4F 1m 1k 1.', '2. 1k 1m 3f 2g 3F 1m 1k 2.', '2. 1k 1m 3f 2g 3F 1m 1k 2.', '3. 1k 1m 2f 2g 2F 1m 1k 3.', '4. 1k 1m 1f 2g 1F 1m 1k 4.', '5. 1k 1m 2g 1m 1k 5.', '6. 1k 2m 1k 6.', '7. 2k 7.', '16.'] },
  scroll: { pal: { k: '#2a1a0e', p: '#f3e6c4', P: '#d9c496', r: '#b98a52', R: '#8a5e32', l: '#8a6a4a', s: '#b23a48' }, rle: ['16.', '2. 12k 2.', '1. 1k 1R 10r 1R 1k 1.', '2. 1k 10R 1k 2.', '3. 1k 8p 1k 3.', '3. 1k 1p 5l 2p 1k 3.', '3. 1k 8p 1k 3.', '3. 1k 1p 6l 1p 1k 3.', '3. 1k 8p 1k 3.', '3. 1k 1p 4l 3p 1k 3.', '3. 1k 5p 2s 1p 1k 3.', '3. 1k 4P 2s 2P 1k 3.', '2. 12k 2.', '1. 1k 1R 10r 1R 1k 1.', '2. 1k 10R 1k 2.', '3. 10k 3.'] },
  trophy: { pal: { k: '#1a120a', g: '#f0c14b', G: '#b8872d', h: '#fff0a8', b: '#7a4a2a', B: '#5a3420' }, rle: ['16.', '3. 10k 3.', '1. 3k 1h 6g 1G 3k 1.', '1. 1k 1. 1k 1h 6g 1G 1k 1. 1k 1.', '1. 1k 1. 1k 1h 6g 1G 1k 1. 1k 1.', '2. 2k 1h 6g 1G 2k 2.', '3. 1k 1h 6g 1G 1k 3.', '4. 1k 1g 4g 1G 1k 4.', '5. 1k 4G 1k 5.', '6. 1k 2g 1k 6.', '6. 1k 2G 1k 6.', '5. 1k 4g 1k 5.', '4. 8k 4.', '4. 1k 6b 1k 4.', '4. 1k 6B 1k 4.', '4. 8k 4.'] },
  cursor: { pal: { k: '#10121f', g: '#f0c14b', G: '#b8872d', h: '#fff0a8' }, rle: ['3. 2k 5.', '3. 1k 1h 1k 4.', '3. 1k 1h 1g 1k 3.', '3. 1k 1h 2g 1k 2.', '3. 1k 1h 3g 1k 1.', '3. 1k 1h 4g 1k', '3. 1k 1g 4G 1k', '3. 1k 1g 3G 1k 1.', '3. 1k 1g 2G 1k 2.', '3. 1k 1g 1G 1k 3.', '3. 1k 1g 1k 4.', '3. 2k 5.'] },
  star: { pal: { k: '#1a120a', g: '#f0c14b', h: '#fff0a8' }, rle: ['4. 1k 4.', '3. 1k 1h 1k 3.', '4k 1h 4k', '1k 1h 6g 1k', '1. 1k 5g 1k 1.', '2. 1k 3g 1k 2.', '1. 1k 2g 1k 2g 1k 1.', '1. 1k 1g 1k 1. 1k 1g 1k 1.', '1. 2k 3. 2k 1.'] },
  lock: { pal: { k: '#1c1a22', m: '#8a8794', g: '#7d7a86', G: '#5c5966' }, rle: ['3. 4k 3.', '2. 1k 1m 2k 1m 1k 2.', '2. 1k 1m 2. 1m 1k 2.', '2. 1k 1m 2. 1m 1k 2.', '1. 8k 1.', '1. 1k 6g 1k 1.', '1. 1k 2g 2k 2g 1k 1.', '1. 1k 2G 2k 2G 1k 1.', '1. 1k 6G 1k 1.', '1. 8k 1.'] },
  check: { pal: { k: '#1a2a14', g: '#5fbf5f' }, rle: ['8.', '6. 2k', '5. 1k 1g 1k', '2k 2. 1k 1g 1k 1.', '1k 1g 2k 1g 1k 2.', '1. 1k 2g 1k 3.', '2. 2k 4.', '8.'] },
};

function expandRow(row) {
  let out = '';
  for (const m of row.matchAll(/(\d+)(\S)/g)) out += m[2].repeat(+m[1]);
  return out;
}

function renderSprite(sp) {
  const rows = sp.rle.map(expandRow);
  const c = document.createElement('canvas');
  c.width = rows[0].length;
  c.height = rows.length;
  const x = c.getContext('2d');
  rows.forEach((row, y) => {
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (ch !== '.' && sp.pal[ch]) {
        x.fillStyle = sp.pal[ch];
        x.fillRect(i, y, 1, 1);
      }
    }
  });
  return c.toDataURL();
}

let cache = null;

/** Map of sprite name -> PNG data URL. Includes `heroBlink` (eyes closed). */
export function getSprites() {
  if (cache) return cache;
  cache = {};
  for (const k in SD) cache[k] = renderSprite(SD[k]);
  cache.heroBlink = renderSprite({
    pal: SD.hero.pal,
    rle: SD.hero.rle.map((r, i) => (i === 6 ? '1. 1k 1O 1o 8f 1o 1d 1k 1.' : r)),
  });
  return cache;
}

export const HERO = SD.hero;
export { expandRow };
