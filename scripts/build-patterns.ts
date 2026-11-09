// Pre-renders static adire SVGs into public/patterns (cached by the browser).
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";
import { generatePattern, generateBand, PALETTES } from "../src/lib/adire/index.ts";

const slugs = ["halcyon", "noto", "helio", "operon", "atelier-eko", "aquaro", "aunty-alice", "mcroyal"];
mkdirSync("public/patterns", { recursive: true });
const jobs: Promise<unknown>[] = [];
// SVG kept for reference/vector use; WebP is what the site loads (filters pre-baked, no runtime raster cost).
const w = (name: string, svg: string) => {
  writeFileSync(`public/patterns/${name}.svg`, svg);
  const big = name === "hero-starch" || name === "cloth-wide";
  jobs.push(sharp(Buffer.from(svg), { density: big ? 80 : 144 }).webp({ quality: big ? 55 : 72 }).toFile(`public/patterns/${name}.webp`));
};

for (const s of slugs) {
  w(`${s}`, generatePattern({ seed: s, cols: 8, rows: 5, unit: 64, density: 0.6 }).svg);
  w(`${s}-band`, generateBand(s, 18).svg);
}
w("band-divider", generateBand("divider", 24).svg);
w("band-footer", generateBand("footer-loom", 24).svg);
w("band-menu", generateBand("menu", 12).svg);
w("hero-starch", generatePattern({ seed: "starch", cols: 16, rows: 9, unit: 80, density: 0.55, palette: PALETTES.cotton, fades: false, border: false }).svg);
// About page portrait: frame pattern (same treatment as the project tiles) + a faint field behind the card
w("victor", generatePattern({ seed: "victor", cols: 6, rows: 8, unit: 64, density: 0.6 }).svg);
w("victor-field", generatePattern({ seed: "victor-field", cols: 10, rows: 10, unit: 72, density: 0.55, fades: false, border: false,
  palette: { ground: "#0B1938", deep: "#0B1938", ink: "#435368", fade: "#0B1938" } }).svg
  .replace(/<rect width="100%" height="100%" filter="url\(#[^)]+g\)"\/>/, "")       // no grain on a transparent field
  .replace(/<rect width="100%" height="100%" fill="url\(#[^)]+v\)"\/>/, ""));       // no vignette
w("cloth-wide", generatePattern({ seed: "cloth-wide", cols: 16, rows: 6, unit: 64, density: 0.6 }).svg);
await Promise.all(jobs);
console.log("patterns written");
