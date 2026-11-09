"use client";
import { useCallback, useRef } from "react";
import { preload } from "react-dom";
import { projects } from "@/content/projects.ts";
import { site } from "@/content/site.ts";
import { gsap, useGSAP, EASE_DYE } from "@/lib/motion.ts";
import { prefersReducedMotion, richMotion } from "@/lib/perf.ts";
import Button from "@/components/ui/Button.tsx";
import DyeFlood from "./DyeFlood.tsx";
import ProjectTile from "./ProjectTile.tsx";
import IdleCowrie from "./IdleCowrie.tsx";

// Hero shows 4 projects; Selected work below shows all 7.
const HERO_SLUGS = ["halcyon", "noto", "helio", "atelier-eko"];
const heroProjects = HERO_SLUGS.map((s) => projects.find((p) => p.slug === s)!);
// 12-col desktop bento: Halcyon large left, Noto top right, helio + Atelier below it
const layout = ["md:col-span-6 md:row-span-2", "md:col-span-6", "md:col-span-3", "md:col-span-3"];
const depths = [0.05, 0.12, -0.06, 0.1];

export default function Hero() {
  // The first tile's pattern ring is the LCP element: fetch it early and at high priority.
  preload(`/patterns/${projects[0].slug}.webp`, { as: "image", fetchPriority: "high" });
  preload(`${projects[0].media.poster}-1280.webp`, { as: "image", fetchPriority: "high" });
  const root = useRef<HTMLElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const fired = useRef(false);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const rm = prefersReducedMotion();
    gsap.set(q("[data-hero-line]"), { yPercent: rm ? 0 : 110, opacity: rm ? 0 : 1 });
    gsap.set(q(".tile"), { y: rm ? 0 : 30, scale: rm ? 1 : 0.96 }); // stays painted under the cotton cover (good for LCP)
    gsap.set(q("[data-hero-fade]"), { opacity: 0, y: rm ? 0 : 12 });
    tl.current = gsap.timeline({ paused: true })
      .to(q("[data-hero-line]"), rm ? { opacity: 1, duration: 0.4 } : { yPercent: 0, duration: 1.1, stagger: 0.08, ease: EASE_DYE,
        keyframes: { filter: ["blur(8px)", "blur(0px)"], textShadow: ["0 0 28px rgba(67,83,104,.9)", "0 0 0 rgba(67,83,104,0)"] } }, 0)
      .to(q("[data-hero-fade]"), { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: EASE_DYE }, 0.25)
      .fromTo(q(".underline-path"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" }, 0.75)
      .to(q(".tile"), { y: 0, scale: 1, duration: 0.9, stagger: 0.06, ease: EASE_DYE }, 0.35);

    if (!richMotion()) return;
    // parallax: scroll depth + mouse drift
    q(".tile").forEach((el: HTMLElement) => {
      const d = Number(el.dataset.depth || 0);
      gsap.to(el, { yPercent: -d * 60, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
    });
    const movers = q(".tile").map((el: HTMLElement) => ({ d: Number(el.dataset.depth || 0), x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }), y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }) }));
    const move = (e: PointerEvent) => {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      movers.forEach((m) => { m.x(nx * m.d * 90); m.y(ny * m.d * 60); });
    };
    addEventListener("pointermove", move);
    return () => removeEventListener("pointermove", move);
  }, { scope: root });

  const onProgress = useCallback((p: number) => {
    if (!fired.current && p > 0.2) { fired.current = true; tl.current?.play(); }
  }, []);

  const t = site.tagline;
  return (
    <section ref={root} className="relative isolate overflow-hidden bg-ink pb-24 pt-32 md:pb-32 md:pt-40" aria-labelledby="hero-title">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[url(/media/adire/tile-1-800.webp)] bg-[length:520px] opacity-[0.04]" aria-hidden />
      <div className="mx-auto max-w-[1320px] px-[clamp(16px,4vw,48px)]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-hero-fade lang="yo" className="label mb-5 !text-cotton/80">Ẹ káàbọ̀</p>
            <h1 id="hero-title" className="font-display text-[clamp(2.9rem,7.4vw,7.6rem)] font-semibold leading-[0.96] tracking-[-0.035em]">
              <span className="block overflow-hidden pb-[0.06em]"><span data-hero-line className="block">{t.before}</span></span>
              <span className="block overflow-hidden pb-[0.12em]"><span data-hero-line className="block">
                {t.line2}{" "}
                <span className="relative inline-block">
                  {t.key}
                  <svg className="absolute -bottom-[0.12em] left-0 h-[0.22em] w-full overflow-visible" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden>
                    <path className="underline-path" d="M4 12 C 40 4, 80 16, 120 9 S 180 6, 196 11" fill="none" stroke="#D2643C" strokeWidth="5" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset="1" vectorEffect="non-scaling-stroke" style={{ strokeWidth: "max(3px, 0.06em)" }} />
                  </svg>
                </span>
                {t.after}
              </span></span>
            </h1>
          </div>
          <div data-hero-fade className="flex flex-col items-start gap-5 md:max-w-[300px] md:pb-3">
            <p className="text-[16px] leading-relaxed text-muted">{site.metaLine} Websites for brands that want to feel alive, not templated.</p>
            <Button href="/contact" magnetic>Book a call</Button>
          </div>
        </div>

        {/* mobile: horizontal swipe carousel with snap + peeking edges; md+: bento grid */}
        <div className="-mx-[clamp(16px,4vw,48px)] mt-12 md:mx-0 md:mt-20">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] md:grid md:snap-none md:auto-rows-[clamp(190px,17vw,260px)] md:grid-cols-12 md:gap-4 md:overflow-visible md:p-0 [&::-webkit-scrollbar]:hidden"
            role="list" aria-label="Featured projects">
            {heroProjects.map((p, i) => (
              <div key={p.slug} role="listitem" className={`w-[84%] shrink-0 snap-start sm:w-[62%] md:w-auto ${layout[i]}`}>
                <ProjectTile p={p} eager={i < 2} depth={depths[i]} className="aspect-[4/5] h-full w-full sm:aspect-[16/11] md:aspect-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <DyeFlood onProgress={onProgress} />
      <IdleCowrie hero={root} />
    </section>
  );
}
