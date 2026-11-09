"use client";
import { useEffect, useState } from "react";
import { site, filled } from "@/content/site.ts";
import { generateBand } from "@/lib/adire/index.ts";
import SocialIcons, { WhatsAppIcon } from "@/components/ui/SocialIcons.tsx";
import { whatsappLink } from "@/content/site.config.ts";
import TransitionLink from "@/components/ui/TransitionLink.tsx";
import { Logo } from "./Nav.tsx";

export default function Footer() {
  // Pattern of the day: the loom band is re-dyed from today's date (client-side, so it's always "today").
  const [day, setDay] = useState<{ url: string; label: string } | null>(null);
  useEffect(() => {
    const d = new Date();
    const seed = d.toISOString().slice(0, 10);
    setDay({ url: generateBand(`day-${seed}`, 24).dataUrl, label: d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) });
  }, []);
  const band = day ? `url("${day.url}")` : "url(/patterns/band-footer.webp)";
  return (
    <footer className="relative overflow-hidden border-t border-[var(--line)] bg-indigo">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-[clamp(16px,4vw,48px)] py-20 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo className="text-[34px]" />
          <p className="mt-4 max-w-[30ch] text-[15px] text-muted">{site.metaLine}</p>
        </div>
        <div>
          <p className="label">Say hello</p>
          <ul className="mt-3 text-[15px]">
            <li>{filled(site.email) ? <a className="link-underline inline-flex min-h-11 items-center" href={`mailto:${site.email}`}>{site.email}</a> : <TransitionLink className="link-underline inline-flex min-h-11 items-center" href="/contact">Send a message</TransitionLink>}</li>
            {filled(site.whatsapp) && <li><a className="link-underline inline-flex min-h-11 items-center gap-2" href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><WhatsAppIcon className="h-4 w-4" />WhatsApp</a></li>}
          </ul>
        </div>
        <div>
          <p className="label">Explore</p>
          <ul className="mt-3 text-[15px]">
            {[...site.nav, { label: "Contact", href: "/contact" }].map((n) => <li key={n.href}><TransitionLink className="link-underline inline-flex min-h-11 items-center" href={n.href}>{n.label}</TransitionLink></li>)}
            <li><button className="link-underline inline-flex min-h-11 items-center" onClick={() => dispatchEvent(new Event("about-pattern"))}>About the pattern</button></li>
          </ul>
        </div>
        <div>
          <p className="label">Follow</p>
          <SocialIcons className="mt-4" />
        </div>
      </div>
      {/* the loom: cloth pulled slowly sideways */}
      <div className="loom-track h-14 w-full overflow-hidden opacity-90" aria-hidden>
        <div className="loom-strip flex h-full w-[200%]">
          <div className="band-breeze h-full w-1/2 bg-[length:auto_100%] bg-repeat-x" style={{ backgroundImage: band }} />
          <div className="band-breeze h-full w-1/2 bg-[length:auto_100%] bg-repeat-x" style={{ backgroundImage: band }} />
        </div>
      </div>
      <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-2 px-[clamp(16px,4vw,48px)] py-6 text-[13px] text-muted sm:flex-row">
        <p>© 2026 HiNacho. <span className="transition-colors duration-300 hover:text-danfo">Made in Lagos.</span></p>
        <p>{day ? <>Pattern of the day · {day.label} · </> : null}Press <kbd className="rounded bg-cotton/10 px-1.5 text-cotton">A</kbd> to dye your own</p>
      </div>
    </footer>
  );
}
