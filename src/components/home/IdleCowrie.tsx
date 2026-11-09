"use client";
// Idle delight: after 6s without input on the hero, one cowrie drifts across. Once per visit.
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/motion.ts";
import { richMotion } from "@/lib/perf.ts";
import { cowrie } from "@/lib/adire/index.ts";
import { createRng } from "@/lib/adire/prng.ts";

export default function IdleCowrie({ hero }: { hero: React.RefObject<HTMLElement | null> }) {
  const ref = useRef<SVGSVGElement>(null);
  const [show, setShow] = useState(false);
  const shell = useMemo(() => cowrie(createRng("idle"), 50, 50, 90, 3.4), []);
  useEffect(() => {
    if (!richMotion()) return;
    let timer = 0, done = false, inView = true;
    const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting), { threshold: 0.4 });
    if (hero.current) io.observe(hero.current);
    const arm = () => { clearTimeout(timer); if (!done) timer = window.setTimeout(() => { if (inView) { done = true; setShow(true); } else arm(); }, 6000); };
    const evs = ["pointermove", "scroll", "keydown", "touchstart"] as const;
    evs.forEach((e) => addEventListener(e, arm, { passive: true }));
    arm();
    return () => { clearTimeout(timer); io.disconnect(); evs.forEach((e) => removeEventListener(e, arm)); };
  }, [hero]);
  useEffect(() => {
    if (!show) return;
    const el = ref.current!;
    gsap.fromTo(el, { x: -120, y: innerHeight * 0.62, rotate: -20, opacity: 0 }, {
      x: innerWidth + 120, y: innerHeight * 0.38, rotate: 200, duration: 11, ease: "sine.inOut",
      keyframes: { opacity: [0, 0.9, 0.9, 0] }, onComplete: () => setShow(false),
    });
  }, [show]);
  if (!show) return null;
  return (
    <svg ref={ref} viewBox="0 0 100 100" className="pointer-events-none fixed left-0 top-0 z-30 h-14 w-14 text-cotton" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden>
      {shell.map((s, i) => <path key={i} d={s.d} strokeWidth={s.w} />)}
    </svg>
  );
}
