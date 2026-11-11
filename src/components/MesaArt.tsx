import { useId } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Paleta editorial: tons quentes de madeira, prata fria, creme de leite, verde
// botânico, terracota, berry, salmão — todos desaturados e nobres.
// ─────────────────────────────────────────────────────────────────────────────

function star6(cx: number, cy: number, r: number, ri: number): string {
  const pts = 6;
  let d = '';
  for (let i = 0; i < pts; i++) {
    const a1 = (Math.PI * 2 * i) / pts - Math.PI / 2;
    const a2 = (Math.PI * 2 * (i + 0.5)) / pts - Math.PI / 2;
    d += `${i === 0 ? 'M' : 'L'}${(cx + Math.cos(a1) * r).toFixed(2)},${(cy + Math.sin(a1) * r).toFixed(2)} `;
    d += `L${(cx + Math.cos(a2) * ri).toFixed(2)},${(cy + Math.sin(a2) * ri).toFixed(2)} `;
  }
  return d + 'Z';
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFS — cada instância tem uid único
// ─────────────────────────────────────────────────────────────────────────────
function Defs({ u }: { u: string }) {
  return (
    <defs>
      <filter id={`${u}-sh`} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#2c160a" floodOpacity="0.22" />
      </filter>
      <filter id={`${u}-sh2`} x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
        <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#2c160a" floodOpacity="0.16" />
      </filter>

      {/* Madeira — prancha */}
      <linearGradient id={`${u}-Wp`} x1="0.06" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f4d090" />
        <stop offset="28%" stopColor="#d49244" />
        <stop offset="68%" stopColor="#9e622c" />
        <stop offset="100%" stopColor="#6c3e1c" />
      </linearGradient>
      {/* Madeira — radial para alças/redondas */}
      <radialGradient id={`${u}-Wr`} cx="36%" cy="27%" r="74%">
        <stop offset="0%" stopColor="#f0cc84" />
        <stop offset="52%" stopColor="#c0843e" />
        <stop offset="100%" stopColor="#784822" />
      </radialGradient>

      {/* Prata — travessa */}
      <linearGradient id={`${u}-Si`} x1="0.14" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="22%" stopColor="#e4e9ef" />
        <stop offset="58%" stopColor="#b8c2cc" />
        <stop offset="100%" stopColor="#868e9a" />
      </linearGradient>
      {/* Prata radial — prato redondo */}
      <radialGradient id={`${u}-Sr`} cx="34%" cy="28%" r="72%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="42%" stopColor="#d6dce6" />
        <stop offset="100%" stopColor="#8a929e" />
      </radialGradient>

      {/* Creme / branco quente */}
      <linearGradient id={`${u}-Cr`} x1="0.18" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fefdf8" />
        <stop offset="100%" stopColor="#ece1cb" />
      </linearGradient>
      {/* Creme radial */}
      <radialGradient id={`${u}-CrR`} cx="36%" cy="30%" r="72%">
        <stop offset="0%" stopColor="#fffef8" />
        <stop offset="100%" stopColor="#e8d8b8" />
      </radialGradient>

      {/* Pastelaria dourada */}
      <linearGradient id={`${u}-Ps`} x1="0.1" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f8e28c" />
        <stop offset="42%" stopColor="#e8a428" />
        <stop offset="100%" stopColor="#ac6818" />
      </linearGradient>
      <radialGradient id={`${u}-PsR`} cx="34%" cy="26%" r="72%">
        <stop offset="0%" stopColor="#f9ebb8" />
        <stop offset="50%" stopColor="#e09c2a" />
        <stop offset="100%" stopColor="#a46218" />
      </radialGradient>

      {/* Salmão */}
      <linearGradient id={`${u}-Sm`} x1="0.12" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffe2d4" />
        <stop offset="100%" stopColor="#ce7866" />
      </linearGradient>

      {/* Frutas vermelhas / berry */}
      <linearGradient id={`${u}-By`} x1="0.06" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c83a58" />
        <stop offset="100%" stopColor="#6a0e28" />
      </linearGradient>

      {/* Caramelo / âmbar */}
      <linearGradient id={`${u}-Ca`} x1="0.1" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f8c858" />
        <stop offset="100%" stopColor="#c27c18" />
      </linearGradient>

      {/* Verde pesto */}
      <linearGradient id={`${u}-Pg`} x1="0.1" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8abe64" />
        <stop offset="100%" stopColor="#3a6830" />
      </linearGradient>

      {/* Brie crocante — phyllo */}
      <radialGradient id={`${u}-Br`} cx="34%" cy="27%" r="74%">
        <stop offset="0%" stopColor="#f8e69c" />
        <stop offset="48%" stopColor="#ce8a18" />
        <stop offset="100%" stopColor="#885010" />
      </radialGradient>

      {/* Pão de hamburguer */}
      <radialGradient id={`${u}-Bn`} cx="34%" cy="26%" r="72%">
        <stop offset="0%" stopColor="#f9eab8" />
        <stop offset="50%" stopColor="#df9c2a" />
        <stop offset="100%" stopColor="#a46018" />
      </radialGradient>
    </defs>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PEÇAS BASE
// ─────────────────────────────────────────────────────────────────────────────

function Board({ u, x, y, w, h, rx = 11 }: { u: string; x: number; y: number; w: number; h: number; rx?: number }) {
  const grains = [0.13, 0.27, 0.43, 0.59, 0.75, 0.90];
  return (
    <g>
      <rect x={x + 3} y={y + 7} width={w} height={h} rx={rx} fill="#2c1608" opacity="0.22" />
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={`url(#${u}-Wp)`} />
      {grains.map((t, i) => (
        <line
          key={i}
          x1={x + w * t} y1={y + 2.5}
          x2={x + w * t - h * 0.07} y2={y + h - 2.5}
          stroke="#5a2e14" strokeOpacity={0.055 + i * 0.013}
          strokeWidth="1.4" strokeLinecap="round"
        />
      ))}
      <path d={`M ${x + rx + 3} ${y + 3.5} H ${x + w - rx - 3}`} stroke="#fff" strokeWidth="2.2" strokeOpacity="0.24" strokeLinecap="round" />
    </g>
  );
}

function Paddle({ u, x, y, w, h }: { u: string; x: number; y: number; w: number; h: number }) {
  const hL = w * 0.28;
  const hH = h * 0.36;
  const bx = x + hL * 0.6;
  const bw = w - hL * 0.6;
  return (
    <g>
      <rect x={x + 3} y={y + 6} width={w} height={h} rx={9} fill="#2c1608" opacity="0.2" />
      <rect x={x} y={y + (h - hH) / 2} width={hL + 10} height={hH} rx={hH * 0.48} fill={`url(#${u}-Wp)`} />
      <circle cx={x + hL * 0.3} cy={y + h / 2} r={Math.min(h * 0.08, 4.5)} fill="#2c1608" opacity="0.42" />
      <rect x={bx} y={y} width={bw} height={h} rx={9} fill={`url(#${u}-Wp)`} />
      {[0.2, 0.42, 0.63, 0.84].map((t, i) => (
        <line key={i}
          x1={bx + bw * t} y1={y + 2}
          x2={bx + bw * t - h * 0.07} y2={y + h - 2}
          stroke="#5a2e14" strokeOpacity={0.06 + i * 0.015} strokeWidth="1.3" strokeLinecap="round"
        />
      ))}
      <path d={`M ${bx + 10} ${y + 3} H ${bx + bw - 10}`} stroke="#fff" strokeWidth="2" strokeOpacity="0.22" strokeLinecap="round" />
    </g>
  );
}

function Tray({ u, x, y, w, h }: { u: string; x: number; y: number; w: number; h: number }) {
  const corners: [number, number][] = [[x + 4, y + 4], [x + w - 4, y + 4], [x + 4, y + h - 4], [x + w - 4, y + h - 4]];
  return (
    <g>
      <rect x={x + 2} y={y + 3} width={w} height={h} rx={5} fill="#101520" opacity="0.16" />
      <rect x={x} y={y} width={w} height={h} rx={5} fill={`url(#${u}-Si)`} />
      <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} rx={3.5} fill="none" stroke="#fff" strokeWidth="0.9" strokeOpacity="0.46" />
      {corners.map(([cx2, cy2], i) => <circle key={i} cx={cx2} cy={cy2} r={1.6} fill="#fff" opacity="0.38" />)}
      <path d={`M ${x + 6} ${y + 2} H ${x + w * 0.46}`} stroke="#fff" strokeWidth="2.4" strokeOpacity="0.42" strokeLinecap="round" />
    </g>
  );
}

function RoundPaddle({ u, cx, cy, bR, tR }: { u: string; cx: number; cy: number; bR: number; tR: number }) {
  const hW = bR * 0.74;
  const hH = bR * 0.3;
  return (
    <g>
      <ellipse cx={cx + 2} cy={cy + 6} rx={bR + 2} ry={(bR + 2) * 0.63} fill="#2c1608" opacity="0.2" />
      <rect x={cx - bR - hW * 0.9} y={cy - hH / 2} width={hW + 5} height={hH} rx={hH * 0.5} fill={`url(#${u}-Wp)`} />
      <circle cx={cx - bR - hW * 0.65} cy={cy} r={hH * 0.26} fill="#2c1608" opacity="0.42" />
      <ellipse cx={cx} cy={cy} rx={bR} ry={bR * 0.63} fill={`url(#${u}-Wr)`} />
      <ellipse cx={cx} cy={cy} rx={tR} ry={tR * 0.63} fill={`url(#${u}-Sr)`} />
      <ellipse cx={cx} cy={cy} rx={tR * 0.95} ry={tR * 0.95 * 0.63} fill="none" stroke="#fff" strokeWidth="0.9" strokeOpacity="0.4" />
      <ellipse cx={cx - tR * 0.18} cy={cy - tR * 0.15} rx={tR * 0.26} ry={tR * 0.14} fill="#fff" opacity="0.3" />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOTÂNICA
// ─────────────────────────────────────────────────────────────────────────────

function Leaf({ x, y, a = 0, len = 7, fill = '#3a7840' }: { x: number; y: number; a?: number; len?: number; fill?: string }) {
  const r = len;
  return (
    <g transform={`rotate(${a} ${x} ${y})`}>
      <path
        d={`M${x},${y - r} C${x + r * 0.55},${y - r * 0.36} ${x + r * 0.64},${y + r * 0.42} ${x},${y + r} C${x - r * 0.64},${y + r * 0.42} ${x - r * 0.55},${y - r * 0.36} ${x},${y - r}Z`}
        fill={fill}
      />
      <line x1={x} y1={y - r * 0.88} x2={x} y2={y + r * 0.88} stroke="#243e2c" strokeWidth="0.6" strokeOpacity="0.44" />
    </g>
  );
}

function Cherry({ cx, cy, r = 4.5 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#c0391c" />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.32} r={r * 0.3} fill="#fff" opacity="0.44" />
      <line x1={cx - 0.5} y1={cy - r} x2={cx - 1.5} y2={cy - r - 4} stroke="#2e6038" strokeWidth="0.85" strokeLinecap="round" />
    </g>
  );
}

function Berry({ cx, cy, r = 3.8, fill = '#8a1830' }: { cx: number; cy: number; r?: number; fill?: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      <circle cx={cx - r * 0.32} cy={cy - r * 0.3} r={r * 0.28} fill="#fff" opacity="0.36" />
    </g>
  );
}

function Physalis({ cx, cy }: { cx: number; cy: number }) {
  const angles = [-32, -16, 0, 16, 32];
  return (
    <g>
      {angles.map((a, i) => (
        <line key={i} x1={cx} y1={cy}
          x2={cx + Math.sin(a * Math.PI / 180) * 8} y2={cy - 8}
          stroke="#c89824" strokeWidth="0.9" strokeOpacity="0.68"
        />
      ))}
      <circle cx={cx} cy={cy + 0.5} r={3.8} fill="#f5c83a" />
      <circle cx={cx - 1.2} cy={cy - 0.5} r={1.4} fill="#fff" opacity="0.42" />
    </g>
  );
}

function Almond({ x, y, a = 0 }: { x: number; y: number; a?: number }) {
  return (
    <ellipse cx={x} cy={y} rx={6} ry={2.4} fill="#f4eed8" transform={`rotate(${a} ${x} ${y})`}
      stroke="#d4c89a" strokeWidth="0.5"
    />
  );
}

function Thyme({ x, y, angle = -90, len = 20 }: { x: number; y: number; angle?: number; len?: number }) {
  const rad = (a: number) => a * Math.PI / 180;
  const dx = Math.cos(rad(angle));
  const dy = Math.sin(rad(angle));
  const steps = Math.floor(len / 3.8);
  return (
    <g>
      <line x1={x} y1={y} x2={x + dx * len} y2={y + dy * len} stroke="#2d5a34" strokeWidth="1.1" strokeLinecap="round" />
      {Array.from({ length: steps }, (_, i) => {
        const t = (i + 0.5) / steps;
        const px = x + dx * len * t;
        const py = y + dy * len * t;
        const side = i % 2 === 0 ? 1 : -1;
        const perp = rad(angle + 90);
        return (
          <path key={i}
            d={`M${px},${py} L${px + Math.cos(perp) * side * 5.5},${py + Math.sin(perp) * side * 5.5 - 0.5}`}
            stroke="#3d7a44" strokeWidth="1.5" strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

function Honey({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x},${y} Q${x + 4},${y + 6} ${x + 2},${y + 14} Q${x - 1},${y + 18} ${x + 1},${y + 24}`}
      fill="none" stroke="#e8a818" strokeWidth="2.2" strokeLinecap="round" opacity="0.72"
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PEÇAS DE COMIDA
// ─────────────────────────────────────────────────────────────────────────────

function TortaFria({ u, veg = false }: { u: string; veg?: boolean }) {
  const bx = 7, by = 20, bw = 176, bh = 46;
  const lx = 20, ly = 23, lw = 150, lh = 36;
  return (
    <g filter={`url(#${u}-sh)`}>
      <Board u={u} x={bx} y={by} w={bw} h={bh} />
      {/* loaf shadow */}
      <rect x={lx + 2} y={ly + lh - 2} width={lw} height={6} rx={3} fill="#2c1608" opacity="0.1" />
      {/* loaf body */}
      <rect x={lx} y={ly} width={lw} height={lh} rx={6} fill={`url(#${u}-Cr)`} />
      {/* side face — sutil perspectiva */}
      <path d={`M${lx + lw},${ly + 6} L${lx + lw + 8},${ly + 10} L${lx + lw + 8},${ly + lh + 2} L${lx + lw},${ly + lh} Z`}
        fill="#c8b89a" />
      {veg
        ? <>
          <rect x={lx} y={ly + lh * 0.56} width={lw} height={lh * 0.18} fill="#6a9852" opacity="0.86" rx={1} />
          <rect x={lx} y={ly + lh * 0.74} width={lw} height={lh * 0.14} fill="#94305e" opacity="0.82" rx={1} />
        </>
        : [22, 48, 78, 110, 138].map((sx) => (
          <circle key={sx} cx={lx + sx} cy={ly + lh * 0.42} r={1} fill="#6a6050" opacity="0.52" />
        ))}
      {/* highlight */}
      <rect x={lx + 5} y={ly + 3.5} width={lw * 0.42} height={3} rx={1.5} fill="#fff" opacity="0.42" />
      {/* garnish */}
      <g className="mesa-sway">
        {veg ? (
          <>
            <Leaf x={lx + lw * 0.72} y={ly + 9} a={-20} len={6.5} fill="#3a7840" />
            <Leaf x={lx + lw * 0.78} y={ly + 6} a={22} len={5.5} fill="#4c9452" />
            <Cherry cx={lx + lw * 0.68} cy={ly + 15} r={4.2} />
          </>
        ) : (
          <>
            <Leaf x={lx + lw * 0.72} y={ly + 10} a={-24} len={6.5} fill="#3a7840" />
            <Physalis cx={lx + lw * 0.80} cy={ly + 11} />
            <Cherry cx={lx + lw * 0.65} cy={ly + 16} r={4.2} />
            <Cherry cx={lx + lw * 0.73} cy={ly + 19} r={3.4} />
          </>
        )}
      </g>
    </g>
  );
}

function Prensadinhos({ u, veg = false }: { u: string; veg?: boolean }) {
  const bx = 4, by = 14, bw = 212, bh = 98;
  const cols = 6, rows = 3;
  const sw = 24, sh = 20;
  const bandFill = veg ? '#942e5a' : '#d08c64';
  return (
    <g filter={`url(#${u}-sh)`}>
      <Board u={u} x={bx} y={by} w={bw} h={bh} />
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const sx = bx + 14 + col * (sw + 9.4);
          const sy = by + 14 + row * (sh + 11);
          return (
            <g key={`${row}-${col}`}>
              <rect x={sx + 1.5} y={sy + 2} width={sw} height={sh} rx={2.5} fill="#2c1608" opacity="0.1" />
              <rect x={sx} y={sy + sh * 0.58} width={sw} height={sh * 0.42} rx={2.5} fill="#e8dcc0" />
              <rect x={sx} y={sy + sh * 0.36} width={sw} height={sh * 0.28} fill={bandFill} />
              {veg && <rect x={sx} y={sy + sh * 0.5} width={sw} height={sh * 0.1} fill="#5a8c48" />}
              <rect x={sx} y={sy} width={sw} height={sh * 0.4} rx={2.5} fill="#f4ead0" />
              <rect x={sx + 2} y={sy + 1.5} width={sw * 0.52} height={2.5} rx={1.2} fill="#fff" opacity="0.4" />
              {/* carrot flower */}
              <circle cx={sx + sw / 2} cy={sy + sh * 0.21} r={4} fill="#e07c2a" />
              <circle cx={sx + sw / 2} cy={sy + sh * 0.21} r={2.3} fill="#f4a048" />
              <circle cx={sx + sw / 2 - 1.3} cy={sy + sh * 0.17} r={1.1} fill="#fff" opacity="0.4" />
              {/* skewer */}
              <line x1={sx + sw / 2} y1={sy - 14} x2={sx + sw / 2} y2={sy + sh * 0.4}
                stroke="#d4b888" strokeWidth="1.1" strokeLinecap="round" />
              <line x1={sx + sw / 2 - 2} y1={sy - 13.5} x2={sx + sw / 2 + 2} y2={sy - 13.5}
                stroke="#b89860" strokeWidth="1" />
            </g>
          );
        }),
      )}
    </g>
  );
}

function Cream({ cx, cy, r = 5.2 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#fffdf8" />
      <path
        d={`M${cx - r * 0.15},${cy} 
            C${cx - r},${cy - r * 0.9} ${cx + r * 0.2},${cy - r} ${cx + r * 0.15},${cy - r * 0.05}
            C${cx + r * 0.9},${cy - r * 0.7} ${cx + r * 0.7},${cy + r * 0.45} ${cx},${cy + r * 0.15}`}
        fill="none" stroke="#f3ead8" strokeWidth="1.3" strokeLinecap="round"
      />
    </g>
  );
}

function Canapes({ u }: { u: string }) {
  type Bite = { x: number; y: number; kind: 'star' | 'round'; top: 'tomato' | 'salmon' | 'citrus' };
  const bites: Bite[] = [
    { x: 36, y: 34, kind: 'star', top: 'salmon' },
    { x: 78, y: 30, kind: 'star', top: 'tomato' },
    { x: 120, y: 36, kind: 'round', top: 'citrus' },
    { x: 164, y: 30, kind: 'star', top: 'salmon' },
    { x: 52, y: 72, kind: 'star', top: 'tomato' },
    { x: 96, y: 68, kind: 'round', top: 'salmon' },
    { x: 140, y: 74, kind: 'star', top: 'citrus' },
    { x: 182, y: 68, kind: 'star', top: 'tomato' },
  ];
  return (
    <g filter={`url(#${u}-sh)`}>
      <Tray u={u} x={8} y={12} w={198} h={80} />
      {bites.map(({ x, y, kind, top }) => (
        <g key={`${x}-${y}`}>
          {kind === 'star' ? (
            <path d={star6(x, y + 1, 15, 7.2)} fill="#f7f1e6" />
          ) : (
            <circle cx={x} cy={y + 1} r={13} fill="#f7f1e6" />
          )}
          <Cream cx={x} cy={y - 1} r={kind === 'round' ? 6.2 : 5.4} />
          {top === 'tomato' && (
            <>
              <circle cx={x} cy={y - 2} r={5.2} fill="#e23b2f" />
              <circle cx={x} cy={y - 2} r={3.4} fill="#f25a48" />
              <circle cx={x - 1.4} cy={y - 3.2} r={1.3} fill="#fff" opacity="0.45" />
              <Leaf x={x + 5} y={y - 1} a={28} len={4.2} fill="#2f6a38" />
            </>
          )}
          {top === 'salmon' && (
            <>
              <path d={`M${x - 5},${y + 1} C${x - 3},${y - 7} ${x + 1},${y - 6} ${x},${y - 1} C${x + 2},${y - 7} ${x + 6},${y - 5} ${x + 4},${y + 1} Z`} fill="#e88972" />
              <path d={`M${x - 3},${y} C${x - 1},${y - 4} ${x + 2},${y - 3} ${x + 1},${y + 0.5}`} fill="none" stroke="#f6c2b2" strokeWidth="0.8" />
              <Leaf x={x + 4} y={y - 5} a={-20} len={3.6} fill="#3a7840" />
            </>
          )}
          {top === 'citrus' && (
            <>
              <path d={`M${x - 4},${y + 1} L${x + 1},${y - 6} L${x + 5},${y + 1} Z`} fill="#f0b43a" />
              <Leaf x={x + 5} y={y - 3} a={24} len={3.4} fill="#2f6a38" />
            </>
          )}
        </g>
      ))}
    </g>
  );
}

type TerrineTop = {
  fill: string;
  accent: React.ReactNode;
};

function TerrinePiece({ u, top }: { u: string; top: TerrineTop }) {
  const lx = 62, ly = 22, lw = 104, lh = 36;
  return (
    <g filter={`url(#${u}-sh)`}>
      <Paddle u={u} x={2} y={14} w={180} h={52} />
      <Tray u={u} x={52} y={16} w={124} h={46} />
      <rect x={lx} y={ly + 8} width={lw} height={lh - 6} rx={5} fill="#efe4d2" />
      <rect x={lx} y={ly} width={lw} height={lh * 0.72} rx={5} fill={top.fill} />
      <path d={`M${lx + 8} ${ly + 4} H ${lx + lw * 0.42}`} stroke="#fff" strokeWidth="2" strokeOpacity="0.28" strokeLinecap="round" />
      <g className="mesa-sway">{top.accent}</g>
    </g>
  );
}

function TerrineGorgonzola({ u }: { u: string }) {
  return (
    <TerrinePiece u={u} top={{
      fill: `url(#${u}-By)`,
      accent: (
        <>
          <Berry cx={94} cy={22} r={4.2} fill="#8a1830" />
          <Berry cx={106} cy={19} r={3.6} fill="#6e0e22" />
          <Berry cx={118} cy={23} r={3.8} fill="#a02040" />
          <Berry cx={110} cy={27} r={3} fill="#5c0a1a" />
          <Leaf x={100} y={18} a={-18} len={5.5} fill="#2d5e34" />
          <Thyme x={128} y={32} angle={-100} len={16} />
        </>
      ),
    }} />
  );
}

function TerrineAmendoas({ u }: { u: string }) {
  return (
    <TerrinePiece u={u} top={{
      fill: `url(#${u}-Ca)`,
      accent: (
        <>
          <Almond x={88} y={22} a={-28} />
          <Almond x={102} y={18} a={15} />
          <Almond x={116} y={23} a={-8} />
          <Almond x={124} y={19} a={34} />
          <Physalis cx={90} cy={17} />
          <Leaf x={108} y={14} a={-14} len={5} fill="#3a7840" />
        </>
      ),
    }} />
  );
}

function TerrineCaprese({ u }: { u: string }) {
  return (
    <TerrinePiece u={u} top={{
      fill: `url(#${u}-Pg)`,
      accent: (
        <>
          <Cherry cx={92} cy={22} r={4.4} />
          <Cherry cx={106} cy={19} r={3.8} />
          <Cherry cx={120} cy={23} r={4} />
          <Leaf x={100} y={16} a={12} len={5.5} fill="#234d2a" />
          <Leaf x={116} y={14} a={-20} len={5} fill="#2a5e30" />
        </>
      ),
    }} />
  );
}

function Pepper({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x},${y + 8} C${x - 6},${y + 4} ${x - 5},${y - 4} ${x},${y - 7} C${x + 5},${y - 4} ${x + 6},${y + 4} ${x},${y + 8}Z`} fill="#d62828" />
      <path d={`M${x - 1.2},${y - 1} C${x - 2},${y - 4} ${x + 0.4},${y - 5} ${x + 0.2},${y - 1}`} fill="#fff" opacity="0.35" />
      <path d={`M${x},${y - 7} Q${x + 1},${y - 11} ${x + 3},${y - 12}`} fill="none" stroke="#2f6a38" strokeWidth="1" strokeLinecap="round" />
    </g>
  );
}

function TerrineSalmao({ u }: { u: string }) {
  return (
    <TerrinePiece u={u} top={{
      fill: `url(#${u}-Sm)`,
      accent: (
        <>
          <Leaf x={86} y={32} a={-50} len={7} fill="#2f6a38" />
          <Leaf x={94} y={28} a={-12} len={8} fill="#3d7a44" />
          <Leaf x={104} y={31} a={24} len={6.5} fill="#2a5a32" />
          <Leaf x={78} y={36} a={-80} len={6} fill="#3a7840" />
          <Pepper x={126} y={32} />
          <Pepper x={140} y={36} />
        </>
      ),
    }} />
  );
}

type FolhadoKind = 'fig' | 'carne' | 'bacon';

function Folhado({ u, kind }: { u: string; kind: FolhadoKind }) {
  const bx = 4, by = 10, bw = 197, bh = 74;
  const rows = 4, cols = 7;
  const topFills: Record<FolhadoKind, string> = { fig: '#c0786a', carne: '#6a3820', bacon: '#d4a884' };
  const topFill = topFills[kind];
  return (
    <g filter={`url(#${u}-sh)`}>
      <Board u={u} x={bx} y={by} w={bw} h={bh} />
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const cx = bx + 18 + col * 26;
          const cy = by + 16 + row * 15;
          return (
            <g key={`${row}-${col}`}>
              {/* pastry shadow */}
              <ellipse cx={cx + 1} cy={cy + 2} rx={9} ry={5.5} fill="#2c1608" opacity="0.1" />
              {/* pastry layers */}
              <ellipse cx={cx} cy={cy + 1} rx={9} ry={5.5} fill={`url(#${u}-Ps)`} />
              <ellipse cx={cx} cy={cy} rx={8.5} ry={5} fill={`url(#${u}-Ps)`} />
              {/* pastry flaky edge lines */}
              <ellipse cx={cx} cy={cy - 0.5} rx={8} ry={4.5} fill="none" stroke="#c88020" strokeWidth="0.6" strokeOpacity="0.5" />
              {/* topping */}
              <ellipse cx={cx} cy={cy - 0.8} rx={5} ry={3} fill={topFill} />
              {kind === 'fig' && <Leaf x={cx + 2} y={cy - 2} a={22} len={3} fill="#2a5e30" />}
              {kind === 'carne' && <circle cx={cx + 2} cy={cy - 2.5} r={1.5} fill="#c03a28" />}
              {kind === 'bacon' && (
                <>
                  <circle cx={cx} cy={cy - 1.5} r={1.4} fill="#8a3020" />
                  <circle cx={cx + 2} cy={cy - 2.8} r={1.1} fill="#4a7a28" />
                </>
              )}
              {/* shine */}
              <ellipse cx={cx - 2.5} cy={cy - 2.5} rx={2.5} ry={1.4} fill="#fff" opacity="0.32" />
            </g>
          );
        }),
      )}
    </g>
  );
}

