// Original motif families, drawn in code. Inspired by the visual language of
// adire eleko (starch-painted resist), never traced from real cloths.
import type { Rng } from "./prng.ts";
import { circle, dot, ellipse, leaf, line, spiral, type Pt, type Stroke } from "./draw.ts";

export type Rect = { x: number; y: number; w: number; h: number };
export type MotifFamily =
  | "spirals" | "concentric" | "dots" | "dotRings" | "cowrie"
  | "leaves" | "birds" | "stripes" | "waves" | "triangles" | "crosshatch";

export const MOTIF_FAMILIES: MotifFamily[] = [
  "spirals", "concentric", "dots", "dotRings", "cowrie",
  "leaves", "birds", "stripes", "waves", "triangles", "crosshatch",
];

type MotifFn = (R: Rng, b: Rect, cell: number, sw: number) => Stroke[];

/** Tile a block into roughly-square cells; returns centres + actual cell size. */
function cells(b: Rect, target: number) {
  const cols = Math.max(1, Math.round(b.w / target));
  const rows = Math.max(1, Math.round(b.h / target));
  const cw = b.w / cols, ch = b.h / rows;
  const out: { cx: number; cy: number; s: number; i: number; j: number }[] = [];
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++)
      out.push({ cx: b.x + cw * (i + 0.5), cy: b.y + ch * (j + 0.5), s: Math.min(cw, ch), i, j });
  return out;
}

const W = (R: Rng, sw: number, k = 1) => sw * k * R.range(0.82, 1.18);

const spirals: MotifFn = (R, b, cell, sw) => {
  const out: Stroke[] = [];
  const paired = R.chance(0.5);
  for (const c of cells(b, cell * 1.1)) {
    const rM = c.s * 0.2, off = c.s * 0.22;
    if (paired) {
      // two spirals sharing a centre line, joined into an S
      const s1 = spiral(R, c.cx - off, c.cy, rM, 2.3, -Math.PI / 2, 1);
      const p2 = spiral(R, c.cx + off, c.cy, rM, 2.3, Math.PI / 2, 1);
      out.push({ d: s1.d, w: W(R, sw) }, { d: p2.d, w: W(R, sw) }, { d: line(R, s1.end, p2.end, 0.6), w: W(R, sw) });
    } else {
      const s = spiral(R, c.cx, c.cy, c.s * 0.34, 2.8, R.range(0, 6.28), R.chance(0.5) ? 1 : -1);
      out.push({ d: s.d, w: W(R, sw) });
      if (R.chance(0.6)) out.push({ d: dot(R, c.cx + c.s * 0.4, c.cy + c.s * 0.4), w: sw * 1.8 });
    }
  }
  return out;
};

const concentric: MotifFn = (R, b, cell, sw) => {
  const out: Stroke[] = [];
  for (const c of cells(b, cell)) {
    const n = R.int(2, 4);
    for (let k = 1; k <= n; k++)
      out.push({ d: circle(R, c.cx, c.cy, (c.s * 0.42 * k) / n, 0.08, R.chance(0.15) ? 0.06 : 0), w: W(R, sw) });
    out.push({ d: dot(R, c.cx, c.cy), w: sw * 2.2 });
  }
  return out;
};

const dots: MotifFn = (R, b, cell, sw) => {
  const out: Stroke[] = [];
  const gap = cell * R.range(0.22, 0.32);
  const stagger = R.chance(0.6);
  let row = 0;
  for (let y = b.y + gap / 2; y < b.y + b.h; y += gap, row++) {
    const ox = stagger && row % 2 ? gap / 2 : 0;
    for (let x = b.x + gap / 2 + ox; x < b.x + b.w; x += gap)
      if (!R.chance(0.04)) out.push({ d: dot(R, x, y), w: W(R, sw, 1.9) });
  }
  return out;
};

const dotRings: MotifFn = (R, b, cell, sw) => {
  const out: Stroke[] = [];
  for (const c of cells(b, cell)) {
    for (const [rf, n] of [[0.4, 14], [0.24, 8]] as const) {
      const r = c.s * rf;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2;
        out.push({ d: dot(R, c.cx + Math.cos(a) * r, c.cy + Math.sin(a) * r), w: W(R, sw, 1.5) });
      }
    }
    out.push({ d: circle(R, c.cx, c.cy, c.s * 0.08, 0.1), w: W(R, sw) });
  }
  return out;
};

