"use client";
// Lenis smooth inertia scroll + GSAP ticker sync. Disabled for reduced motion.
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef } from "react";
import { gsap, ScrollTrigger, scrollState } from "@/lib/motion.ts";
import { prefersReducedMotion } from "@/lib/perf.ts";

const LenisCtx = createContext<{ current: Lenis | null }>({ current: null });
export const useLenis = () => useContext(LenisCtx);

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.toggle("reduced", prefersReducedMotion());
    if (prefersReducedMotion()) return;
    const l = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.current = l;
    l.on("scroll", (e: Lenis) => {
      scrollState.velocity = e.velocity * 60;
      scrollState.progress = e.progress;
      ScrollTrigger.update();
    });
    const raf = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(raf); l.destroy(); lenis.current = null; };
  }, []);

  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true });
    const id = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => clearTimeout(id);
  }, [pathname]);

  return <LenisCtx.Provider value={lenis}>{children}</LenisCtx.Provider>;
}