function ruffle(cx: number, cy: number, rx: number, ry: number, n = 16): string {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    const wobble = i % 2 === 0 ? 1.08 : 0.84;
    d += `${i === 0 ? 'M' : 'L'}${(cx + Math.cos(a) * rx * wobble).toFixed(1)},${(cy + Math.sin(a) * ry * wobble).toFixed(1)} `;
  }
  return `${d}Z`;
}

function BrieArt({ u, big = false }: { u: string; big?: boolean }) {
  const cx = big ? 98 : 66;
  const cy = big ? 48 : 32;
  const bR = big ? 40 : 26;
  const rx = big ? 30 : 18;
  const ry = rx * 0.62;
  const nuts: [number, number, string, number][] = big
    ? [[-7, -4, '#7a3c12', 5], [2, -8, '#c4842a', 4.4], [8, -2, '#5c2c0e', 4.6], [-1, 2, '#a86820', 5.2], [-10, 2, '#8a5018', 3.8], [6, 4, '#6a3410', 3.6]]
    : [[-4, -3, '#7a3c12', 3.4], [3, -5, '#c4842a', 3], [5, 0, '#5c2c0e', 3.2], [-1, 2, '#a86820', 3.4]];
  return (
    <g filter={`url(#${u}-sh)`}>
      <RoundPaddle u={u} cx={cx} cy={cy} bR={bR} tR={bR * 0.82} />
      <path d={ruffle(cx, cy + 1, rx, ry)} fill="#c47a18" />
      <ellipse cx={cx} cy={cy} rx={rx * 0.78} ry={ry * 0.78} fill={`url(#${u}-Br)`} />
      <ellipse cx={cx - rx * 0.22} cy={cy - ry * 0.28} rx={rx * 0.28} ry={ry * 0.22} fill="#ffe9a8" opacity="0.55" />
      {nuts.map(([dx, dy, fill, r], i) => (
        <ellipse key={i} cx={cx + dx} cy={cy + dy} rx={r} ry={r * 0.72} fill={fill}
          transform={`rotate(${i * 28} ${cx + dx} ${cy + dy})`} />
      ))}
      <Honey x={cx + rx * 0.35} y={cy - ry * 0.9} />
    </g>
  );
}

