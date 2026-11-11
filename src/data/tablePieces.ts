import { products } from './catalog';
import mesaAspect from './mesa-aspect.json';

/** Círculo ou retângulo arredondado. A foto é a mesma do cardápio. */

export type PieceShape = 'rect' | 'round';

export type PieceFootprint = {
  w: number;
  h: number;
  shape: PieceShape;
  /** Poucos graus, só em peças pequenas. Tábuas e travessas ficam paralelas à mesa. */
  tilt: boolean;
};

const rect = (w: number, h: number, tilt = false): PieceFootprint => ({
  w,
  h,
  shape: 'rect',
  tilt,
});

const round = (size: number): PieceFootprint => ({
  w: size,
  h: size,
  shape: 'round',
  tilt: false,
});

const fallback = rect(1.1, 0.72);

/**
 * Proporção lida do recorte de cada foto.
 * A largura dá o peso na mesa: travessa grande, brie pequeno, torta no meio.
 * Tábua e travessa ficam retas. A foto já traz o ângulo.
 */
export const tablePieces: Record<string, PieceFootprint> = {
  // Sem recorte ainda: a foto do cardápio vai emoldurada, então a caixa é mais próxima de uma foto (3:2 a 4:3).
  'tabua-20': rect(2.2, 1.4),
  'tabua-12': rect(1.95, 1.3),
  'tabua-6': rect(1.7, 1.2),
  'torta-fria-frango': rect(1.9, 1.12),
  'torta-fria-vegetariana': rect(1.5, 1.05),
  'torta-fria-frango-pequena': rect(1.28, 0.76),
  'torta-fria-vegetariana-pequena': rect(1.1, 0.8),
  'prensadinhos-frios': rect(2.2, 1.22),
  'prensadinhos-vegetarianos': rect(2.2, 1.24),
  canapes: rect(2.15, 1.08),
  'terrine-gorgonzola': rect(1.85, 0.99),
  'terrine-castanhas': rect(1.85, 0.99),
  'terrine-caprese': rect(1.85, 0.97),
  'terrine-salmao': rect(1.85, 0.97),
  'brie-crocante-g': rect(1.55, 0.88),
  'brie-crocante-p': rect(1.1, 0.63),
  burrata: round(0.96),
  'mini-hamburguer': rect(2, 1.51),
  'mini-hamburguer-vegetariano': rect(1.2, 0.9),
  'mini-hot-dog': rect(1.7, 0.7),
  'palito-caprese': rect(1.15, 0.85),
  'mini-folhado-parma-figo': rect(2.05, 1.07),
  'mini-folhado-carne-seca': rect(2.05, 1.08),
  'tortinha-folhada-bacon': rect(2.05, 0.94),
};

export function pieceId(id: string): string {
  const at = id.indexOf('@');
  return at === -1 ? id : id.slice(0, at);
}

/** Peças com recorte real (com contorno branco). As outras usam a foto do cardápio emoldurada. */
export function hasCutout(id: string): boolean {
  return pieceId(id) in mesaAspect;
}

export function footprint(id: string): PieceFootprint {
  const key = pieceId(id);
  const base = tablePieces[key] ?? fallback;
  const aspect = (mesaAspect as Record<string, number>)[key];
  // Com recorte, a caixa segue a proporção real do prato: nada fica cortado nem sobra vazio.
  if (!aspect || base.shape === 'round') return base;
  return { ...base, h: Number((base.w / aspect).toFixed(3)) };
}

export function mesaImageSrc(id: string): string {
  const key = pieceId(id);
  if (key in mesaAspect) return `/images/mesa/halo/${key}.webp`;
  return products.find((product) => product.id === key)?.image ?? '';
}

export type PackedPiece = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
};

const BOARD_W = 100;
const BOARD_H = 62.5;

function tiltOf(id: string): number {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 33 + id.charCodeAt(index)) >>> 0;
  }
  return (hash % 7) - 3;
}

const GAP = 0.82;

function shelfPack(sorted: Array<{ id: string; w: number; h: number; tilt: boolean }>, target: number) {
  const rows: Array<Array<{ id: string; w: number; h: number; tilt: boolean; x: number }>> = [];
  let cursorX = 0;
  let row: Array<{ id: string; w: number; h: number; tilt: boolean; x: number }> = [];

  for (const item of sorted) {
    if (row.length > 0 && cursorX + item.w > target + 0.01) {
      rows.push(row);
      row = [];
      cursorX = 0;
    }
    row.push({ ...item, x: cursorX });
    cursorX += item.w + GAP;
  }
  if (row.length > 0) rows.push(row);

  const rowHeights = rows.map((line) => Math.max(...line.map((item) => item.h)));
  let cursorY = 0;
  const placed = rows.flatMap((line, index) => {
    const height = rowHeights[index];
    const lineTop = cursorY;
    cursorY += height + GAP;
    return line.map((item) => ({
      ...item,
      y: lineTop + (height - item.h),
    }));
  });

  const totalW = Math.max(...placed.map((item) => item.x + item.w));
  const totalH = cursorY - GAP;
  return { placed, totalW, totalH };
}

/**
 * Empilha as peças em prateleiras e encolhe o conjunto inteiro para caber no pano.
 * A largura da fileira é a que melhor ocupa a mesa 8:5.
 * x/y são o centro, em porcentagem da mesa.
 */
export function packTable(ids: readonly string[]): PackedPiece[] {
  if (ids.length === 0) return [];

  const items = ids.map((id) => ({ id, ...footprint(id) }));
  const sorted = [...items].sort(
    (a, b) => b.w * b.h - a.w * a.h || a.id.localeCompare(b.id),
  );
  const widest = sorted[0].w;
  const sum = sorted.reduce((total, item) => total + item.w, 0);
  const steps = Math.max(1, Math.min(12, sorted.length));
  let best: ReturnType<typeof shelfPack> | null = null;
  let bestScore = -1;

  for (let step = 0; step <= steps; step += 1) {
    const target = widest + ((sum - widest) * step) / steps;
    const packed = shelfPack(sorted, target);
    const scale = Math.min((0.88 * BOARD_W) / packed.totalW, (0.8 * BOARD_H) / packed.totalH);
    const score = (packed.totalW * scale) * (packed.totalH * scale);
    if (score > bestScore) {
      best = packed;
      bestScore = score;
    }
  }

  const chosen = best ?? shelfPack(sorted, widest);
  const scale = Math.min((0.88 * BOARD_W) / chosen.totalW, (0.8 * BOARD_H) / chosen.totalH);
  const originX = (BOARD_W - chosen.totalW * scale) / 2;
  const originY = (BOARD_H - chosen.totalH * scale) / 2;

  return chosen.placed.map((item) => ({
    id: item.id,
    x: ((originX + item.x * scale + (item.w * scale) / 2) / BOARD_W) * 100,
    y: ((originY + item.y * scale + (item.h * scale) / 2) / BOARD_H) * 100,
    w: ((item.w * scale) / BOARD_W) * 100,
    h: ((item.h * scale) / BOARD_H) * 100,
    rotate: item.tilt ? tiltOf(item.id) : 0,
  }));
}
