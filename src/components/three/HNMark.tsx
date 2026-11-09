"use client";
// Lazy, power-aware wrapper: loads the 3D scene only near the viewport,
// pauses off-screen, and shows the static PNG on low-power / reduced motion / low FPS.
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { weakGPU } from "@/lib/perf.ts";

const Scene = dynamic(() => import("./HNMarkScene.tsx"), { ssr: false });

const FALLBACK = "/3d/monogram-fallback.webp";

function isLowPower() {
  if (typeof window === "undefined") return true;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (nav.deviceMemory ?? 8) <= 2 || (navigator.hardwareConcurrency ?? 8) <= 2;
}

export default function HNMark({ className = "", capture = false, still = false }: { className?: string; capture?: boolean; still?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (!capture && (isLowPower() || weakGPU())) return setFallback(true);
    const el = ref.current!;
    const nearIO = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "100% 0px" });
    const visIO = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    nearIO.observe(el); visIO.observe(el);
    return () => { nearIO.disconnect(); visIO.disconnect(); };
  }, [capture]);

  // FPS guard on small screens: if it can't hold ~40fps for 2s, swap to the PNG.
  useEffect(() => {
    if (!visible || fallback || capture || innerWidth > 1024) return;
    let frames = 0, raf = 0;
    const start = performance.now();
    const tick = () => {
      frames++;
      if (performance.now() - start < 2000) raf = requestAnimationFrame(tick);
      else if (frames / 2 < 40) setFallback(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, fallback, capture]);

  return (
    <div ref={ref} className={`relative ${className}`} aria-hidden>
      {fallback ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={FALLBACK} alt="" className="h-full w-full object-contain" />
      ) : (
        near && <Scene active={visible} capture={capture} still={still} />
      )}
    </div>
  );
}