function MiniHamburguers({ u }: { u: string }) {
  const bx = 5, by = 14, bw = 190, bh = 123;
  const positions = [
    [32, 30], [74, 25], [116, 32], [158, 26],
    [24, 68], [66, 74], [108, 66], [152, 76],
    [44, 108], [92, 114], [140, 106],
  ];
  return (
    <g filter={`url(#${u}-sh)`}>
      <Board u={u} x={bx} y={by} w={bw} h={bh} />
      {positions.map(([bx2, by2], idx) => (
        <g key={idx}>
          {/* shadow */}
          <ellipse cx={bx2 + 1} cy={by2 + 15} rx={14} ry={4.5} fill="#2c1608" opacity="0.1" />
          {/* bottom bun */}
          <ellipse cx={bx2} cy={by2 + 11} rx={13} ry={4.5} fill="#e8c880" />
          {/* lettuce */}
          <path d={`M${bx2 - 13},${by2 + 8} Q${bx2 - 6},${by2 + 4} ${bx2},${by2 + 7} Q${bx2 + 6},${by2 + 4} ${bx2 + 13},${by2 + 8}`}
            fill="#5a9442" />
          {/* patty */}
          <ellipse cx={bx2} cy={by2 + 7} rx={11} ry={3.5} fill="#6a3820" />
          {/* tomato */}
          <ellipse cx={bx2} cy={by2 + 4} rx={9.5} ry={3} fill="#c03a28" />
          {/* top bun */}
          <path d={`M${bx2 - 13},${by2 + 2} Q${bx2},${by2 - 10} ${bx2 + 13},${by2 + 2} Q${bx2},${by2 + 7} ${bx2 - 13},${by2 + 2}Z`}
            fill={`url(#${u}-Bn)`} />
          {/* sesame seeds on top bun */}
          {[-5, -1, 4].map((dx, i) => (
            <ellipse key={i} cx={bx2 + dx} cy={by2 - 4 + (i % 2)} rx={1.3} ry={0.7} fill="#f4f0e0" transform={`rotate(-15 ${bx2 + dx} ${by2 - 4})`} />
          ))}
          {/* bun highlight */}
          <ellipse cx={bx2 - 3} cy={by2 - 5} rx={4.5} ry={2.2} fill="#fff" opacity="0.3" />
          {/* skewer */}
          <line x1={bx2} y1={by2 - 20} x2={bx2} y2={by2 + 2} stroke="#d4b480" strokeWidth="1.1" strokeLinecap="round" />
          <line x1={bx2 - 2.5} y1={by2 - 20} x2={bx2 + 2.5} y2={by2 - 20} stroke="#c09060" strokeWidth="1.2" />
        </g>
      ))}
    </g>
  );
}

