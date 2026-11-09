"use client";
// Route transition: an indigo cloth panel with a ragged, dye-bled edge wipes across.
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { gsap } from "@/lib/motion.ts";
import { createRng } from "@/lib/adire/prng.ts";

function raggedPath() {
  const R = createRng("wipe");
  let d = "M0 0 L100 0 ";
  for (let y = 0; y <= 100; y += 4) d += `L${(100 + R.range(2, 9)).toFixed(1)} ${y} `;
  d += "L0 100 Z";
  return d;
}

export default function DyeWipe() {
  const ref = useRef<SVGSVGElement>(null);
  const pathname = usePathname();
  const pending = useRef(false);
  const d = useMemo(raggedPath, []);

  useEffect(() => {
    const out = (e: Event) => {
      const go = (e as CustomEvent<() => void>).detail;
      pending.current = true;
      gsap.set(ref.current, { display: "block", xPercent: -112 });
      gsap.to(ref.current, { xPercent: 0, duration: 0.5, ease: "power3.inOut", onComplete: go });
    };
    window.addEventListener("dye:out", out);
    return () => window.removeEventListener("dye:out", out);
  }, []);

  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    gsap.to(ref.current, { xPercent: 112, duration: 0.6, delay: 0.08, ease: "power3.inOut", onComplete: () => { gsap.set(ref.current, { display: "none" }); } });
  }, [pathname]);

  return (
    <svg ref={ref} className="pointer-events-none fixed inset-0 z-[90] hidden h-screen w-screen" viewBox="0 0 110 100" preserveAspectRatio="none" aria-hidden>
      <defs>
        <pattern id="wipe-cloth" width="40" height="22" patternUnits="userSpaceOnUse"><image href="/patterns/cloth-wide.webp" width="40" height="22" opacity="0.35" preserveAspectRatio="none" /></pattern>
      </defs>
      <path d={d} fill="#152746" />
      <path d={d} fill="url(#wipe-cloth)" />
    </svg>
  );
}
