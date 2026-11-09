"use client";
// h) Selected work: editorial layout with all 7 projects. Halcyon leads as a feature row;
// the rest sit in a two-column index. On desktop hover, a short line slides up like cloth.
import { useRef } from "react";
import { projects, isFilled, type Project } from "@/content/projects.ts";
import { gsap, useGSAP, EASE_DYE } from "@/lib/motion.ts";
import { prefersReducedMotion } from "@/lib/perf.ts";
import { RevealLines } from "@/components/motion/Reveal.tsx";
import Picture from "@/components/ui/Picture.tsx";
import TransitionLink from "@/components/ui/TransitionLink.tsx";
import Stitch from "@/components/ui/Stitch.tsx";
import Button from "@/components/ui/Button.tsx";

function Meta({ p, big = false }: { p: Project; big?: boolean }) {
  const stack = p.stack.filter(isFilled);
  const tag = p.status === "Client" || p.status === "Concept" ? p.status : null;
  return (
    <div className={big ? "md:pl-4" : "mt-5"}>
      <div className="flex flex-wrap items-center gap-3">
        <h3 className={`font-display font-semibold leading-none tracking-[-0.02em] ${big ? "text-[clamp(2rem,3.6vw,3.4rem)]" : "text-[clamp(1.5rem,2.2vw,2rem)]"}`}>{p.name}</h3>
        {tag && <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] ${tag === "Client" ? "border-terracotta/60 text-terracotta" : "border-cotton/25 text-cotton/70"}`}>{tag}</span>}
      </div>
      <p className={`mt-3 text-cotton/85 ${big ? "max-w-[34ch] text-[17px]" : "max-w-[44ch] text-[15px]"}`}>{p.oneLiner}</p>
      <p className="mt-3 text-[13px] text-muted">{[p.type, stack.join(" · "), isFilled(p.year) ? p.year : ""].filter(Boolean).join("  ·  ")}</p>
    </div>
  );
}

function Frame({ p, i, sizes }: { p: Project; i: number; sizes: string }) {
  return (
    <span data-work className="stitch-host relative block overflow-hidden rounded-[24px] bg-indigo">
      <Picture base={p.media.stills[0]} alt={`${p.name}: device mockup`} sizes={sizes}
        className={`w-full object-cover transition-transform duration-[1.2s] ease-dye group-hover:scale-[1.04] ${i === 0 ? "aspect-[16/10]" : "aspect-[16/10]"}`} />
      {/* the "cloth" line: slides up with a ragged, dyed edge (desktop hover) */}
      <span className="cloth-line pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-full items-end bg-indigo/95 px-6 pb-5 pt-9 text-[15px] text-cotton backdrop-blur transition-transform duration-700 ease-dye group-hover:translate-y-0 group-focus-visible:translate-y-0 md:flex" aria-hidden>
        <span className="mr-3 mt-[0.45em] h-px w-6 shrink-0 bg-terracotta" />{p.hoverLine}
      </span>
      <Stitch />
    </span>
  );
}

export default function SelectedWork() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    const rm = prefersReducedMotion();
    gsap.utils.toArray<HTMLElement>("[data-work]").forEach((el) => {
      const img = el.querySelector("img");
      if (rm) { gsap.from(el, { opacity: 0, duration: 0.4, scrollTrigger: { trigger: el, start: "top 88%" } }); return; }
      gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%" } })
        .fromTo(el, { clipPath: "inset(10% 8% 10% 8% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1.2, ease: EASE_DYE })
        .fromTo(img, { scale: 1.15 }, { scale: 1, duration: 1.4, ease: EASE_DYE }, 0);
    });
  }, { scope: ref });

  const [lead, ...rest] = projects;
  return (
    <section ref={ref} className="bg-ink pb-[clamp(96px,13vw,192px)] pt-16 md:pt-[clamp(96px,13vw,192px)]">
      <div className="mx-auto max-w-[1320px] px-[clamp(16px,4vw,48px)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label">Selected work</p>
            <RevealLines as="h2" className="mt-4 font-display text-[clamp(2.2rem,4.5vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.03em]" lines={["Revealed,", "one by one."]} />
          </div>
          <Button href="/work" variant="ghost">All projects</Button>
        </div>

        <TransitionLink href={`/work/${lead.slug}`} data-cursor="view" className="group mt-14 grid items-end gap-6 md:grid-cols-12 md:gap-8">
          <span className="md:col-span-8"><Frame p={lead} i={0} sizes="(min-width: 768px) 66vw, 100vw" /></span>
          <span className="md:col-span-4"><Meta p={lead} big /></span>
        </TransitionLink>

        <ul className="mt-16 grid gap-x-8 gap-y-16 md:mt-24 md:grid-cols-2">
          {rest.map((p, i) => (
            <li key={p.slug} className={i % 2 ? "md:mt-24" : ""}>
              <TransitionLink href={`/work/${p.slug}`} data-cursor="view" className="group block">
                <Frame p={p} i={i + 1} sizes="(min-width: 768px) 50vw, 100vw" />
                <Meta p={p} />
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
