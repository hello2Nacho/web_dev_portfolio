"use client";
// Slow infinite marquee; speeds up slightly with scroll velocity.
import { useRef } from "react";
import { gsap, useGSAP, scrollState } from "@/lib/motion.ts";
import { prefersReducedMotion } from "@/lib/perf.ts";
import Motif from "@/components/ui/Motif.tsx";
import type { MotifFamily } from "@/lib/adire/index.ts";

const words = ["Design", "Build", "Motion", "Launch", "Made in Lagos"];
const seps: MotifFamily[] = ["spirals", "cowrie", "concentric", "dotRings", "leaves"];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {words.map((w, i) => (
        <span key={w} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-semibold uppercase leading-none tracking-[-0.02em] md:px-10">{w}</span>
          <Motif family={seps[i]} seed={`m${i}`} className="h-10 w-10 text-terracotta/90 md:h-14 md:w-14" strokeWidth={5} />
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  const track = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const el = track.current!;
    let x = 0, visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const tick = (_t: number, dt: number) => {
      if (!visible) return;
      const half = el.scrollWidth / 2;
      const boost = 1 + gsap.utils.clamp(0, 1.5, Math.abs(scrollState.velocity) / 1500);
      x -= (half / 40) * (dt / 1000) * boost; // one loop ≈ 40s at rest
      if (-x >= half) x += half;
      gsap.set(el, { x });
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); io.disconnect(); };
  });
  return (
    <section aria-label="Design, build, motion, launch. Made in Lagos." className="overflow-hidden border-y border-[var(--line)] bg-indigo py-8 md:py-10">
      <div ref={track} className="flex w-max will-change-transform"><Row /><Row /></div>
    </section>
  );
}
