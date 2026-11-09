// Irregular hand-stitched dashed border; draws in on parent hover (CSS in globals: .stitch-host).
export default function Stitch({ radius = 24, color = "var(--color-cotton)" }: { radius?: number; color?: string }) {
  return (
    <svg className="stitch pointer-events-none absolute inset-[6px] h-[calc(100%-12px)] w-[calc(100%-12px)] overflow-visible" aria-hidden preserveAspectRatio="none">
      <rect x="0" y="0" width="100%" height="100%" rx={radius - 6} fill="none" stroke={color} strokeWidth="1.4"
        strokeDasharray="7 5 9 4 6 6" strokeLinecap="round" pathLength={100} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
