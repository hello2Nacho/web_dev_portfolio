"use client";
import { useRef } from "react";
import type { Project } from "@/content/projects.ts";
import { gsap, useGSAP, EASE_DYE } from "@/lib/motion.ts";
import { prefersReducedMotion } from "@/lib/perf.ts";
import TileVideo from "@/components/ui/TileVideo.tsx";

export default function CaseHero({ p }: { p: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo(ref.current, { clipPath: "inset(10% 8% 0% 8% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 18px)", duration: 1.4, ease: EASE_DYE, delay: 0.15 });
    gsap.fromTo(ref.current!.querySelector("video"), { scale: 1.15 }, { scale: 1, duration: 1.6, ease: EASE_DYE, delay: 0.15 });
  });
  return (
    <div ref={ref} className="relative overflow-hidden rounded-[18px] bg-indigo p-[5px]">
      <span className="absolute inset-0 bg-cover opacity-60" style={{ backgroundImage: `url(/patterns/${p.slug}.webp)` }} aria-hidden />
      <TileVideo src={p.media.video} webm={p.media.webm} poster={p.media.poster} eager label={`${p.name} showcase video`} className="relative aspect-[16/9] max-h-[70vh] w-full rounded-[13px] object-cover" />
    </div>
  );
}
