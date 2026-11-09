"use client";
// Thin strip of adire cloth that ripples/stretches with scroll velocity, then settles.
import { useRef } from "react";
import { gsap, useGSAP, scrollState } from "@/lib/motion.ts";
import { prefersReducedMotion } from "@/lib/perf.ts";

export default function Divider({ src = "/patterns/band-divider.webp", className = "" }: { src?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current!;
    let skew = 0, visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const tick = () => {
      if (!visible) return;
      const target = gsap.utils.clamp(-3, 3, scrollState.velocity / 600);
      skew += (target - skew) * 0.12;
      gsap.set(el, { skewY: skew, scaleY: 1 + Math.abs(skew) * 0.06 });
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); io.disconnect(); };
  });
  return (
    <div className={`relative h-10 overflow-hidden md:h-12 ${className}`} aria-hidden>
      <div ref={ref} className="h-full w-full"><div className="band-breeze h-full w-full bg-[length:auto_100%] bg-repeat-x opacity-90" style={{ backgroundImage: `url(${src})` }} /></div>
    </div>
  );
}
