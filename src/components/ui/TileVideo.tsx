"use client";
// Muted looping showcase video. Poster first; the video never downloads before the page
// has loaded and the browser is idle, then plays only while in view.
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/perf.ts";

let pageReady: Promise<void> | null = null;
function whenPageReady() {
  if (!pageReady) pageReady = new Promise((res) => {
    const idle = () => ("requestIdleCallback" in window ? (window as Window & { requestIdleCallback: (f: () => void, o?: object) => void }).requestIdleCallback(() => res(), { timeout: 2500 }) : setTimeout(res, 800));
    if (document.readyState === "complete") idle(); else addEventListener("load", idle, { once: true });
  });
  return pageReady;
}

export default function TileVideo({ src, webm, poster, eager = false, className = "", label }: {
  src: string; webm?: string; poster: string; eager?: boolean; className?: string; label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current!;
    if (prefersReducedMotion()) return;
    let inView = false, ready = false, alive = true;
    const sync = () => {
      if (!alive || !ready) return;
      if (inView) { if (v.preload === "none") v.preload = "auto"; v.play().catch(() => {}); } else v.pause();
    };
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }, { threshold: innerWidth < 768 ? 0.8 : 0.35 });
    io.observe(v);
    whenPageReady().then(() => setTimeout(() => { ready = true; sync(); }, eager ? 0 : 400));
    return () => { alive = false; io.disconnect(); };
  }, [eager]);
  return (
    <video ref={ref} className={className} muted loop playsInline preload="none" poster={`${poster}-1280.webp`} aria-label={label}>
      {webm && <source src={webm} type="video/webm" />}
      <source src={src} type="video/mp4" />
    </video>
  );
}