function MiniHotDog({ u }: { u: string }) {
  const bx = 4, by = 14, bw = 162, bh = 42;
  const xs = [22, 54, 86, 118, 150];
  return (
    <g filter={`url(#${u}-sh)`}>
      <Board u={u} x={bx} y={by} w={bw} h={bh} />
      {xs.map((x) => {
        const cy = by + bh / 2 + 1;
        return (
          <g key={x}>
            {/* bun shadow */}
            <ellipse cx={x + 1} cy={cy + 3} rx={13} ry={9.5} fill="#2c1608" opacity="0.1" />
            {/* bun body */}
            <ellipse cx={x} cy={cy} rx={13} ry={9.5} fill="#f0d898" />
            {/* bun top half */}
            <path d={`M${x - 13},${cy} C${x - 13},${cy - 12} ${x + 13},${cy - 12} ${x + 13},${cy} Z`}
              fill="#f8e4a8" />
            {/* sausage visible */}
            <rect x={x - 9} y={cy - 4} width={18} height={8} rx={4} fill="#c8684a" />
            <rect x={x - 7} y={cy - 2.5} width={8} height={2.2} rx={1.1} fill="#e07858" opacity="0.7" />
            {/* bun highlight */}
            <ellipse cx={x - 4} cy={cy - 7} rx={5} ry={2.4} fill="#fff" opacity="0.36" />
            {/* gap line */}
            <line x1={x - 12} y1={cy} x2={x + 12} y2={cy} stroke="#c8b070" strokeWidth="0.8" strokeOpacity="0.6" />
          </g>
        );
      })}
    </g>
  );
}

