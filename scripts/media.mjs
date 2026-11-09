// Copies videos and makes AVIF/WebP responsive images into public/media.
// node scripts/media.mjs
import sharp from "sharp";
import { mkdirSync, copyFileSync, existsSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const out = "public/media";
const jobs = [];
for (const slug of readdirSync("assets/projects").filter((d) => !d.startsWith("."))) {
  const src = join("assets/projects", slug), dst = join(out, "projects", slug);
  mkdirSync(dst, { recursive: true });
  copyFileSync(join(src, "showcase.mp4"), join(dst, "showcase.mp4"));
  if (existsSync(join(src, "showcase.webm"))) copyFileSync(join(src, "showcase.webm"), join(dst, "showcase.webm"));
  jobs.push([join(src, "poster.jpg"), join(dst, "poster"), [800, 1280], 60]);
  for (const s of ["still-1", "still-2"]) if (existsSync(join(src, s + ".jpg"))) jobs.push([join(src, s + ".jpg"), join(dst, s), [640, 1024, 1600, 2400], 62]);
  // extra section images (e.g. mobile-trio.jpg / .webp) are copied as-is, already web-sized
  for (const f of readdirSync(src).filter((f) => /^(mobile|section|extra)-[\w-]+\.(jpe?g|webp|avif)$/i.test(f))) copyFileSync(join(src, f), join(dst, f));
}
mkdirSync(join(out, "adire"), { recursive: true });
for (const f of readdirSync("assets/adire-photos").filter((f) => /^(flat|tile|detail|drape|panels|stack)-\d\.jpg$/.test(f)))
  jobs.push([join("assets/adire-photos", f), join(out, "adire", f.replace(".jpg", "")), [800, 1600], 45]);
for (const d of ["me", "adire-photos/real"]) if (existsSync(join("assets", d))) for (const f of readdirSync(join("assets", d)).filter((f) => /\.jpe?g$/i.test(f))) {
  mkdirSync(join(out, d), { recursive: true });
  jobs.push([join("assets", d, f), join(out, d, f.replace(/\.jpe?g$/i, "")), [800, 1600], 65]);
}

for (const [src, base, widths, q] of jobs)
  for (const w of widths) {
    const img = sharp(src).resize({ width: w, withoutEnlargement: true });
    await img.clone().webp({ quality: q }).toFile(`${base}-${w}.webp`);
    await img.clone().avif({ quality: q - 15 }).toFile(`${base}-${w}.avif`);
  }
const manifest = { webm: readdirSync("assets/projects").filter((d) => existsSync(join("assets/projects", d, "showcase.webm"))), me: existsSync("assets/me") ? readdirSync("assets/me").filter((f) => /\.jpe?g$/i.test(f)) : [] };
writeFileSync("src/content/media-manifest.json", JSON.stringify(manifest, null, 2));
console.log(`done: ${jobs.length} images`, manifest);
