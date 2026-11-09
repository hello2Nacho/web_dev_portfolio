"use client";
// Line-by-line headline reveal with a soft "dye bleed" (blur → sharp + indigo glow),
// and a generic staggered entrance. Reduced motion → short fade.
import { useRef } from "react";
import { gsap, useGSAP, EASE_DYE } from "@/lib/motion.ts";
import { prefersReducedMotion } from "@/lib/perf.ts";

type Tag = "h1" | "h2" | "h3" | "p" | "div";

export function RevealLines({ lines, as: As = "h2", className = "", delay = 0, start = "top 78%", immediate = false, children }: {
  lines: React.ReactNode[]; as?: Tag; className?: string; delay?: number; start?: string; immediate?: boolean; children?: React.ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useGSAP(() => {
    const inner = ref.current!.querySelectorAll<HTMLElement>("[data-line]");
    if (prefersReducedMotion()) {
      gsap.from(inner, { opacity: 0, duration: 0.4, delay, scrollTrigger: immediate ? undefined : { trigger: ref.current, start } });
      return;
    }
    gsap.fromTo(inner,
      { yPercent: 110, filter: "blur(8px)", textShadow: "0 0 24px rgba(67,83,104,.9)" },
      { yPercent: 0, filter: "blur(0px)", textShadow: "0 0 0px rgba(67,83,104,0)", duration: 1.1, stagger: 0.08, delay, ease: EASE_DYE,
        scrollTrigger: immediate ? undefined : { trigger: ref.current, start } });
  }, { scope: ref });
  return (
    <As ref={ref as never} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <span data-line className="block will-change-transform">{l}</span>
        </span>
      ))}
      {children}
    </As>
  );
}

export function Reveal({ children, className = "", stagger = 0.07, y = 28, start = "top 82%", selector = ":scope > *", duration = 0.9, ease = EASE_DYE, reducedMotion = "fade" }: {
  children: React.ReactNode; className?: string; stagger?: number; y?: number; start?: string; selector?: string;
  duration?: number; ease?: string; reducedMotion?: "fade" | "none";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const items = ref.current!.querySelectorAll(selector);
    const rm = prefersReducedMotion();
    if (rm && reducedMotion === "none") return; // shown as-is, no animation
    gsap.from(items, { opacity: 0, y: rm ? 0 : y, scale: rm ? 1 : 0.98, duration: rm ? 0.4 : duration, stagger, ease: rm ? EASE_DYE : ease,
      scrollTrigger: { trigger: ref.current, start, once: true } });
  }, { scope: ref });
  return <div ref={ref} className={className}>{children}</div>;
}