function PalitoCaprese({ u }: { u: string }) {
  const bx = 4, by = 10, bw = 112, bh = 28;
  const xs = [18, 38, 58, 78, 98];
  return (
    <g filter={`url(#${u}-sh)`}>
      <Board u={u} x={bx} y={by} w={bw} h={bh} />
      {xs.map((x, idx) => {
        const rot = (idx % 2 === 0 ? -6 : 6);
        const cy = by + bh / 2;
        return (
          <g key={x} transform={`rotate(${rot} ${x} ${cy})`}>
            {/* stick */}
            <line x1={x} y1={by + 2} x2={x} y2={by + bh - 2} stroke="#d4b880" strokeWidth="1.2" strokeLinecap="round" />
            {/* mozzarella cube */}
            <rect x={x - 5} y={by + bh * 0.1} width={10} height={8} rx={2} fill="#fafaf4" />
            <rect x={x - 4} y={by + bh * 0.1 + 1} width={5} height={2} rx={0.8} fill="#fff" opacity="0.5" />
            {/* basil leaf */}
            <Leaf x={x} y={by + bh * 0.46} a={0} len={4.5} fill="#3a7840" />
            {/* cherry tomato */}
            <Cherry cx={x} cy={by + bh * 0.74} r={4} />
          </g>
        );
      })}
    </g>
  );
}

