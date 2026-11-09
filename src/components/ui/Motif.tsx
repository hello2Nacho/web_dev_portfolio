// Inline single adire motif (server-renderable), animatable with <DrawOn>.
import { motifPaths, type MotifFamily } from "@/lib/adire/index.ts";
export default function Motif({ family, seed, size = 100, strokeWidth = 4, className = "" }: { family: MotifFamily; seed?: string; size?: number; strokeWidth?: number; className?: string }) {
  const paths = motifPaths(family, seed ?? family, size, strokeWidth);
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths.map((p, i) => <path key={i} d={p.d} strokeWidth={p.w} />)}
    </svg>
  );
}
