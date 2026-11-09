"use client";
// First-visit loader (≤1.5s): an adire pattern is "drawn in starch" on a cotton square.
import { useEffect, useMemo, useState } from "react";
import { generatePattern, PALETTES } from "@/lib/adire/index.ts";
import { prefersReducedMotion, isTouch, isLowPower, weakGPU } from "@/lib/perf.ts";

const KEY = "hn:visited";

export default function Loader() {
  const [state, setState] = useState<"pending" | "show" | "leave" | "done">("pending");
  const pattern = useMemo(() => generatePattern({ seed: "loader", cols: 4, rows: 4, unit: 50, density: 0.5, palette: PALETTES.cotton, motifs: ["spirals", "concentric", "dots", "cowrie"], fades: false, strokeWidth: 3.4 }), []);
  const strokes = useMemo(() => [...pattern.frame, ...pattern.blocks.flatMap((b) => b.strokes)], [pattern]);

  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem(KEY) === "1"; localStorage.setItem(KEY, "1"); } catch {}
    if (seen || prefersReducedMotion() || isTouch() || isLowPower() || weakGPU()) { setState("done"); ((window as unknown as { __loaderDone: boolean }).__loaderDone = true, window.dispatchEvent(new Event("loader:done"))); return; }
    setState("show");
    const t1 = setTimeout(() => setState("leave"), 1150);
    const t2 = setTimeout(() => { setState("done"); ((window as unknown as { __loaderDone: boolean }).__loaderDone = true, window.dispatchEvent(new Event("loader:done"))); }, 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (state === "done") return null;
  return (
    <div className={`fixed inset-0 z-[100] grid place-items-center bg-ink transition-opacity duration-300 ${state === "show" ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-live="polite">
      <div className="flex flex-col items-center gap-6">
        <svg viewBox={`0 0 ${pattern.width} ${pattern.height}`} className={`h-[180px] w-[180px] rounded-[14px] bg-cotton transition-transform duration-300 ease-dye ${state === "leave" ? "scale-[1.08]" : ""}`} fill="none" stroke="#152746" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {strokes.map((s, i) => (
            <path key={i} d={s.d} strokeWidth={s.w} pathLength={1} className="loader-stroke" style={{ animationDelay: `${Math.min(i * 3, 750)}ms` }} />
          ))}
        </svg>
        <p className="label text-cotton/80">Dyeing your experience…</p>
      </div>
    </div>
  );
}
