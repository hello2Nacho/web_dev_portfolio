"use client";
// "About the pattern" modal (footer link).
import { useEffect, useRef } from "react";
import { site, filled } from "@/content/site.ts";

export default function AboutPattern() {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const open = () => ref.current?.showModal();
    addEventListener("about-pattern", open);
    return () => removeEventListener("about-pattern", open);
  }, []);
  return (
    <dialog ref={ref} className="m-auto w-[min(560px,calc(100%-32px))] rounded-[24px] border border-[var(--line)] bg-indigo p-0 text-cotton backdrop:bg-ink/70 backdrop:backdrop-blur-sm" onClick={(e) => e.target === ref.current && ref.current?.close()}>
      <div className="h-10 bg-[url(/patterns/band-divider.webp)] bg-[length:auto_100%] bg-repeat-x" aria-hidden />
      <div className="p-7 md:p-9">
        <p className="label">About the pattern</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em]">Digital cloth, real craft</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-cotton/85">The patterns and textures on this site are digital, inspired by adire, the indigo resist-dyed cloth of the Yoruba.</p>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">In adire eleko, artisans paint designs onto cotton with a cassava-starch paste. The cloth is dipped in indigo, and when the starch is washed away, the pattern appears in the lighter, undyed areas. Abeokuta and Ibadan are long-standing centres of the craft.</p>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">Every pattern here is generated in code, so no real cloth was traced or copied. Press <kbd className="rounded bg-cotton/10 px-1.5">A</kbd> anywhere to dye a new one.</p>
        {filled(site.artisanCredit) && <p className="mt-4 text-[13px] text-muted">Handmade adire photography: {site.artisanCredit}</p>}
        <button onClick={() => ref.current?.close()} className="mt-7 min-h-11 rounded-full border border-cotton/30 px-5 text-[14px] hover:border-cotton/70">Close</button>
      </div>
    </dialog>
  );
}
