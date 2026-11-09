// Procedural wood grain + adire engraving maps for the HN mark (browser only).
import { generatePattern } from "@/lib/adire/index.ts";

// small value-noise + fbm
function makeNoise(seed = 1) {
  const p = new Uint8Array(512);
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const perm = Array.from({ length: 256 }, (_, i) => i).sort(() => rnd() - 0.5);
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
  const fade = (t: number) => t * t * (3 - 2 * t);
  const n2 = (x: number, y: number) => {
    const xi = Math.floor(x) & 255, yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x), yf = y - Math.floor(y);
    const v = (a: number, b: number) => p[p[a] + b] / 255;
    const u = fade(xf), w = fade(yf);
    const a = v(xi, yi) + (v(xi + 1, yi) - v(xi, yi)) * u;
    const b = v(xi, yi + 1) + (v(xi + 1, yi + 1) - v(xi, yi + 1)) * u;
    return a + (b - a) * w;
  };
  return (x: number, y: number) => n2(x, y) * 0.5 + n2(x * 2.1, y * 2.1) * 0.3 + n2(x * 4.3, y * 4.3) * 0.2;
}

/** Returns { color, rough } canvases: stretched noise bands = hand-oiled wood grain. */
export function woodCanvases(size = 1024) {
  const noise = makeNoise(7);
  const color = document.createElement("canvas");
  const rough = document.createElement("canvas");
  color.width = color.height = rough.width = rough.height = size;
  const cc = color.getContext("2d")!, rc = rough.getContext("2d")!;
  const ci = cc.createImageData(size, size), ri = rc.createImageData(size, size);
  // base #2A1A12 → light #4A2F20 / dark #170D08
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const warp = noise(x * 0.004, y * 0.03) * 9;
      const band = 0.5 + 0.5 * Math.sin(x * 0.045 + warp * 2.2);
      const fine = noise(x * 0.25, y * 0.012);
      const t = Math.min(1, Math.max(0, band * 0.6 + fine * 0.5 - 0.1));
      const i = (y * size + x) * 4;
      ci.data[i] = 48 + t * 70; ci.data[i + 1] = 28 + t * 46; ci.data[i + 2] = 17 + t * 30; ci.data[i + 3] = 255;
      const r = 135 + (1 - t) * 50 + fine * 30; // grain lines a touch rougher
      ri.data[i] = ri.data[i + 1] = ri.data[i + 2] = r; ri.data[i + 3] = 255;
    }
  cc.putImageData(ci, 0, 0); rc.putImageData(ri, 0, 0);
  return { color, rough };
}

/** Adire engraving: white lines on black (bump), from the pattern engine, seed "HN". */
export async function engravingCanvas(size = 1024) {
  const p = generatePattern({
    seed: "HN", cols: 6, rows: 6, unit: 64, density: 0.55, motifs: ["spirals", "dots", "leaves", "dotRings"],
    palette: { ground: "#000000", deep: "#000000", ink: "#ffffff", fade: "#000000" },
    strokeWidth: 3.8, bleed: 0.3, fades: false, border: false,
  });
  // strip the grain overlay rect (last filter rect) so the bump stays clean
  const svg = p.svg.replace(/<rect width="100%" height="100%" filter="url\(#[^)]+g\)"\/>/, "");
  const img = new Image();
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  await img.decode();
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.filter = "blur(0.6px)"; // soft carved shoulders
  ctx.drawImage(img, 0, 0, size, size);
  return c;
}

/** Front-face colour = wood darkened ~18% inside the carved lines. */
export function carvedColor(wood: HTMLCanvasElement, engr: HTMLCanvasElement) {
  const c = document.createElement("canvas");
  c.width = wood.width; c.height = wood.height;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(wood, 0, 0);
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.9;
  ctx.filter = "invert(1)";
  ctx.drawImage(engr, 0, 0, c.width, c.height);
  return c;
}
