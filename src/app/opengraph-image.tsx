import { ImageResponse } from "next/og";
import sharp from "sharp";
import { generatePattern } from "@/lib/adire/index.ts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "HiNacho: Every great site starts as plain cloth.";
export default async function OG() {
  const pat = await sharp(Buffer.from(generatePattern({ seed: "og", cols: 12, rows: 6, unit: 100 }).svg)).resize(1200, 630).jpeg({ quality: 70 }).toBuffer();
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0B1938" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`data:image/jpeg;base64,${pat.toString("base64")}`} width={1200} height={630} style={{ position: "absolute", inset: 0, opacity: 0.5 }} alt="" />
      <div style={{ margin: "auto", display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(11,25,56,.9)", padding: "48px 64px", borderRadius: 28, color: "#EAE7DA" }}>
        <div style={{ fontSize: 24, letterSpacing: 6, color: "#D2643C" }}>HINACHO · LAGOS</div>
        <div style={{ fontSize: 72, fontWeight: 800, marginTop: 16, textAlign: "center", lineHeight: 1 }}>Every great site starts as plain cloth.</div>
      </div>
    </div>, size);
}