/** Cowrie shell: oval body, wavy aperture slit, little teeth. Exported for the cursor badge. */
export function cowrie(R: Rng, cx: number, cy: number, s: number, sw: number, rot = 0): Stroke[] {
  const rx = s * 0.26, ry = s * 0.4;
  const cr = Math.cos(rot), sr = Math.sin(rot);
  const T = (x: number, y: number): Pt => [cx + x * cr - y * sr, cy + x * sr + y * cr];
  const out: Stroke[] = [{ d: ellipse(R, cx, cy, rx, ry, 0.05, 0, rot), w: W(R, sw) }];
  const slit: Pt[] = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10, y = -ry * 0.78 + t * ry * 1.56;
    slit.push(T(Math.sin(t * Math.PI * 2) * rx * 0.08, y));
  }
  out.push({ d: `M${slit.map((p) => p.map((n) => n.toFixed(1)).join(" ")).join("L")}`, w: W(R, sw, 0.9) });
  for (let i = 1; i < 7; i++) {
    const y = -ry * 0.7 + (i / 7) * ry * 1.4;
    out.push({ d: line(R, T(-rx * 0.28, y), T(-rx * 0.08, y), 0.2), w: sw * 0.7 });
    out.push({ d: line(R, T(rx * 0.08, y), T(rx * 0.28, y), 0.2), w: sw * 0.7 });
  }
  return out;
}

const cowries: MotifFn = (R, b, cell, sw) =>
  cells(b, cell).flatMap((c) => cowrie(R, c.cx, c.cy, c.s, sw, (c.i + c.j) % 2 ? Math.PI / 2 : 0));

const leaves: MotifFn = (R, b, cell, sw) => {
  const out: Stroke[] = [];
  const fern = R.chance(0.45);
  for (const c of cells(b, cell * 1.2)) {
    const top: Pt = [c.cx, c.cy - c.s * 0.44], bot: Pt = [c.cx, c.cy + c.s * 0.44];
    out.push({ d: line(R, bot, top, 0.6), w: W(R, sw) });
    const n = fern ? 6 : 3;
    for (let k = 0; k < n; k++) {
      const t = 0.15 + (k / n) * 0.75, y = bot[1] + (top[1] - bot[1]) * t;
      const len = c.s * (fern ? 0.3 : 0.34) * (1 - t * 0.45);
      for (const side of [-1, 1]) {
        const a: Pt = [c.cx, y], e: Pt = [c.cx + side * len, y - len * 0.6];
        out.push(fern ? { d: line(R, a, e, 0.3), w: W(R, sw, 0.85) } : { d: leaf(R, a, e, len * 0.5), w: W(R, sw) });
      }
    }
  }
  return out;
};

/** Original stylised bird: teardrop body, round head, short beak, wing arc, fan tail. */
const birds: MotifFn = (R, b, cell, sw) => {
  const out: Stroke[] = [];
  for (const c of cells(b, cell * 1.25)) {
    const s = c.s, flip = (c.i + c.j) % 2 ? -1 : 1;
    const X = (x: number) => c.cx + flip * x * s, Y = (y: number) => c.cy + y * s;
    const body: Pt[] = [];
    for (let i = 0; i <= 16; i++) {
      const t = (i / 16) * Math.PI * 2;
      body.push([X(Math.cos(t) * 0.24 - 0.02), Y(Math.sin(t) * 0.12 * (1 + 0.35 * Math.cos(t)) + 0.04)]);
    }
    out.push({ d: `M${body.map((p) => p.map((n) => n.toFixed(1)).join(" ")).join("L")}Z`, w: W(R, sw) });
    out.push({ d: circle(R, X(0.26), Y(-0.1), s * 0.07, 0.05), w: W(R, sw) });
    out.push({ d: line(R, [X(0.33), Y(-0.1)], [X(0.42), Y(-0.07)], 0.2), w: W(R, sw) });
    out.push({ d: dot(R, X(0.27), Y(-0.11)), w: sw * 1.4 });
    out.push({ d: line(R, [X(-0.1), Y(0.0)], [X(0.12), Y(-0.04)], 0.8), w: W(R, sw, 0.9) });
    for (const a of [-0.12, 0, 0.12]) out.push({ d: line(R, [X(-0.24), Y(0.06)], [X(-0.4), Y(0.06 + a)], 0.3), w: W(R, sw, 0.9) });
    out.push({ d: line(R, [X(0.0), Y(0.18)], [X(-0.02), Y(0.3)], 0.2), w: sw * 0.8 });
    out.push({ d: line(R, [X(0.08), Y(0.18)], [X(0.08), Y(0.3)], 0.2), w: sw * 0.8 });
  }
  return out;
};

