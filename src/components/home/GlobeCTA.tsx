"use client";
// l) Interactive dotted globe centred on Lagos, with cotton "threads" to other cities.
import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";
import { site, cityLabel } from "@/content/site.ts";
import { prefersReducedMotion, isLowPower } from "@/lib/perf.ts";
import { RevealLines } from "@/components/motion/Reveal.tsx";
import Button from "@/components/ui/Button.tsx";

const rad = (d: number) => (d * Math.PI) / 180;
const toAngles = ([lat, lon]: [number, number]) => [Math.PI - (rad(lon) - Math.PI / 2), rad(lat)] as const;

/** Great-circle point between two lat/lons at t (0..1), so arcs can grow outward like stitches. */
function along(a: [number, number], b: [number, number], t: number): [number, number] {
  const v = ([la, lo]: [number, number]) => [Math.cos(rad(la)) * Math.cos(rad(lo)), Math.cos(rad(la)) * Math.sin(rad(lo)), Math.sin(rad(la))];
  const A = v(a), B = v(b);
  const d = Math.acos(Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2])) || 1e-6;
  const k1 = Math.sin((1 - t) * d) / Math.sin(d), k2 = Math.sin(t * d) / Math.sin(d);
  const [x, y, z] = [0, 1, 2].map((i) => k1 * A[i] + k2 * B[i]);
  return [(Math.atan2(z, Math.hypot(x, y)) * 180) / Math.PI, (Math.atan2(y, x) * 180) / Math.PI];
}

/** Project a lat/lon to canvas-relative [x,y] (0..1) for floating tags; null if on the back. */
function project([lat, lon]: [number, number], phi: number, theta: number) {
  const r = rad(lat), a = rad(lon) - Math.PI, c = Math.cos(r);
  const x = -c * Math.cos(a), y = Math.sin(r), z = c * Math.sin(a);
  const cp = Math.cos(phi), sp = Math.sin(phi), ct = Math.cos(theta), st = Math.sin(theta);
  const x2 = cp * x + sp * z;
  const y2 = sp * st * x + ct * y - cp * st * z;
  const z2 = -sp * ct * x + st * y + cp * ct * z;
  if (z2 < 0.1) return null;
  const R = 0.8; // cobe draws the sphere at ~80% of the canvas
  return [0.5 + (x2 * R) / 2, 0.5 - (y2 * R) / 2] as const;
}

export default function GlobeCTA() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const tags = useRef<(HTMLSpanElement | null)[]>([]);
  const [still, setStill] = useState(false);
  const all = [site.globe.home, ...site.globe.cities];

  // Create the globe only when its section is near the viewport.
  const [near, setNear] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: "60% 0px" });
    io.observe(canvas.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near) return;
    const c = canvas.current!;
    const lowEnd = isLowPower();
    const rm = prefersReducedMotion();
    setStill(rm);
    let [phi, theta] = toAngles(site.globe.home.loc);
    theta = 0.22;
    const size = () => c.offsetWidth;
    let w = size();
    const globe = createGlobe(c, {
      devicePixelRatio: lowEnd ? 1 : Math.min(2, devicePixelRatio), width: w * 2, height: w * 2, phi, theta,
      dark: 1, diffuse: 1.2, mapSamples: lowEnd ? 9000 : 18000, mapBrightness: 3.2, mapBaseBrightness: 0.02,
      baseColor: [0.09, 0.16, 0.3], markerColor: [0.82, 0.39, 0.24], glowColor: [0.09, 0.16, 0.3],
      markers: all.map((m, i) => ({ location: m.loc, size: i === 0 ? 0.08 : 0.035 })),
      arcs: rm ? site.globe.cities.map((m) => ({ from: site.globe.home.loc, to: m.loc })) : [],
      arcColor: [0.92, 0.9, 0.85], arcWidth: 0.7, arcHeight: 0.55, opacity: 0.95,
    });
    let raf = 0, visible = false, drag: number | null = null, vel = 0, t0 = 0;
    const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) loop(); });
    io.observe(c);
    const loop = () => {
      if (!visible) return;
      if (drag === null && !rm) phi += 0.0025 + vel; vel *= 0.94;
      const now = performance.now() / 1000;
      if (!t0) t0 = now;
      const el = now - t0;
      const state: Parameters<typeof globe.update>[0] = { phi, theta, width: w * 2, height: w * 2 };
      if (!rm) {
        // stitches: each thread grows out of Lagos in turn (0.35s apart, 1.3s each)
        if (el < site.globe.cities.length * 0.35 + 1.5)
          state.arcs = site.globe.cities.map((m, i) => ({ from: site.globe.home.loc, to: along(site.globe.home.loc, m.loc, Math.max(0.001, ease((el - 0.3 - i * 0.35) / 1.3))) }));
        // soft pulse on Lagos
        state.markers = all.map((m, i) => ({ location: m.loc, size: i === 0 ? 0.07 + 0.025 * (0.5 + 0.5 * Math.sin(now * 2.4)) : 0.035 }));
      }
      globe.update(state);
      all.forEach((m, i) => {
        const el = tags.current[i]; if (!el) return;
        const p = project(m.loc, phi, theta);
        el.style.opacity = p ? "1" : "0";
        if (p) el.style.transform = `translate(${p[0] * w}px, ${p[1] * w}px)`;
      });
      raf = requestAnimationFrame(loop);
    };
    const down = (e: PointerEvent) => { drag = e.clientX; c.style.cursor = "grabbing"; };
    const up = () => { drag = null; c.style.cursor = "grab"; };
    const move = (e: PointerEvent) => { if (drag === null) return; const d = e.clientX - drag; drag = e.clientX; phi += d / 200; vel = d / 4000; };
    const resize = () => (w = size());
    c.addEventListener("pointerdown", down); addEventListener("pointerup", up); addEventListener("pointermove", move); addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); io.disconnect(); globe.destroy(); removeEventListener("pointerup", up); removeEventListener("pointermove", move); removeEventListener("resize", resize); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [near]);

  return (
    <section className="relative overflow-hidden bg-ink pb-[clamp(40px,5vw,72px)] pt-[clamp(96px,12vw,170px)]">
      <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-[clamp(16px,4vw,48px)] md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative z-10">
          <p className="label">Work with me</p>
          <RevealLines as="h2" className="mt-4 font-display text-[clamp(2.4rem,4.4vw,4.6rem)] font-semibold leading-[0.96] tracking-[-0.035em]" lines={["Stitched in Lagos.", "Worn worldwide."]} />
          <p className="mt-6 text-[18px] text-cotton/85">Let&apos;s do something proper.</p>
          <div className="mt-8"><Button href="/contact" magnetic>Book a call</Button></div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[640px]">
          <div className="absolute inset-[12%] rounded-full bg-terracotta/10 blur-[80px]" aria-hidden />
          <canvas ref={canvas} className="relative h-full w-full cursor-grab touch-pan-y" aria-label={`Globe centred on Lagos with threads to ${site.globe.cities.map((c) => cityLabel(c.name)).join(", ")}`} role="img" />
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            {all.map((m, i) => (
              <span key={m.name} ref={(el) => { tags.current[i] = el; }} className="absolute left-0 top-0 transition-opacity duration-500" style={{ opacity: still ? 1 : 0 }}>
                <span className={`ml-3 -mt-3 inline-block whitespace-nowrap rounded-full border border-[var(--line)] px-2.5 py-1 text-[11px] font-medium backdrop-blur ${i === 0 ? "bg-terracotta text-ink" : "bg-ink/70 text-cotton"}`}>{cityLabel(m.name)}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
