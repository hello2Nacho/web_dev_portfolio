"use client";
// g) Services as a loom: four threads weave over/under into one strip, "Your Brand".
import { useRef } from "react";
import { site } from "@/content/site.ts";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/motion.ts";
import { prefersReducedMotion } from "@/lib/perf.ts";
import { RevealLines } from "@/components/motion/Reveal.tsx";

type Geo = { L: number; starts: number[]; c: number; conv: [number, number]; braid: number; vertical: boolean };
const H: Geo = { L: 900, starts: [70, 210, 350, 490], c: 280, conv: [120, 420], braid: 400, vertical: false };

const ss = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

function thread(g: Geo, i: number) {
  const pts: [number, number][] = [];
  for (let a = 0; a <= g.L; a += 5) {
    const t = ss(g.conv[0], g.conv[1], a);
    const base = g.starts[i] + (g.c - g.starts[i]) * t;
    const braid = Math.sin(((a - g.braid) / 70) * Math.PI * 2 + (i * Math.PI) / 2) * 22 * ss(g.braid - 80, g.braid + 40, a);
    const wave = Math.sin(a / 120 + i * 1.7) * 7 * (1 - t);
    const o = base + braid + wave;
    pts.push(g.vertical ? [o, a] : [a, o]);
  }
  const d = (p: [number, number][]) => "M" + p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L");
  // over-segments: alternate half-periods in the braid zone
  const overs: string[] = [];
  const half = 35;
  for (let k = 0, a0 = g.braid; a0 < g.L; a0 += half, k++) {
    if ((k + i) % 2) continue;
    const seg = pts.filter((_, j) => j * 5 >= a0 && j * 5 <= a0 + half);
    if (seg.length > 1) overs.push(d(seg));
  }
  return { full: d(pts), overs };
}

function LoomSvg({ g, className }: { g: Geo; className: string }) {
  const threads = site.services.map((_, i) => thread(g, i));
  const w = g.vertical ? 360 : g.L, h = g.vertical ? g.L + 70 : 560;
  const strip = g.vertical ? { x: g.c - 46, y: g.braid - 30, w: 92, h: g.L - g.braid + 10 } : { x: g.braid - 30, y: g.c - 46, w: g.L - g.braid + 10, h: 92 };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio={g.vertical ? "xMidYMin meet" : "xMinYMid meet"} fill="none" strokeLinecap="round" aria-hidden>
      <rect data-strip x={strip.x} y={strip.y} width={strip.w} height={strip.h} rx="14" stroke="rgba(234,231,218,.25)" strokeDasharray="6 5" />
      {threads.map((t, i) => <path key={i} data-thread d={t.full} stroke={site.services[i].color} strokeWidth="5" pathLength={1} />)}
      <g data-over>
        {threads.map((t, i) => t.overs.map((o, k) => (
          <g key={`${i}-${k}`}><path d={o} stroke="#0B1938" strokeWidth="11" /><path d={o} stroke={site.services[i].color} strokeWidth="5" /></g>
        )))}
      </g>
      <text data-brand x={g.vertical ? g.c : strip.x + strip.w / 2} y={g.vertical ? strip.y + strip.h + 40 : strip.y + strip.h + 42} textAnchor="middle" fill="#EAE7DA" className="font-display" fontSize="26" fontWeight="800" letterSpacing="-0.5">Your Brand</text>
    </svg>
  );
}

export default function Loom() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    const q = gsap.utils.selector(ref);
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    const svg = (q("[data-loom=h]")[0] as HTMLElement).querySelector("svg")!;
    const threads = svg.querySelectorAll("[data-thread]");
    const timeline = (st: ScrollTrigger.Vars) => {
      gsap.set(threads, { strokeDasharray: 1, strokeDashoffset: 0.7 }); // threads already reach in from the cards
      gsap.set(svg.querySelectorAll("[data-over], [data-brand], [data-strip]"), { opacity: 0 });
      const tl = gsap.timeline({ scrollTrigger: st });
      threads.forEach((t, i) => {
        tl.fromTo(t, { strokeDashoffset: 0.7 }, { strokeDashoffset: 0, ease: "none", duration: 1, immediateRender: true }, i * 0.15);
        tl.fromTo(q("[data-card]")[i], { borderColor: "rgba(234,231,218,0.08)" }, { borderColor: "rgba(210,100,60,0.7)", duration: 0.2 }, i * 0.15);
      });
      tl.to(svg.querySelectorAll("[data-over]"), { opacity: 1, duration: 0.25 }, 0.8)
        .to(svg.querySelectorAll("[data-strip]"), { opacity: 1, duration: 0.25 }, 1.1)
        .to(svg.querySelectorAll("[data-brand]"), { opacity: 1, duration: 0.25 }, 1.25);
    };
    // Desktop: threads start drawing as the section enters, then a short pin (~80% of a screen) finishes the weave.
    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({ trigger: ref.current, start: "top top", end: "+=80%", pin: true });
      timeline({ trigger: ref.current, start: "top 95%", end: () => `+=${innerHeight * 0.95 + innerHeight * 0.8}`, scrub: 0.8 });
    });
    // Mobile: no pin; the compact weave draws while it scrolls through the viewport.
    mm.add("(max-width: 1023px)", () => timeline({ trigger: svg, start: "top 85%", end: "bottom 45%", scrub: 0.6 }));
    return () => { mm.revert(); ScrollTrigger.refresh(); };
  }, { scope: ref });

  return (
    <section id="services" ref={ref} className="relative overflow-hidden bg-ink pb-16 pt-[clamp(96px,12vw,160px)] lg:flex lg:min-h-screen lg:items-center lg:py-0">
      <div className="mx-auto w-full max-w-[1320px] px-[clamp(16px,4vw,48px)]">
        <p className="label">Services</p>
        <RevealLines as="h2" className="mt-4 font-display text-[clamp(2.2rem,4.5vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.03em]" lines={["Four threads.", "One cloth."]} />
        <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-[minmax(240px,300px)_1fr] lg:gap-0">
          <ul className="grid grid-cols-2 gap-3 lg:flex lg:h-[min(56vh,560px)] lg:flex-col lg:justify-around lg:gap-0">
            {site.services.map((s) => (
              <li key={s.key} data-card className="stitch-host relative rounded-[20px] border border-[var(--line)] bg-indigo px-5 py-4">
                <span className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} /><span className="font-display text-xl font-semibold">{s.key}</span></span>
                <span className="mt-1.5 block text-[14px] leading-snug text-muted">{s.line}</span>
              </li>
            ))}
          </ul>
          <div data-loom="h"><LoomSvg g={H} className="h-auto w-full lg:h-[min(56vh,560px)]" /></div>
        </div>
      </div>
    </section>
  );
}
