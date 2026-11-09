// AVIF/WebP responsive image from scripts/media.mjs outputs: `${base}-${w}.{avif,webp}`.
type Props = { base: string; widths?: number[]; alt: string; sizes?: string; className?: string; priority?: boolean; width?: number; height?: number };
export default function Picture({ base, widths = [640, 1024, 1600], alt, sizes = "100vw", className = "", priority = false, width = 1600, height = 900 }: Props) {
  const set = (ext: string) => widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(", ");
  return (
    <picture>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${base}-${widths[Math.min(1, widths.length - 1)]}.webp`} alt={alt} width={width} height={height} sizes={sizes}
        loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" className={className} />
    </picture>
  );
}
