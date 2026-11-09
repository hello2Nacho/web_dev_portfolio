"use client";
// Easter egg: press "A" for a full-screen pattern playground; "A" regenerates, Esc closes.
import { useEffect, useState } from "react";
import { generatePattern, PALETTES } from "@/lib/adire/index.ts";

export default function Playground() {
  const [seed, setSeed] = useState<string | null>(null);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() === "a") setSeed(Math.random().toString(36).slice(2, 8));
      if (e.key === "Escape") setSeed(null);
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, []);
  if (!seed) return null;
  const vw = typeof window !== "undefined" ? innerWidth : 1440, vh = typeof window !== "undefined" ? innerHeight : 900;
  const unit = 72;
  const p = generatePattern({ seed, cols: Math.ceil(vw / unit), rows: Math.ceil(vh / unit), unit, palette: seed.charCodeAt(0) % 4 === 0 ? PALETTES.cotton : PALETTES.indigo });
  return (
    <div role="dialog" aria-label="Pattern playground" className="fixed inset-0 z-[110] cursor-pointer bg-ink" onClick={() => setSeed(null)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.dataUrl} alt="" className="h-full w-full object-cover" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink/80 px-5 py-3 text-center text-[13px] backdrop-blur">
        Seed <b className="font-display">{seed}</b> · press <kbd className="rounded bg-cotton/10 px-1.5">A</kbd> again · <kbd className="rounded bg-cotton/10 px-1.5">Esc</kbd> to close
      </div>
    </div>
  );
}
