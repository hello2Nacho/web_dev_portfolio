"use client";
// Floating glass pill nav + full-screen mobile menu with a pattern band.
import { useEffect, useState } from "react";
import { site } from "@/content/site.ts";
import Availability from "./Availability.tsx";
import TransitionLink from "@/components/ui/TransitionLink.tsx";
import Button from "@/components/ui/Button.tsx";

export function Logo({ className = "" }: { className?: string }) {
  return <span className={`font-display text-[22px] font-extrabold tracking-[-0.04em] ${className}`}>HN<span className="text-terracotta">.</span></span>;
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = 0;
    const on = () => {
      const y = scrollY;
      setSolid(y > 40);
      setHidden(y > 400 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  useEffect(() => { document.documentElement.style.overflow = open ? "hidden" : ""; }, [open]);

  return (
    <>
      <header data-solid={solid} className={`site-header fixed inset-x-0 top-3 z-[80] px-3 transition-[transform,background-color,padding] duration-500 ease-dye md:top-4 ${hidden && !open ? "-translate-y-24" : ""}`}>
        <nav aria-label="Main" className={`mx-auto flex h-14 max-w-[1120px] items-center justify-between rounded-full border border-[var(--line)] pl-5 pr-2 backdrop-blur-[14px] transition-colors duration-500 ${solid ? "bg-ink/75" : "bg-ink/35"}`}>
          <TransitionLink href="/" className="flex min-h-11 items-center"><Logo /><span className="sr-only"> HiNacho home</span></TransitionLink>
          <ul className="hidden items-center gap-8 md:flex">
            {site.nav.map((n) => (
              <li key={n.href}><TransitionLink href={n.href} className="nav-link text-[14px] text-cotton/80 transition-colors hover:text-cotton">{n.label}</TransitionLink></li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <Availability className="hidden pr-2 text-[13px] text-cotton/80 lg:inline-flex" />
            <Button href="/contact" className="hidden !min-h-11 !px-5 text-[14px] sm:inline-flex">Book a call</Button>
            <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu" className="grid h-11 w-11 place-items-center rounded-full md:hidden" aria-label={open ? "Close menu" : "Open menu"}>
              <span className={`block h-[1.5px] w-5 bg-cotton transition-transform duration-300 ${open ? "translate-y-[3px] rotate-45" : "-translate-y-[3px]"}`} />
              <span className={`absolute block h-[1.5px] w-5 bg-cotton transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
            </button>
          </div>
        </nav>
      </header>
      <div id="mobile-menu" className={`fixed inset-0 z-[70] flex flex-col bg-ink px-6 pb-10 pt-28 transition-[clip-path] duration-700 ease-cloth md:hidden ${open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"}`}>
        <ul className="flex flex-col gap-2">
          {[{ label: "Home", href: "/" }, ...site.nav, { label: "Contact", href: "/contact" }].map((n) => (
            <li key={n.href}><TransitionLink href={n.href} onClick={() => setOpen(false)} className="block py-2 font-display text-5xl font-semibold tracking-[-0.03em]">{n.label}</TransitionLink></li>
          ))}
        </ul>
        <div className="mt-auto">
          <Availability className="mb-5 inline-flex text-[15px] text-cotton/80" onNavigate={() => setOpen(false)} />
          <div className="band-breeze h-12 w-full bg-[url(/patterns/band-menu.webp)] bg-[length:auto_100%] bg-repeat-x opacity-80" aria-hidden />
          <Button href="/contact" className="mt-6 w-full justify-center" onClick={() => setOpen(false)}>Book a call</Button>
        </div>
      </div>
    </>
  );
}
