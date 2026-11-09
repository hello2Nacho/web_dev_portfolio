// Convert the display font (WOFF) to three.js typeface JSON for drei <Text3D>.
// Usage: node scripts/make-typeface.mjs [path.woff] [out.json]
import opentype from "opentype.js";
import { readFileSync, writeFileSync } from "node:fs";
const src = process.argv[2] ?? "node_modules/@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff";
const out = process.argv[3] ?? "public/fonts/display-800.typeface.json";
const buf = readFileSync(src);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const r = (n) => Math.round(n);
const glyphs = {};
for (const ch of "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&.") {
  const g = font.charToGlyph(ch);
  let o = "";
  for (const c of g.getPath(0, 0, font.unitsPerEm).commands) {
    // getPath flips Y (screen space); flip back to font space
    if (c.type === "M") o += `m ${r(c.x)} ${r(-c.y)} `;
    else if (c.type === "L") o += `l ${r(c.x)} ${r(-c.y)} `;
    else if (c.type === "Q") o += `q ${r(c.x)} ${r(-c.y)} ${r(c.x1)} ${r(-c.y1)} `;
    else if (c.type === "C") o += `b ${r(c.x)} ${r(-c.y)} ${r(c.x1)} ${r(-c.y1)} ${r(c.x2)} ${r(-c.y2)} `;
  }
  const bb = g.getBoundingBox();
  glyphs[ch] = { ha: r(g.advanceWidth), x_min: r(bb.x1), x_max: r(bb.x2), o: o.trim() };
}
const json = {
  glyphs, familyName: font.names.fontFamily?.en ?? "Display", resolution: font.unitsPerEm,
  ascender: font.ascender, descender: font.descender,
  underlinePosition: font.tables.post.underlinePosition, underlineThickness: font.tables.post.underlineThickness,
  boundingBox: { xMin: font.tables.head.xMin, yMin: font.tables.head.yMin, xMax: font.tables.head.xMax, yMax: font.tables.head.yMax },
  original_font_information: { source: "Bricolage Grotesque (SIL OFL 1.1)" },
};
writeFileSync(out, JSON.stringify(json));
console.log(`${out}: ${Object.keys(glyphs).length} glyphs, ${(JSON.stringify(json).length / 1024).toFixed(1)}KB`);