function BurrataArt({ u }: { u: string }) {
  const tomatoes = [
    [18, 62], [30, 70], [44, 74], [58, 73], [72, 66], [80, 56], [16, 52], [84, 48],
  ];
  return (
    <g filter={`url(#${u}-sh)`}>
      <ellipse cx={50} cy={58} rx={44} ry={28} fill={`url(#${u}-Sr)`} />
      <ellipse cx={50} cy={58} rx={40} ry={24} fill="none" stroke="#fff" strokeOpacity="0.55" />
      {tomatoes.map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={7} ry={5} fill={i % 2 ? '#c43224' : '#e24a34'} transform={`rotate(${i * 18} ${x} ${y})`} />
          <ellipse cx={x - 1.5} cy={y - 1.2} rx={2} ry={1.2} fill="#fff" opacity="0.28" />
        </g>
      ))}
      <path d="M28,48 C32,28 68,28 72,48 C66,62 34,64 28,48Z" fill="#fffaf2" />
      <path d="M34,40 C40,32 60,32 66,42" fill="none" stroke="#f3e6cc" strokeWidth="1.4" />
      <ellipse cx={50} cy={36} rx={16} ry={8} fill="#4a6230" />
      <ellipse cx={50} cy={34.5} rx={14} ry={6} fill="#5e7a38" />
      {[44, 50, 56].map((x) => (
        <path key={x} d={`M${x},38 Q${x + 1},48 ${x - 1},58`} fill="none" stroke="#d6a51e" strokeWidth="1.1" strokeLinecap="round" opacity="0.8" />
      ))}
      <ellipse cx={40} cy={32} rx={5} ry={2.4} fill="#fff" opacity="0.35" />
    </g>
  );
}

