"use client";
// i) Process as a strip of cloth being dyed: each step turns cotton → indigo on scroll.
import { useRef } from "react";
import { site } from "@/content/site.ts";
import { gsap, useGSAP } from "@/lib/motion.ts";
import { prefersReducedMotion } from "@/lib/perf.ts";
import { RevealLines } from "@/components/motion/Reveal.tsx";
import Motif from "@/components/ui/Motif.tsx";
import type { MotifFamily } from "@/lib/adire/index.ts";

const motifs: MotifFamily[] = ["dotRings", "spirals", "crosshatch", "cowrie"];

function Panel({ i, step, line, dyed }: { i: number; step: string; line: string; dyed: boolean }) {
  return (
    <div className={`flex h-full flex-col justify-between p-6 md:p-8 ${dyed ? "text-cotton" : "text-ink"}`}>
      <div className="flex items-start justify-between">
        <span className="font-display text-[15px] font-semibold">0{i + 1}</span>
        <Motif family={motifs[i]} seed={`p${i}`} className={`h-14 w-14 ${dyed ? "text-cotton/70" : "text-ink/30"}`} strokeWidth={4} />
      </div>
      <div>
        <h3 className="font-display text-[clamp(1.8rem,2.6vw,2.6rem)] font-semibold leading-none tracking-[-0.02em]">{step}</h3>
        <p className={`mt-3 max-w-[26ch] text-[15px] leading-snug ${dyed ? "text-cotton/80" : "text-ink/70"}`}>{line}</p>
      </div>
    </div>
  );
}

export default function Process() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    const dyes = gsap.utils.toArray<HTMLElement>("[data-dye]");
    if (prefersReducedMotion()) { gsap.set(dyes, { clipPath: "inset(0% 0 0 0)" }); return; }
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top top", end: "+=140%", scrub: 0.8, pin: true } });
      dyes.forEach((d, i) => tl.fromTo(d, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", ease: "none", duration: 1 }, i * 0.9));
    });
    mm.add("(max-width: 1023px)", () => {
      dyes.forEach((d) => gsap.fromTo(d, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", ease: "none", scrollTrigger: { trigger: d, start: "top 75%", end: "top 30%", scrub: 0.6 } }));
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-ink py-[clamp(96px,12vw,140px)] lg:flex lg:min-h-screen lg:items-center">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14]" aria-hidden>
        <picture><source type="image/avif" srcSet="/media/adire/drape-1-1600.avif" /><img src="/media/adire/drape-1-1600.webp" alt="" className="h-full w-full object-cover" loading="lazy" /></picture>
      </div>
      <div className="mx-auto w-full max-w-[1320px] px-[clamp(16px,4vw,48px)]">
        <p className="label">Process</p>
        <RevealLines as="h2" className="mt-4 font-display text-[clamp(2.2rem,4.5vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.03em]" lines={["Dipped four times."]} />
        <ol className="mt-12 grid gap-3 lg:h-[min(52vh,480px)] lg:grid-cols-4">
          {site.process.map((s, i) => (
            <li key={s.step} className="relative min-h-[240px] overflow-hidden rounded-[24px] bg-cotton">
              <div className="absolute inset-0 bg-[url(/patterns/hero-starch.webp)] bg-cover opacity-[0.12]" aria-hidden />
              <div className="relative h-full"><Panel i={i} step={s.step} line={s.line} dyed={false} /></div>
              <div data-dye className="absolute inset-0 bg-indigo [clip-path:inset(100%_0_0_0)]" aria-hidden="true">
                <div className="absolute inset-0 bg-[url(/patterns/cloth-wide.webp)] bg-cover opacity-[0.1]" />
                <div className="relative h-full"><Panel i={i} step={s.step} line={s.line} dyed /></div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
