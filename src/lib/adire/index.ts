// ADIRE pattern engine: seeded, deterministic, original adire-eleko-inspired cloth.
import { createRng, hashString } from "./prng.ts";
import { dot, line, type Stroke } from "./draw.ts";
import { MOTIFS, MOTIF_FAMILIES, cowrie, type MotifFamily, type Rect } from "./motifs.ts";

export { MOTIF_FAMILIES, cowrie, type MotifFamily, type Stroke };

export type Palette = { ground: string; ink: string; fade: string; deep?: string };
export const PALETTES = {
  indigo: { ground: "#152746", deep: "#0B1938", ink: "#EAE7DA", fade: "#435368" },
  night: { ground: "#0B1938", deep: "#081128", ink: "#EAE7DA", fade: "#435368" },
  /** inverse (loader): starch-white cloth, indigo drawing */
  cotton: { ground: "#EAE7DA", deep: "#DCD6C4", ink: "#152746", fade: "#B9BDC2" },
} satisfies Record<string, Palette>;

export type PatternOptions = {
  seed: string | number;
  cols?: number;          // grid units across
  rows?: number;          // grid units down
  unit?: number;          // px per unit (default 64)
  density?: number;       // 0..1, smaller motifs + tighter spacing when higher
  motifs?: MotifFamily[];
  palette?: Palette;
  strokeWidth?: number;   // base stroke (default 2.6, thick starch line)
  bleed?: number;         // 0..1 dye-bleed softness (default 0.6)
  fades?: boolean;        // faded lighter-indigo patches (default true)
  border?: boolean;       // outer cloth hem (default true)
};

export type Block = Rect & { motif: MotifFamily; strokes: Stroke[] };
export type Pattern = {
  id: string; width: number; height: number;
  blocks: Block[]; frame: Stroke[];
  svg: string; dataUrl: string;
};

const cache = new Map<string, Pattern>();

/** Guillotine-split the grid into varied blocks, like a hand-planned eleko layout. */
function layout(R: ReturnType<typeof createRng>, cols: number, rows: number) {
  const out: { x: number; y: number; w: number; h: number }[] = [];
  const split = (x: number, y: number, w: number, h: number, depth: number) => {
    const area = w * h;
    const stop = area <= 1 || (area <= 9 && R.chance(depth < 1 ? 0.05 : 0.38)) || (w <= 2 && h <= 2 && R.chance(0.6));
    if (stop) return out.push({ x, y, w, h });
    const vert = w > h ? R.chance(0.78) : h > w ? R.chance(0.22) : R.chance(0.5);
    if (vert && w > 1) {
      const c = R.int(1, w - 1);
      split(x, y, c, h, depth + 1); split(x + c, y, w - c, h, depth + 1);
    } else if (h > 1) {
      const c = R.int(1, h - 1);
      split(x, y, w, c, depth + 1); split(x, y + c, w, h - c, depth + 1);
    } else out.push({ x, y, w, h });
  };
  split(0, 0, cols, rows, 0);
  return out;
}

export function generatePattern(opts: PatternOptions): Pattern {
  const o = {
    cols: 8, rows: 8, unit: 64, density: 0.6, motifs: MOTIF_FAMILIES, palette: PALETTES.indigo,
    strokeWidth: 3.8, bleed: 0.6, fades: true, border: true, ...opts,
  };
  const key = JSON.stringify(o);
  const hit = cache.get(key);
  if (hit) return hit;

  const R = createRng(o.seed);
  const id = "adr" + hashString(key).toString(36);
  const { unit: U, palette: P } = o;
  const width = o.cols * U, height = o.rows * U;
  const sw = o.strokeWidth;
  const cell = U * (1.7 - o.density * 0.7);
  const inset = U * 0.09;

  // 1. blocks + motif assignment (no two consecutive blocks share a family)
  let last: MotifFamily | null = null;
  const blocks: Block[] = layout(R, o.cols, o.rows).map((g) => {
    const r: Rect = { x: g.x * U + inset, y: g.y * U + inset, w: g.w * U - inset * 2, h: g.h * U - inset * 2 };
    let fam = R.pick(o.motifs);
    for (let t = 0; t < 4 && fam === last && o.motifs.length > 1; t++) fam = R.pick(o.motifs);
    last = fam;
    const pad = Math.min(r.w, r.h) * 0.04;
    const inner = { x: r.x + pad, y: r.y + pad, w: r.w - pad * 2, h: r.h - pad * 2 };
    return { ...r, motif: fam, strokes: MOTIFS[fam](R, inner, cell, sw) };
  });

  // 2. frame: block borders (single or double) and dotted dividing lines
  const frame: Stroke[] = [];
  for (const b of blocks) {
    const c: [number, number][] = [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.h], [b.x, b.y + b.h]];
    for (let i = 0; i < 4; i++) {
      if (R.chance(0.04)) continue; // tiny gap: the starch skipped
      frame.push({ d: line(R, c[i], c[(i + 1) % 4], 0.9), w: sw * R.range(0.9, 1.25) });
    }
    if (R.chance(0.35)) {
      const k = inset * 0.9, gap = sw * 3.2;
      for (let x = b.x + k; x <= b.x + b.w - k; x += gap) frame.push({ d: dot(R, x, b.y - k), w: sw * 1.1 });
    }
  }
  if (o.border) {
    const m = inset * 0.35;
    const c: [number, number][] = [[m, m], [width - m, m], [width - m, height - m], [m, height - m]];
    for (let i = 0; i < 4; i++) frame.push({ d: line(R, c[i], c[(i + 1) % 4], 1.2), w: sw * 1.5 });
  }

  // 3. faded patches (lighter indigo, uneven dye uptake)
  const fades = o.fades
    ? Array.from({ length: R.int(2, 4) }, () => ({
        cx: R.range(0, width), cy: R.range(0, height),
        rx: R.range(U * 1.2, U * 3.2), ry: R.range(U * 1, U * 2.6), op: R.range(0.25, 0.5),
      }))
    : [];

  const strokeEl = (s: Stroke) =>
    `<path d="${s.d}" stroke-width="${s.w.toFixed(2)}"/>`;
  const bleedScale = (1.2 + o.bleed * 2.6).toFixed(2);
  const blur = (0.25 + o.bleed * 0.55).toFixed(2);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