function TabuaArt({ u, wide }: { u: string; wide: number }) {
  const grapes = [
    [28, 36], [38, 30], [48, 36], [34, 46], [46, 46], [28, 54], [40, 56], [52, 52],
  ];
  const salamiCount = wide > 210 ? 6 : 4;
  const salamiX = wide > 210 ? 118 : 96;
  return (
    <g filter={`url(#${u}-sh)`}>
      <Board u={u} x={4} y={14} w={wide - 8} h={64} rx={12} />
      <g className="mesa-sway">
        {grapes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={6.2} fill={i % 2 ? '#7d9a3a' : '#8eae46'} />
        ))}
        <path d="M38,24 Q42,18 48,22" fill="none" stroke="#3a6830" strokeWidth="1.3" strokeLinecap="round" />
        <Leaf x={46} y={20} a={30} len={6} fill="#3a7840" />
      </g>
      <g>
        <path d="M62,40 C66,28 78,30 76,42 C74,50 64,50 62,40Z" fill="#d63a32" />
        <path d="M70,44 C74,32 86,34 84,46 C82,54 72,54 70,44Z" fill="#e24a3c" />
        <circle cx={68} cy={36} r={1.2} fill="#f2d26a" />
        <circle cx={76} cy={40} r={1.2} fill="#f2d26a" />
      </g>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={86 + i * 11} y={28 + (i % 2) * 6} width={10} height={10} rx={1.5} fill={i === 1 ? '#f0c24a' : '#f6e2a4'} />
          <rect x={86 + i * 11} y={36 + (i % 2) * 6} width={10} height={2} fill="#e2b25a" />
        </g>
      ))}
      {Array.from({ length: salamiCount }, (_, i) => (
        <ellipse key={i} cx={salamiX + i * 11} cy={48 - (i % 2) * 4} rx={8} ry={5.5}
          fill={i % 2 ? '#b4332c' : '#c44538'} transform={`rotate(${-18 + i * 6} ${salamiX + i * 11} ${48 - (i % 2) * 4})`} />
      ))}
      <path d={`M${wide - 28},30 C${wide - 18},24 ${wide - 12},36 ${wide - 16},48 C${wide - 22},40 ${wide - 30},40 ${wide - 28},30Z`} fill="#e7b0a4" />
      <path d={`M${wide - 22},32 C${wide - 14},28 ${wide - 8},40 ${wide - 12},50`} fill="none" stroke="#c48478" strokeWidth="1" />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROTEADOR
