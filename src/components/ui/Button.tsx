"use client";
// Terracotta pill CTA (indigo-black text for AA contrast). `magnetic` on the main CTA only.
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion.ts";
import { richMotion } from "@/lib/perf.ts";
import TransitionLink from "./TransitionLink.tsx";

type Props = { href: string; children: React.ReactNode; variant?: "primary" | "ghost"; magnetic?: boolean; className?: string; external?: boolean; onClick?: () => void };

export default function Button({ href, children, variant = "primary", magnetic = false, className = "", external, onClick }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (!magnetic || !richMotion()) return;
    const el = ref.current!;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const near = Math.hypot(dx, dy) < Math.max(r.width, r.height) * 0.5 + 80;
      xTo(near ? dx * 0.18 : 0); yTo(near ? dy * 0.25 : 0);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [magnetic]);

  const base = "group relative inline-flex min-h-[48px] items-center gap-2 rounded-full px-6 text-[15px] font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta";
  const look = variant === "primary"
    ? "bg-terracotta text-ink hover:bg-[#dd7550]"
    : "border border-cotton/30 text-cotton hover:border-cotton/70";
  const inner = (<>{children}<span aria-hidden className="transition-transform duration-300 ease-dye group-hover:translate-x-1">→</span></>);
  if (external || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("["))
    return <a ref={ref} href={href.startsWith("[") ? "/contact" : href} className={`${base} ${look} ${className}`} onClick={onClick} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{inner}</a>;
  return <TransitionLink ref={ref} href={href} className={`${base} ${look} ${className}`} onClick={onClick}>{inner}</TransitionLink>;
}