const stripes: MotifFn = (R, b, cell, sw) => {
  const out: Stroke[] = [];
  const vertical = R.chance(0.4);
  const gap = cell * R.range(0.18, 0.26);
  const len = vertical ? b.h : b.w, span = vertical ? b.w : b.h;
  for (let o = gap / 2; o < span; o += gap) {
    const a: Pt = vertical ? [b.x + o, b.y - 4] : [b.x - 4, b.y + o];
    const e: Pt = vertical ? [b.x + o, b.y + len + 4] : [b.x + len + 4, b.y + o];
    out.push({ d: line(R, a, e, 1), w: W(R, sw, 1.1) });
  }
  return out;
};

const waves: MotifFn = (R, b, cell, sw) => {
  const out: Stroke[] = [];
  const gap = cell * R.range(0.2, 0.3), amp = gap * R.range(0.25, 0.4), wl = cell * R.range(0.35, 0.6);
  const zig = R.chance(0.3);
  for (let y = b.y + gap / 2; y < b.y + b.h; y += gap) {
    const pts: Pt[] = [];
    const step = zig ? wl / 2 : 4;
    for (let x = b.x - 6, k = 0; x <= b.x + b.w + 6; x += step, k++)
      pts.push([x, y + (zig ? (k % 2 ? amp : -amp) : Math.sin(((x - b.x) / wl) * Math.PI * 2) * amp)]);
    out.push({ d: `M${pts.map(([x, yy]) => `${(x + R.range(-.3, .3)).toFixed(1)} ${(yy + R.range(-.4, .4)).toFixed(1)}`).join("L")}`, w: W(R, sw) });
  }
  return out;
};

const triangles: MotifFn = (R, b, cell, sw) => {
  const out: Stroke[] = [];
  const s = cell * R.range(0.32, 0.45);
  let row = 0;
  for (let y = b.y; y < b.y + b.h; y += s * 0.9, row++) {
    for (let x = b.x + (row % 2 ? s / 2 : 0); x < b.x + b.w; x += s) {
      const p: Pt[] = [[x, y + s * 0.8], [x + s * 0.45, y + s * 0.05], [x + s * 0.9, y + s * 0.8]];
      out.push({ d: line(R, p[0], p[1], 0.3) + line(R, p[1], p[2], 0.3).replace("M", "L") + "Z", w: W(R, sw, 0.9) });
      if (R.chance(0.5)) out.push({ d: dot(R, x + s * 0.45, y + s * 0.55), w: sw * 1.5 });
    }
  }
  return out;
};

const crosshatch: MotifFn = (R, b, cell, sw) => {
  const out: Stroke[] = [];
  const gap = cell * R.range(0.2, 0.28), L = b.w + b.h;
  for (const dir of [1, -1])
    for (let o = -L; o < L; o += gap) {
      const a: Pt = [b.x + o, dir > 0 ? b.y : b.y + b.h];
      const e: Pt = [b.x + o + L, dir > 0 ? b.y + L : b.y + b.h - L];
      out.push({ d: line(R, a, e, 1.2), w: W(R, sw, 0.8) });
    }
  return out;
};

export const MOTIFS: Record<MotifFamily, MotifFn> = {
  spirals, concentric, dots, dotRings, cowrie: cowries, leaves, birds, stripes, waves, triangles, crosshatch,
};
