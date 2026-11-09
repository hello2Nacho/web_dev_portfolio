"use client";
// Custom cursor (desktop): a small cotton dot that becomes a cowrie "View" badge over [data-cursor=view].
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/motion.ts";
import { richMotion } from "@/lib/perf.ts";
import { cowrie } from "@/lib/adire/index.ts";
import { createRng } from "@/lib/adire/prng.ts";

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [view, setView] = useState(false);
  const shell = useMemo(() => cowrie(createRng("cursor"), 50, 50, 92, 3.2, Math.PI / 2), []);

  useEffect(() => {
    if (!richMotion()) return;
    setOn(true);
    document.documentElement.classList.add("has-cursor");
    const el = ref.current!;
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    const move = (e: PointerEvent) => { x(e.clientX); y(e.clientY); setView(!!(e.target as Element).closest?.("[data-cursor=view]")); };
    addEventListener("pointermove", move);
    return () => { removeEventListener("pointermove", move); document.documentElement.classList.remove("has-cursor"); };
  }, []);

  if (!on) return null;
  return (
    <div ref={ref} className="pointer-events-none fixed left-0 top-0 z-[95]" aria-hidden>
      <div className={`-translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-dye ${view ? "h-[92px] w-[92px]" : "h-2.5 w-2.5"}`}>
        <span className={`absolute inset-0 rounded-full bg-cotton transition-opacity duration-200 ${view ? "opacity-0" : "opacity-100"}`} />
        <svg viewBox="0 0 100 100" className={`absolute inset-0 h-full w-full transition-all duration-300 ease-dye ${view ? "scale-100 opacity-100" : "scale-50 opacity-0"}`} fill="none" stroke="#EAE7DA" strokeLinecap="round">
          <ellipse cx="50" cy="50" rx="46" ry="30" fill="#152746" stroke="none" opacity=".92" />
          {shell.map((s, i) => <path key={i} d={s.d} strokeWidth={s.w} opacity=".55" />)}
        </svg>
        <span className={`absolute inset-0 grid place-items-center text-[11px] font-semibold uppercase tracking-[0.16em] text-cotton transition-opacity duration-300 ${view ? "opacity-100" : "opacity-0"}`}>View</span>
      </div>
    </div>
  );
}