// ─────────────────────────────────────────────────────────────────────────────
function artOf(id: string, u: string): { vb: string; node: React.ReactNode } {
  switch (id) {
    case 'torta-fria-frango':
      return { vb: '0 0 190 76', node: <TortaFria u={u} /> };
    case 'torta-fria-frango-pequena':
      return { vb: '0 0 128 51', node: <TortaFria u={u} /> };
    case 'torta-fria-vegetariana':
      return { vb: '0 0 190 76', node: <TortaFria u={u} veg /> };
    case 'torta-fria-vegetariana-pequena':
      return { vb: '0 0 128 51', node: <TortaFria u={u} veg /> };
    case 'prensadinhos-frios':
      return { vb: '0 0 220 126', node: <Prensadinhos u={u} /> };
    case 'prensadinhos-vegetarianos':
      return { vb: '0 0 220 126', node: <Prensadinhos u={u} veg /> };
    case 'canapes':
      return { vb: '0 0 215 103', node: <Canapes u={u} /> };
    case 'terrine-gorgonzola':
      return { vb: '0 0 185 75', node: <TerrineGorgonzola u={u} /> };
    case 'terrine-castanhas':
      return { vb: '0 0 185 75', node: <TerrineAmendoas u={u} /> };
    case 'terrine-caprese':
      return { vb: '0 0 185 75', node: <TerrineCaprese u={u} /> };
    case 'terrine-salmao':
      return { vb: '0 0 185 81', node: <TerrineSalmao u={u} /> };
    case 'brie-crocante-g':
      return { vb: '0 0 155 88', node: <BrieArt u={u} big /> };
    case 'brie-crocante-p':
      return { vb: '0 0 102 58', node: <BrieArt u={u} /> };
    case 'burrata':
      return { vb: '0 0 100 96', node: <BurrataArt u={u} /> };
    case 'mini-hamburguer':
    case 'mini-hamburguer-vegetariano':
      return { vb: '0 0 200 151', node: <MiniHamburguers u={u} /> };
    case 'mini-hot-dog':
      return { vb: '0 0 170 70', node: <MiniHotDog u={u} /> };
    case 'palito-caprese':
      return { vb: '0 0 120 48', node: <PalitoCaprese u={u} /> };
    case 'mini-folhado-parma-figo':
      return { vb: '0 0 205 94', node: <Folhado u={u} kind="fig" /> };
    case 'mini-folhado-carne-seca':
      return { vb: '0 0 205 94', node: <Folhado u={u} kind="carne" /> };
    case 'tortinha-folhada-bacon':
      return { vb: '0 0 205 94', node: <Folhado u={u} kind="bacon" /> };
    case 'tabua-6':
      return { vb: '0 0 190 82', node: <TabuaArt u={u} wide={182} /> };
    case 'tabua-12':
      return { vb: '0 0 235 90', node: <TabuaArt u={u} wide={227} /> };
    case 'tabua-20':
      return { vb: '0 0 260 95', node: <TabuaArt u={u} wide={252} /> };
    default:
      return {
        vb: '0 0 120 60',
        node: (
          <g filter={`url(#${u}-sh)`}>
            <Board u={u} x={6} y={14} w={108} h={40} />
            <Leaf x={60} y={32} len={8} fill="#3a7840" />
          </g>
        ),
      };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function MesaArt({ id }: { id: string }) {
  const uid = useId().replace(/:/g, 'x');
  const { vb, node } = artOf(id, uid);
  return (
    <svg viewBox={vb} className="mesa-art" aria-hidden="true">
      <Defs u={uid} />
      {node}
    </svg>
  );
}
