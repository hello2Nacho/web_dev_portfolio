// Hand-drawn primitives. Every primitive returns an SVG path `d` string,
// so any motif can be animated with stroke-dashoffset (draw-on).
import type { Rng } from "./prng.ts";

export type Pt = [number, number];
export type Stroke = { d: string; w: number; fill?: boolean };

const f = (n: number) => (Math.round(n * 10) / 10).toString();

/** Polyline through points with small hand jitter. */
export function path(R: Rng, pts: Pt[], jitter = 0.6, close = false): string {
  let d = "";
  pts.forEach(([x, y], i) => {
    const jx = x + R.range(-jitter, jitter);
    const jy = y + R.range(-jitter, jitter);
    d += `${i ? "L" : "M"}${f(jx)} ${f(jy)}`;
  });
  return close ? d + "Z" : d;
}

/** Straight line drawn as a slightly bowed, wobbly stroke. */
export function line(R: Rng, a: Pt, b: Pt, wobble = 0.8): string {
  const n = Math.max(3, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 10));
  const bow = R.range(-wobble, wobble) * 1.5;
  const nx = -(b[1] - a[1]), ny = b[0] - a[0];
  const len = Math.hypot(nx, ny) || 1;
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const s = Math.sin(t * Math.PI) * bow;
    pts.push([a[0] + (b[0] - a[0]) * t + (nx / len) * s, a[1] + (b[1] - a[1]) * t + (ny / len) * s]);
  }
  return path(R, pts, wobble * 0.5);
}

/** Wobbly ellipse; `gap` (0..1) leaves a small break like a starch skip. */
export function ellipse(R: Rng, cx: number, cy: number, rx: number, ry: number, wobble = 0.06, gap = 0, rot = 0): string {
  const n = Math.max(14, Math.round(Math.max(rx, ry) * 0.9));
  const ph = R.range(0, Math.PI * 2), k = R.int(2, 4);
  const start = R.range(0, Math.PI * 2);
  const span = Math.PI * 2 * (1 - gap);
  const cr = Math.cos(rot), sr = Math.sin(rot);
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = start + (span * i) / n;
    const m = 1 + wobble * Math.sin(k * t + ph) * 0.6 + R.range(-wobble, wobble) * 0.25;
    const x = Math.cos(t) * rx * m, y = Math.sin(t) * ry * m;
    pts.push([cx + x * cr - y * sr, cy + x * sr + y * cr]);
  }
  return path(R, pts, 0.25, gap === 0);
}

export const circle = (R: Rng, cx: number, cy: number, r: number, wobble = 0.06, gap = 0) =>
  ellipse(R, cx, cy, r, r, wobble, gap);

/** Archimedean spiral from centre outward. Returns path + its outer end point. */
export function spiral(R: Rng, cx: number, cy: number, rMax: number, turns: number, endAngle: number, dir = 1): { d: string; end: Pt } {
  const T = turns * Math.PI * 2;
  const n = Math.round(turns * 28);
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * T;
    const r = (rMax * t) / T * (1 + R.range(-0.03, 0.03));
    const a = endAngle - dir * (T - t);
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return { d: path(R, pts, 0.3), end: pts[pts.length - 1] };
}

/** A dot = zero-length stroke with round caps (still draw-on animatable). */
export const dot = (R: Rng, x: number, y: number) =>
  `M${f(x + R.range(-0.5, 0.5))} ${f(y + R.range(-0.5, 0.5))}l0.01 0`;

/** Pointed leaf shape along an axis. */
export function leaf(R: Rng, a: Pt, b: Pt, width: number): string {
  const n = 10, dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
  const left: Pt[] = [], right: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, w = Math.sin(Math.PI * Math.pow(t, 0.8)) * width * 0.5;
    const px = a[0] + dx * t, py = a[1] + dy * t;
    left.push([px + nx * w, py + ny * w]);
    right.unshift([px - nx * w, py - ny * w]);
  }
  return path(R, [...left, ...right], 0.3, true);
}
