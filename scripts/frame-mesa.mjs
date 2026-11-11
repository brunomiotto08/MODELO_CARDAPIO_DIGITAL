import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = path.resolve('public/mini-products');
const OUT = path.resolve('public/images/mesa');

/** Cada arquivo vira a miniatura da mesa desses produtos. */
const MAP = {
  1: ['torta-fria-frango', 'torta-fria-frango-pequena'],
  2: ['prensadinhos-frios'],
  3: ['prensadinhos-vegetarianos'],
  5: ['canapes'],
  6: ['terrine-gorgonzola'],
  7: ['terrine-castanhas'],
  8: ['terrine-caprese'],
  9: ['terrine-salmao'],
  10: ['mini-folhado-parma-figo'],
  11: ['mini-folhado-carne-seca'],
  12: ['tortinha-folhada-bacon'],
  13: ['brie-crocante-p'],
  14: ['brie-crocante-g'],
  15: ['mini-hamburguer'],
  16: ['mini-hot-dog'],
};

function idx(x, y, w) {
  return (y * w + x) * 4;
}

function isWhite(r, g, b) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min >= 249 && max - min <= 10;
}

function isHalo(r, g, b) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min >= 226 && max - min <= 16;
}

function cutout(data, w, h) {
  const bg = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let head = 0;
  let tail = 0;

  const push = (x, y) => {
    const p = y * w + x;
    if (bg[p]) return;
    const i = p * 4;
    if (!isWhite(data[i], data[i + 1], data[i + 2])) return;
    bg[p] = 1;
    queue[tail++] = p;
  };

  for (let x = 0; x < w; x += 1) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y += 1) {
    push(0, y);
    push(w - 1, y);
  }

  while (head < tail) {
    const p = queue[head++];
    const x = p % w;
    const y = (p - x) / w;
    if (x > 0) push(x - 1, y);
    if (x + 1 < w) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y + 1 < h) push(x, y + 1);
  }

  // Come só a auréola clara grudada no fundo, no máximo alguns pixels,
  // para não entrar na prata nem no pão.
  const halo = new Uint8Array(w * h);
  const dist = new Uint8Array(w * h);
  head = 0;
  tail = 0;
  const seedHalo = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (bg[p] || halo[p]) return;
    const i = p * 4;
    if (!isHalo(data[i], data[i + 1], data[i + 2])) return;
    halo[p] = 1;
    dist[p] = 1;
    queue[tail++] = p;
  };

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (!bg[y * w + x]) continue;
      seedHalo(x - 1, y);
      seedHalo(x + 1, y);
      seedHalo(x, y - 1);
      seedHalo(x, y + 1);
    }
  }

  while (head < tail) {
    const p = queue[head++];
    const x = p % w;
    const y = (p - x) / w;
    const next = dist[p] + 1;
    if (next > 7) continue;
    const step = (nx, ny) => {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) return;
      const np = ny * w + nx;
      if (bg[np] || halo[np]) return;
      const i = np * 4;
      if (!isHalo(data[i], data[i + 1], data[i + 2])) return;
      dist[np] = next;
      halo[np] = 1;
      queue[tail++] = np;
    };
    step(x - 1, y);
    step(x + 1, y);
    step(x, y - 1);
    step(x, y + 1);
  }

  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const p = y * w + x;
      const i = idx(x, y, w);
      if (bg[p] || halo[p]) {
        data[i + 3] = 0;
        continue;
      }
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  // Desconta o branco da borda que sobrou, sem mexer no miolo.
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const p = y * w + x;
      if (bg[p] || halo[p]) continue;
      let edge = false;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const np = ny * w + nx;
        if (bg[np] || halo[np]) edge = true;
      }
      if (!edge) continue;
      const i = idx(x, y, w);
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const min = Math.min(r, g, b);
      const max = Math.max(r, g, b);
      if (min < 210 || max - min > 28) continue;
      const alpha = Math.max(0, Math.min(255, Math.round((255 - min) * 4.2)));
      if (alpha <= 8) {
        data[i + 3] = 0;
        continue;
      }
      const a = alpha / 255;
      data[i] = Math.max(0, Math.min(255, Math.round((r - 255 * (1 - a)) / a)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round((g - 255 * (1 - a)) / a)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round((b - 255 * (1 - a)) / a)));
      data[i + 3] = alpha;
    }
  }

  if (maxX < minX || maxY < minY) return null;
  const pad = 10;
  return {
    left: Math.max(0, minX - pad),
    top: Math.max(0, minY - pad),
    width: Math.min(w, maxX + pad + 1) - Math.max(0, minX - pad),
    height: Math.min(h, maxY + pad + 1) - Math.max(0, minY - pad),
  };
}

await mkdir(OUT, { recursive: true });

const report = [];

for (const [file, ids] of Object.entries(MAP)) {
  const source = path.join(SRC, `${file}.png`);
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const box = cutout(data, info.width, info.height);
  if (!box) {
    console.error('vazio', file);
    continue;
  }

  const cropped = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .extract(box)
    .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100, effort: 5 })
    .toBuffer();

  const meta = await sharp(cropped).metadata();
  for (const id of ids) {
    await sharp(cropped).toFile(path.join(OUT, `${id}.webp`));
  }
  report.push({
    file,
    ids: ids.join(', '),
    w: meta.width,
    h: meta.height,
    aspect: Number((meta.width / meta.height).toFixed(3)),
  });
}

console.table(report);
