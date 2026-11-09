"use client";
// Draws every <path> inside in with stroke-dashoffset when the element enters.
import { useRef } from "react";
import { gsap, useGSAP, EASE_DYE } from "@/lib/motion.ts";
import { prefersReducedMotion } from "@/lib/perf.ts";

export default function DrawOn({ children, className = "", duration = 1.1, stagger = 0.02, start = "top 80%", trigger = "scroll" }: {
  children: React.ReactNode; className?: string; duration?: number; stagger?: number; start?: string; trigger?: "scroll" | "mount";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const paths = ref.current!.querySelectorAll<SVGPathElement>("path");
    paths.forEach((p) => p.setAttribute("pathLength", "1"));
    if (prefersReducedMotion()) return;
    gsap.fromTo(paths, { strokeDasharray: 1, strokeDashoffset: 1 }, {
      strokeDashoffset: 0, duration, stagger: { each: stagger, from: "random" }, ease: EASE_DYE,
      scrollTrigger: trigger === "scroll" ? { trigger: ref.current, start } : undefined,
    });
  }, { scope: ref });
  return <div ref={ref} className={className}>{children}</div>;
}
