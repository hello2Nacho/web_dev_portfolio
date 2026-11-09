// node scripts/pattern-sheet.ts → preview/pattern-sheet.html
import { writeFileSync, existsSync } from "node:fs";
import { generatePattern, generateBand, motifSvg, MOTIF_FAMILIES, PALETTES, type PatternOptions } from "../src/lib/adire/index.ts";

const specs: (PatternOptions & { label: string })[] = [
  { label: "lagos-01 · all motifs", seed: "lagos-01" },
  { label: "HN · spirals, dots, leaves (3D engraving)", seed: "HN", motifs: ["spirals", "dots", "leaves", "dotRings"] },
  { label: "halcyon", seed: "halcyon", density: 0.5 },
  { label: "noto", seed: "noto", motifs: ["leaves", "birds", "dots", "waves", "concentric"] },
  { label: "helio · dense", seed: "helio", density: 0.85 },
  { label: "atelier-eko", seed: "atelier-eko", motifs: ["cowrie", "stripes", "triangles", "dotRings"] },
  { label: "aquaro", seed: "aquaro", motifs: ["waves", "concentric", "spirals", "dots"] },
  { label: "aunty-alice", seed: "aunty-alice", palette: PALETTES.night },
  { label: "mcroyal", seed: "mcroyal", motifs: ["birds", "crosshatch", "spirals", "cowrie"] },
  { label: "404 · wide blocks", seed: "404", cols: 6, rows: 6, unit: 85, density: 0.4 },
  { label: "loader · inverse (cotton)", seed: "loader", palette: PALETTES.cotton, motifs: ["spirals", "concentric", "dots", "cowrie"] },
  { label: "og-base · 2:1", seed: "og", cols: 12, rows: 6, unit: 43 },
];

const t0 = performance.now();
const tiles = specs.map(({ label, ...o }) => ({ label, p: generatePattern(o) }));
const ms = (performance.now() - t0).toFixed(0);
const ref = existsSync("assets/adire-photos/reference-1.jpeg");
const band = generateBand("divider");

const html = `<!doctype html><meta charset="utf-8"><title>Adire pattern sheet</title>
<style>
body{margin:0;background:#0B1938;color:#EAE7DA;font:13px/1.4 Inter,system-ui,sans-serif;padding:32px}
h1{font-size:20px;margin:0 0 4px} p{color:#8A97AE;margin:0 0 20px}
.g{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
figure{margin:0} figure img,figure .ref{width:100%;aspect-ratio:1;object-fit:cover;border-radius:18px;display:block;border:1px solid rgba(234,231,218,.08)}
figcaption{margin-top:8px;color:#8A97AE;font-size:11px;letter-spacing:.12em;text-transform:uppercase}
.row{display:flex;gap:20px;margin:28px 0;align-items:flex-start}.row>figure{width:calc(25% - 15px)}
.band img{width:100%;border-radius:8px}
.motifs{display:grid;grid-template-columns:repeat(11,1fr);gap:12px;color:#EAE7DA}
.motifs div{background:#152746;border-radius:14px;padding:10px;text-align:center;font-size:10px;color:#8A97AE}
.motifs svg{width:100%;height:auto}
</style>
<h1>ADIRE pattern engine — 12 seeds</h1>
<p>Generated in ${ms}ms · all motifs drawn in code · reference shown for colour comparison only (never displayed on the site).</p>
${ref ? `<div class="row"><figure><img class="ref" src="../assets/adire-photos/reference-1.jpeg"><figcaption>Reference (colour calibration only)</figcaption></figure></div>` : ""}
<div class="g">${tiles.map(({ label, p }) => `<figure><img src="${p.dataUrl}"><figcaption>${label}</figcaption></figure>`).join("")}</div>
<h1 style="margin-top:32px">Divider band</h1><div class="band"><img src="${band.dataUrl}"></div>
<h1 style="margin-top:32px">Motif families (animatable paths)</h1>
<div class="motifs">${MOTIF_FAMILIES.map((m) => `<div>${motifSvg(m, { color: "#EAE7DA", size: 100 })}${m}</div>`).join("")}</div>`;

writeFileSync("preview/pattern-sheet.html", html);
console.log(`ok · ${tiles.length} patterns in ${ms}ms · sizes ${tiles.map((t) => (t.p.svg.length / 1024).toFixed(0) + "KB").join(" ")}`);
