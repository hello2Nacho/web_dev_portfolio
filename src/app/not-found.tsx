"use client";
import { useEffect, useState } from "react";
import { generatePattern } from "@/lib/adire/index.ts";
import { prefersReducedMotion } from "@/lib/perf.ts";
import Button from "@/components/ui/Button.tsx";

export default function NotFound() {
  const [seeds, setSeeds] = useState(["404-a", "404-b"]);
  const [front, setFront] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => {
      setSeeds((s) => { const n = [...s]; n[1 - front] = Math.random().toString(36).slice(2, 7); return n; });
      setFront((f) => 1 - f);
    }, 4000);
    return () => clearInterval(id);
  }, [front]);
  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden px-6">
      {seeds.map((s, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={generatePattern({ seed: s, cols: 16, rows: 10, unit: 80 }).dataUrl} alt="" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1.5s] ${i === front ? "opacity-40" : "opacity-0"}`} />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,25,56,.9),rgba(11,25,56,.55))]" />
      <div className="relative text-center">
        <p className="label">404</p>
        <h1 className="mt-4 font-display text-[clamp(2.6rem,7vw,6.4rem)] font-semibold leading-[0.95] tracking-[-0.035em]">This page wasn&apos;t<br />dyed yet.</h1>
        <div className="mt-10 flex justify-center"><Button href="/">Back home</Button></div>
      </div>
    </section>
  );
}
