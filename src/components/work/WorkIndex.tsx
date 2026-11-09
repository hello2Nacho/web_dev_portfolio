"use client";
// /work: filterable bento (GSAP Flip) + list view with a cursor-following video preview.
import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/content/projects.ts";
import { gsap, Flip, EASE_DYE } from "@/lib/motion.ts";
import { prefersReducedMotion, richMotion } from "@/lib/perf.ts";
import ProjectTile from "@/components/home/ProjectTile.tsx";
import TransitionLink from "@/components/ui/TransitionLink.tsx";

const filters = ["All", "Web", "Web App", "Web & Motion", "E-commerce", "Client", "Concept"] as const;
type F = (typeof filters)[number];
const match = (p: Project, f: F) =>
  f === "All" || (f === "Client" || f === "Concept" ? p.status === f : f === "E-commerce" ? p.type.includes("E-commerce") : f === "Web" ? p.type === "Web" || p.type === "Web & E-commerce" : p.type === f); // "Web App", "Web & Motion"

export default function WorkIndex() {
  const [filter, setFilter] = useState<F>("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const choose = (f: F) => {
    if (grid.current && !prefersReducedMotion()) flipState.current = Flip.getState(grid.current.querySelectorAll("[data-flip]"));
    setFilter(f);
  };
  useEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, { duration: 0.6, ease: EASE_DYE, absolute: true, scale: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.5 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.3 }) });
    flipState.current = null;
  }, [filter]);

  const shown = projects.filter((p) => match(p, filter));
  return (
    <>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
          {filters.map((f) => (
            <button key={f} onClick={() => choose(f)} aria-pressed={filter === f}
              className={`min-h-11 rounded-full px-4 text-[14px] transition-colors duration-300 ${filter === f ? "bg-terracotta text-ink" : "border border-[var(--line)] bg-indigo text-cotton/80 hover:text-cotton"}`}>{f}</button>
          ))}
        </div>
        <div className="flex rounded-full border border-[var(--line)] bg-indigo p-1" role="group" aria-label="View">
          {(["grid", "list"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} aria-pressed={view === v} className={`min-h-10 rounded-full px-4 text-[13px] capitalize ${view === v ? "bg-cotton text-ink" : "text-cotton/70"}`}>{v}</button>
          ))}
        </div>
      </div>
      {view === "grid" ? (
        <div ref={grid} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p.slug} data-flip data-flip-id={p.slug} className={match(p, filter) ? "" : "hidden"}>
              <ProjectTile p={p} className="aspect-[16/11] w-full" />
              <p className="mt-3 px-1 text-[14px] text-muted">{p.oneLiner}</p>
            </div>
          ))}
        </div>
      ) : <ListView items={shown} />}
    </>
  );
}

function ListView({ items }: { items: Project[] }) {
  const prev = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Project | null>(null);
  const vid = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!richMotion()) return;
    const el = prev.current!;
    const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" }), y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const move = (e: PointerEvent) => { x(e.clientX + 24); y(e.clientY - 100); };
    addEventListener("pointermove", move);
    return () => removeEventListener("pointermove", move);
  }, []);
  useEffect(() => { if (active) vid.current?.play().catch(() => {}); }, [active]);
  return (
    <>
      <ul className="mt-8 border-t border-[var(--line)]" onMouseLeave={() => setActive(null)}>
        {items.map((p, i) => (
          <li key={p.slug} className="border-b border-[var(--line)]">
            <TransitionLink href={`/work/${p.slug}`} onMouseEnter={() => setActive(p)} onFocus={() => setActive(p)}
              className="group flex items-baseline justify-between gap-4 py-6 transition-[padding] duration-500 ease-dye hover:pl-3 md:py-8">
              <span className="flex items-baseline gap-5">
                <span className="text-[13px] text-muted">0{i + 1}</span>
                <span className="font-display text-[clamp(2rem,5vw,4.6rem)] font-semibold leading-none tracking-[-0.03em] transition-colors group-hover:text-cotton text-cotton/85">{p.name}</span>
              </span>
              <span className="hidden text-right text-[13px] text-muted sm:block">{p.type}<br />{p.status.startsWith("[") ? "" : p.status}</span>
            </TransitionLink>
          </li>
        ))}
      </ul>
      <div ref={prev} className={`pointer-events-none fixed left-0 top-0 z-50 hidden w-[320px] overflow-hidden rounded-[18px] border border-[var(--line)] bg-indigo shadow-2xl transition-[opacity,clip-path] duration-500 ease-dye md:block ${active ? "opacity-100 [clip-path:inset(0_round_18px)]" : "opacity-0 [clip-path:inset(20%_round_18px)]"}`} aria-hidden>
        {active && <video key={active.slug} ref={vid} src={active.media.video} poster={`${active.media.poster}-800.webp`} muted loop playsInline className="aspect-[16/10] w-full object-cover" />}
      </div>
    </>
  );
}
