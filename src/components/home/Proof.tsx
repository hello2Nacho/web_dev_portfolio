"use client";
// j) Testimonials + stats. Renders NOTHING until real content is filled in site.ts.
import { useRef, useState } from "react";
import { site, filled } from "@/content/site.ts";
import { gsap, useGSAP } from "@/lib/motion.ts";
import { prefersReducedMotion } from "@/lib/perf.ts";
import { RevealLines } from "@/components/motion/Reveal.tsx";

export default function Proof() {
  const ok = site.testimonials.some((t) => filled(t.quote) && filled(t.name)) || site.stats.some((s) => filled(s.value) && filled(s.label));
  return ok ? <ProofInner /> : null;
}

function ProofInner() {
  const quotes = site.testimonials.filter((t) => filled(t.quote) && filled(t.name));
  const stats = site.stats.filter((s) => filled(s.value) && filled(s.label));
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
      const end = parseFloat(el.dataset.count || "0");
      if (prefersReducedMotion() || isNaN(end)) return;
      const o = { v: 0 };
      gsap.to(o, { v: end, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%" }, onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString()) });
    });
  }, { scope: ref, dependencies: [stats.length] });
  if (!quotes.length && !stats.length) return null;

  return (
    <section ref={ref} className="bg-indigo py-[clamp(96px,12vw,160px)]">
      <div className="mx-auto max-w-[1320px] px-[clamp(16px,4vw,48px)]">
        <p className="label">Kind words</p>
        {quotes.length > 0 && (
          <div className="mt-6">
            <blockquote key={i} className="max-w-[24ch] font-display text-[clamp(1.8rem,3.6vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.02em]">“{quotes[i].quote}”</blockquote>
            <p className="mt-6 text-[15px] text-muted">{quotes[i].name} · {quotes[i].role}</p>
            {quotes.length > 1 && (
              <div className="mt-8 flex gap-2" role="tablist" aria-label="Testimonials">
                {quotes.map((q, k) => <button key={k} role="tab" aria-selected={k === i} aria-label={`Testimonial ${k + 1}`} onClick={() => setI(k)} className="grid h-11 w-11 place-items-center"><span className={`h-1.5 rounded-full transition-all duration-300 ${k === i ? "w-6 bg-terracotta" : "w-1.5 bg-cotton/40"}`} /></button>)}
              </div>
            )}
          </div>
        )}
        {stats.length > 0 && (
          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-[24px] border border-[var(--line)] bg-ink p-8">
                <p className="font-display text-[clamp(3rem,5vw,4.6rem)] font-semibold leading-none tracking-[-0.03em]"><span data-count={s.value}>{s.value}</span>{s.suffix}</p>
                <p className="mt-3 text-[15px] text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
