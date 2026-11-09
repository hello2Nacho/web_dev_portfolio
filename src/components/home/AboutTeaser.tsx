"use client";
// f) About band. With a hero portrait: the photo covers the right of the band (md+), its left
// edge dissolving into the indigo background; on mobile it sits above the text, cropped to the face.
// Without one: the labelled placeholder panel. Face framing (object-position) lives in globals.css: .about-portrait.
import { useRef } from "react";
import { site } from "@/content/site.ts";
import { gsap, useGSAP } from "@/lib/motion.ts";
import { prefersReducedMotion } from "@/lib/perf.ts";
import { RevealLines } from "@/components/motion/Reveal.tsx";
import TransitionLink from "@/components/ui/TransitionLink.tsx";
import Placeholder from "@/components/ui/Placeholder.tsx";
import Picture from "@/components/ui/Picture.tsx";
import { SITE_CONFIG, has } from "@/content/site.config.ts";

function Copy() {
  return (
    <div className="max-w-[520px]">
      <p className="label">About</p>
      <RevealLines as="h2" className="mt-4 font-display text-[clamp(2.2rem,4.6vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.03em]" lines={["One designer.", "Every thread."]} />
      <p className="mt-6 text-[17px] leading-relaxed text-cotton/85">{site.aboutTeaser.replace(/\s*\[[^\]]+\]/, "")}</p>
      <TransitionLink href="/about" className="link-underline mt-8 inline-flex min-h-11 items-center gap-2 text-[15px] font-medium">More about me <span aria-hidden>→</span></TransitionLink>
    </div>
  );
}

export default function AboutTeaser() {
  const hero = SITE_CONFIG.portraits.hero;
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    // slow parallax + zoom on the photo only (its fade mask stays put)
    gsap.fromTo("[data-zoom]", { scale: 1.06, yPercent: 0, transformOrigin: "50% 0%" }, { scale: 1, yPercent: 3, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } });
  }, { scope: ref });

  if (!has(hero)) {
    return (
      <section ref={ref} className="relative isolate flex min-h-[78vh] items-center overflow-hidden md:aspect-[21/9] md:min-h-0">
        <div data-zoom className="absolute inset-0 -z-10">
          <Placeholder seed="portrait-hero" label="Portrait coming soon" note="me/portrait-hero.jpg · landscape, open space on the left" className="h-full w-full md:ml-auto md:w-[62%]" align="right" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink from-35% via-ink/85 via-55% to-ink/20" aria-hidden />
        <div className="mx-auto w-full max-w-[1320px] px-[clamp(16px,4vw,48px)] py-24"><Copy /></div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-ink lg:flex lg:h-[clamp(540px,44vw,780px)] lg:items-center">
      {/* Photo: below lg = block above the text; lg+ = covers the right ~66% of the band */}
      <div className="about-portrait relative aspect-[5/4] w-full overflow-hidden sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:-z-10 lg:aspect-auto lg:w-[66%]">
        <div data-zoom className="absolute inset-x-0 bottom-[6%] top-[20%] will-change-transform sm:top-[17%] lg:bottom-[8%] lg:top-[11%]">
          <Picture base={hero} widths={[800, 1600]} alt="Victor, smiling, in front of indigo adire-inspired cloth panels" sizes="(min-width: 1024px) 66vw, 100vw"
            width={1672} height={941} className="h-full w-full object-cover" />
        </div>
        <p className="absolute bottom-[30%] right-[clamp(16px,4vw,48px)] sm:bottom-[24%] text-[11px] font-medium uppercase tracking-[0.28em] text-cotton/60 sm:text-[12px] lg:bottom-10">Victor · Lagos</p>
      </div>
      <div className="relative mx-auto -mt-16 w-full max-w-[1320px] px-[clamp(16px,4vw,48px)] pb-20 lg:mt-0 lg:py-24"><Copy /></div>
    </section>
  );
}

