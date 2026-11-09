"use client";
// About page portrait as a "cloth tile": same framed treatment as the hero bento tiles
// (adire pattern ring, seed "victor"), a hand-drawn cotton border, an indigo grade that keeps
// the face natural, depth (shadow, top highlight, slow parallax, tiny cursor tilt) and a cowrie accent.
import { useEffect, useMemo, useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion.ts";
import { prefersReducedMotion, richMotion } from "@/lib/perf.ts";
import { createRng } from "@/lib/adire/prng.ts";
import Picture from "@/components/ui/Picture.tsx";
import Stitch from "@/components/ui/Stitch.tsx";
import Motif from "@/components/ui/Motif.tsx";

/** Irregular, slightly wobbly rounded-rect outline (hand-drawn), in a 100×125 box. */
function wobblyFrame(seed: string, w = 100, h = 125, r = 5.5) {
  const R = createRng(seed);
  const pts: [number, number][] = [];
  const edge = (x0: number, y0: number, x1: number, y1: number, n: number) => {
    for (let i = 0; i < n; i++) { const t = i / n; pts.push([x0 + (x1 - x0) * t + R.range(-0.35, 0.35), y0 + (y1 - y0) * t + R.range(-0.35, 0.35)]); }
  };
  const corner = (cx: number, cy: number, a0: number) => {
    for (let i = 0; i < 5; i++) { const a = a0 + (i / 5) * (Math.PI / 2); pts.push([cx + Math.cos(a) * r + R.range(-0.2, 0.2), cy + Math.sin(a) * r + R.range(-0.2, 0.2)]); }
  };
  edge(r, 0, w - r, 0, 14); corner(w - r, r, -Math.PI / 2);
  edge(w, r, w, h - r, 18); corner(w - r, h - r, 0);
  edge(w - r, h, r, h, 14); corner(r, h - r, Math.PI / 2);
  edge(0, h - r, 0, r, 18); corner(r, r, Math.PI);
  return "M" + pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join("L") + "Z";
}

export default function FramedPortrait({ base, alt }: { base: string; alt: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const frame = useMemo(() => wobblyFrame("victor"), []);

  // slow parallax: the card drifts a little slower than the text
  useGSAP(() => {
    if (prefersReducedMotion() || innerWidth < 768) return;
    gsap.fromTo(card.current, { yPercent: -4 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "bottom top", scrub: true } });
  }, { scope: wrap });

  // tiny tilt toward the cursor (desktop, max 4°)
  useEffect(() => {
    if (!richMotion()) return;
    const el = card.current!;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / innerWidth, ny = (e.clientY - (r.top + r.height / 2)) / innerHeight;
      ry(gsap.utils.clamp(-4, 4, nx * 8)); rx(gsap.utils.clamp(-4, 4, -ny * 8));
    };
    addEventListener("pointermove", move);
    return () => removeEventListener("pointermove", move);
  }, []);

  return (
    <div ref={wrap} className="relative [perspective:1200px]">
      {/* cloth field behind the card (desktop): faint adire, fading toward the text side */}
      <div className="about-field pointer-events-none absolute -inset-y-24 -left-[30%] -right-[40vw] -z-10 hidden bg-[url(/patterns/victor-field.webp)] bg-[length:720px] md:block" aria-hidden />

      <div ref={card} className="stitch-host group relative will-change-transform [transform-style:preserve-3d]">
        <div className="relative rounded-[28px] bg-indigo p-2 shadow-[0_50px_90px_-30px_rgba(4,10,26,0.95),0_20px_40px_-20px_rgba(4,10,26,0.8)] md:p-3">
          {/* adire pattern ring (seed "victor"), brightens on hover like the tiles */}
          <span className="absolute inset-0 rounded-[28px] bg-[url(/patterns/victor.webp)] bg-cover bg-center opacity-35 transition-opacity duration-700 ease-dye group-hover:opacity-90 max-md:opacity-25" aria-hidden />
          {/* 1px lighter highlight along the top edge */}
          <span className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cotton/35 to-transparent" aria-hidden />

          <div className="portrait-grade relative overflow-hidden rounded-[18px] md:rounded-[20px]">
            <Picture base={base} widths={[800, 1600]} alt={alt} sizes="(min-width: 768px) 40vw, 100vw" width={800} height={1000} priority
              className="aspect-[4/5] w-full object-cover [filter:saturate(.92)_contrast(1.04)]" />
            {/* indigo grade: multiply + colour layers, masked so the face stays natural */}
            <span className="grade-multiply pointer-events-none absolute inset-0 bg-[#152746] mix-blend-multiply" aria-hidden />
            <span className="grade-color pointer-events-none absolute inset-0 bg-[#152746] mix-blend-color" aria-hidden />
            {/* soft inner vignette at the card edges */}
            <span className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_80px_20px_rgba(11,25,56,0.55)]" aria-hidden />
          </div>

          {/* hand-drawn cotton border around the card */}
          <svg className="pointer-events-none absolute inset-[3px] h-[calc(100%-6px)] w-[calc(100%-6px)] overflow-visible" viewBox="0 0 100 125" preserveAspectRatio="none" aria-hidden>
            <path d={frame} fill="none" stroke="#EAE7DA" strokeOpacity="0.35" strokeWidth="1.6" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
              className="transition-[stroke-opacity] duration-700 group-hover:[stroke-opacity:0.6]" />
          </svg>
          <Stitch radius={28} />
        </div>

        {/* cowrie accent at the top-right corner */}
        <span className="absolute -right-3 -top-3 grid h-12 w-12 place-items-center rounded-full border border-[var(--line)] bg-ink text-cotton/80 md:-right-4 md:-top-4 md:h-14 md:w-14" aria-hidden>
          <Motif family="cowrie" seed="victor" size={100} strokeWidth={5} className="h-8 w-8 md:h-9 md:w-9" />
        </span>
      </div>

      <p className="mt-5 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-cotton/60 md:mt-6 md:text-right md:text-[12px]">Victor · Lagos</p>
    </div>
  );
}