<defs>
<filter id="${id}b" x="-2%" y="-2%" width="104%" height="104%">
<feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="${hashString(String(o.seed)) % 997}" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="${bleedScale}" xChannelSelector="R" yChannelSelector="G" result="d"/>
<feGaussianBlur in="d" stdDeviation="${blur}" result="s"/>
<feMerge><feMergeNode in="s"/><feMergeNode in="d"/></feMerge>
</filter>
<filter id="${id}g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.09 0"/></filter>
<radialGradient id="${id}v" cx="50%" cy="50%" r="70%"><stop offset="60%" stop-color="${P.deep ?? P.ground}" stop-opacity="0"/><stop offset="100%" stop-color="${P.deep ?? P.ground}" stop-opacity="0.7"/></radialGradient>
${fades.map((f, i) => `<radialGradient id="${id}f${i}"><stop offset="0" stop-color="${P.fade}" stop-opacity="${f.op.toFixed(2)}"/><stop offset="1" stop-color="${P.fade}" stop-opacity="0"/></radialGradient>`).join("")}
${blocks.map((b, i) => `<clipPath id="${id}c${i}"><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}"/></clipPath>`).join("")}
</defs>
<rect width="100%" height="100%" fill="${P.ground}"/>
<g filter="url(#${id}b)" fill="none" stroke="${P.ink}" stroke-linecap="round" stroke-linejoin="round">
${blocks.map((b, i) => `<g clip-path="url(#${id}c${i})" data-motif="${b.motif}">${b.strokes.map(strokeEl).join("")}</g>`).join("\n")}
<g data-frame="1">${frame.map(strokeEl).join("")}</g>
</g>
${fades.map((f, i) => `<ellipse cx="${f.cx.toFixed(0)}" cy="${f.cy.toFixed(0)}" rx="${f.rx.toFixed(0)}" ry="${f.ry.toFixed(0)}" fill="url(#${id}f${i})"/>`).join("")}
<rect width="100%" height="100%" fill="url(#${id}v)"/>
<rect width="100%" height="100%" filter="url(#${id}g)"/>
</svg>`;

  const dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  const pattern: Pattern = { id, width, height, blocks, frame, svg, dataUrl };
  cache.set(key, pattern);
  return pattern;
}

/** Browser only: rasterise a pattern to a canvas (for textures, OG images, WebGL). */
export async function patternToCanvas(p: Pattern, scale = 1): Promise<HTMLCanvasElement> {
  const img = new Image();
  img.src = p.dataUrl;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = p.width * scale; c.height = p.height * scale;
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  return c;
}

/**
 * A single motif as plain, animatable SVG paths in a `size`×`size` box.
 * Use with stroke-dasharray / stroke-dashoffset (pathLength="1") for draw-on.
 */
export function motifPaths(family: MotifFamily, seed: string | number = family, size = 100, strokeWidth = 2.6): Stroke[] {
  const R = createRng(`${seed}:${family}`);
  return MOTIFS[family](R, { x: 0, y: 0, w: size, h: size }, size, strokeWidth);
}

export function motifSvg(family: MotifFamily, opts: { seed?: string; size?: number; color?: string; strokeWidth?: number } = {}): string {
  const size = opts.size ?? 100;
  const paths = motifPaths(family, opts.seed, size, opts.strokeWidth);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="none" stroke="${opts.color ?? "currentColor"}" stroke-linecap="round" stroke-linejoin="round">${paths
    .map((s) => `<path pathLength="1" d="${s.d}" stroke-width="${s.w.toFixed(2)}"/>`).join("")}</svg>`;
}

/** Thin horizontal band (section dividers, marquee, footer loom). */
export const generateBand = (seed: string | number, cols = 16, palette: Palette = PALETTES.indigo) =>
  generatePattern({ seed, cols, rows: 1, unit: 56, density: 0.7, fades: false, palette });
