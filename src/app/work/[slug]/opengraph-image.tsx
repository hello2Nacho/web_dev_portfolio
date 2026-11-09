// Per-case-study OG image: project still + its generated adire pattern frame.
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getProject, projects } from "@/content/projects.ts";
import { generatePattern } from "@/lib/adire/index.ts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug)!;
  const still = await sharp(await readFile(join(process.cwd(), "assets/projects", p.slug, "still-1.jpg"))).resize(1000, 560, { fit: "cover" }).jpeg({ quality: 70 }).toBuffer();
  const pat = await sharp(Buffer.from(generatePattern({ seed: p.seed, cols: 12, rows: 6, unit: 100 }).svg)).resize(1200, 630).jpeg({ quality: 70 }).toBuffer();
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0B1938" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`data:image/jpeg;base64,${pat.toString("base64")}`} width={1200} height={630} style={{ position: "absolute", inset: 0, opacity: 0.55 }} alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`data:image/jpeg;base64,${still.toString("base64")}`} width={760} height={426} style={{ position: "absolute", right: 48, top: 102, borderRadius: 20 }} alt="" />
      <div style={{ position: "absolute", left: 56, bottom: 56, display: "flex", flexDirection: "column", color: "#EAE7DA", width: 420, background: "rgba(11,25,56,.85)", padding: 28, borderRadius: 20 }}>
        <div style={{ fontSize: 22, letterSpacing: 4, color: "#D2643C" }}>{`HINACHO · ${p.type.toUpperCase()}`}</div>
        <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1, marginTop: 12 }}>{p.name}</div>
      </div>
    </div>,
    size,
  );
}
