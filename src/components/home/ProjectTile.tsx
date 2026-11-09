"use client";
// Bento tile: muted looping video framed by the project's own generated pattern.
import type { Project } from "@/content/projects.ts";
import TileVideo from "@/components/ui/TileVideo.tsx";
import TransitionLink from "@/components/ui/TransitionLink.tsx";
import Stitch from "@/components/ui/Stitch.tsx";

export default function ProjectTile({ p, eager = false, className = "", depth = 0 }: { p: Project; eager?: boolean; className?: string; depth?: number }) {
  return (
    <TransitionLink href={`/work/${p.slug}`} data-cursor="view" data-depth={depth}
      className={`tile stitch-host group @container relative block overflow-hidden rounded-[24px] bg-indigo p-[7px] ${className}`}>
      <span className="tile-ring absolute inset-0 rounded-[24px] bg-cover bg-center opacity-45 transition-opacity duration-700 ease-dye group-hover:opacity-100" style={{ backgroundImage: `url(/patterns/${p.slug}.webp)` }} aria-hidden />
      <span className="relative block h-full w-full overflow-hidden rounded-[18px] bg-ink">
        <TileVideo src={p.media.video} webm={p.media.webm} poster={p.media.poster} eager={eager} label={`${p.name} showcase`}
          className="h-full w-full object-cover transition-[transform,filter] duration-700 ease-dye group-hover:scale-[1.03] group-hover:saturate-[.85]" />
        {/* freshly dipped: indigo deepens on hover */}
        <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent transition-colors duration-700 group-hover:bg-[#0B1938]/25" aria-hidden />
        <span className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-4 @[380px]:flex-row @[380px]:items-end @[380px]:justify-between md:p-5">
          <span className="font-display text-[clamp(1.1rem,1.6vw,1.6rem)] font-semibold leading-none tracking-[-0.02em]">{p.name}</span>
          <span className="shrink-0 rounded-full border border-cotton/20 bg-ink/60 px-2.5 py-1 text-[10px] @[380px]:px-3 @[380px]:py-1.5 @[380px]:text-[11px] font-medium uppercase tracking-[0.12em] backdrop-blur">{p.type}</span>
        </span>
      </span>
      <Stitch />
    </TransitionLink>
  );
}
