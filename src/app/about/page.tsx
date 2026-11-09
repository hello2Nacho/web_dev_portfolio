import type { Metadata } from "next";
import { siNextdotjs, siReact, siTypescript, siTailwindcss, siGreensock, siThreedotjs, siFigma } from "simple-icons";
import { RevealLines, Reveal } from "@/components/motion/Reveal.tsx";
import Placeholder from "@/components/ui/Placeholder.tsx";
import FramedPortrait from "@/components/about/FramedPortrait.tsx";
import AtWorkBand from "@/components/about/AtWorkBand.tsx";
import Picture from "@/components/ui/Picture.tsx";
import Divider from "@/components/cloth/Divider.tsx";
import Button from "@/components/ui/Button.tsx";
import DrawOn from "@/components/motion/DrawOn.tsx";
import Motif from "@/components/ui/Motif.tsx";
import { SITE_CONFIG, has } from "@/content/site.config.ts";

export const metadata: Metadata = { title: "About", description: "Victor, a web designer and developer in Lagos, and why this site is dyed like adire cloth." };

// [CONFIRM STACK] edit to match what you actually use
const stack = [siNextdotjs, siReact, siTypescript, siTailwindcss, siGreensock, siThreedotjs, siFigma];
const how = [
  { t: "Small and direct", b: "You work with me, not an account manager." },
  { t: "Motion with a reason", b: "Every animation explains something or adds depth." },
  { t: "Fast by default", b: "Performance budgets set before design starts." },
  { t: "Yours to keep", b: "Clean code, documented handover, no lock-in." },
];
const mood = [
  { base: "/media/adire/panels-1", alt: "Hanging indigo cloth panels (digital texture)" },
  { base: "/media/adire/stack-1", alt: "Folded indigo cloth by a window (digital texture)" },
  { base: "/media/adire/detail-1", alt: "Macro of spirals and dots (digital texture)" },
];

export default function About() {
  const { portrait, atWork } = SITE_CONFIG.portraits;
  return (
    <>
      <section className="relative isolate mx-auto grid max-w-[1320px] gap-12 px-[clamp(16px,4vw,48px)] pb-24 pt-32 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-16 md:pt-44">
        <div>
          <p className="label">About</p>
          <RevealLines as="h1" immediate className="mt-4 font-display text-[clamp(3rem,7vw,6.6rem)] font-semibold leading-[0.95] tracking-[-0.035em]" lines={["Plain cloth in.", "Something", "proper out."]} />
          <Reveal className="mt-10 max-w-[52ch] space-y-6 text-[17px] leading-relaxed text-cotton/85">
            <p>I&apos;m Victor, the creative mind behind HiNacho, based in Lagos, Nigeria. I blend design, code, and an obsession with the little details to create websites that look good, feel right, and work beautifully.</p>
            <p className="border-l-2 border-terracotta pl-5 font-display text-[clamp(1.25rem,1.8vw,1.6rem)] font-semibold leading-snug tracking-[-0.01em] text-cotton text-balance lg:whitespace-nowrap">Good ideas. Thoughtful design. Properly built.</p>
          </Reveal>
        </div>
        <div className="order-first md:order-none">
          {has(portrait) ? <FramedPortrait base={portrait} alt="Portrait of Victor, smiling, wearing round glasses" />
            : <Placeholder seed="portrait" label="Portrait coming soon" note="me/portrait.jpg · 4:5" className="aspect-[4/5] w-full rounded-[28px]" />}
        </div>
      </section>

      {/* The HiNacho Way: a compact signature statement */}
      <section aria-labelledby="hinacho-way" className="mx-auto max-w-[1320px] px-[clamp(16px,4vw,48px)] pb-24 md:pb-32">
        <div className="relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-[#081128] px-7 py-12 md:px-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <h2 id="hinacho-way" className="label">The HiNacho Way</h2>
              <RevealLines as="p" className="mt-6 font-display text-[clamp(2rem,4.2vw,4.25rem)] font-extrabold md:whitespace-nowrap leading-[0.98] tracking-[-0.035em]"
                lines={[<span key="a" className="text-cotton">Good design is felt.</span>, <span key="b" className="text-terracotta">Good code makes it work.</span>]} />
            </div>
            <Reveal className="md:max-w-[22ch] md:pb-3"><p className="text-[17px] leading-relaxed text-muted">I believe the best websites do both.</p></Reveal>
          </div>
        </div>
      </section>

      <Divider />

      <section className="mx-auto max-w-[1320px] px-[clamp(16px,4vw,48px)] py-24 md:py-32">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="label">Why adire</p>
            <RevealLines as="h2" className="mt-4 font-display text-[clamp(2.2rem,4.5vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.03em]" lines={["Resist, dip,", "reveal."]} />
          </div>
          <Reveal className="space-y-4 text-[17px] leading-relaxed text-cotton/85">
            <p>Adire eleko is the indigo cloth of the Yoruba. Designs are painted onto cotton in starch, the cloth is dyed, and when the starch washes out the pattern is revealed.</p>
            <p>That is how I think about websites: plan carefully, protect what matters, then let the work reveal itself. The patterns on this site are generated in code, my own digital tribute, not a copy of any real cloth.</p>
            <DrawOn className="flex gap-4 pt-2 text-terracotta"><Motif family="spirals" className="h-12 w-12" /><Motif family="cowrie" className="h-12 w-12" /><Motif family="dotRings" className="h-12 w-12" /></DrawOn>
          </Reveal>
        </div>
        <Reveal className="mt-14 grid gap-4 md:grid-cols-3">
          {mood.map((m) => (
            <figure key={m.base} className="overflow-hidden rounded-[24px] bg-indigo">
              <Picture base={m.base} widths={[800, 1600]} alt={m.alt} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/5] w-full object-cover" />
              <figcaption className="px-5 py-3 text-[12px] text-muted">Digital texture, inspired by adire</figcaption>
            </figure>
          ))}
        </Reveal>
      </section>

      <section className="bg-indigo py-24 md:py-32">
        <div className="mx-auto grid max-w-[1320px] gap-14 px-[clamp(16px,4vw,48px)] md:grid-cols-2">
          <div>
            <p className="label">Tools</p>
            <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {stack.map((s) => (
                <li key={s.slug} className="flex flex-col items-center gap-3 rounded-[20px] border border-[var(--line)] bg-ink p-5 text-center">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#EAE7DA" role="img" aria-label={s.title}><path d={s.path} /></svg>
                  <span className="text-[12px] text-muted">{s.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label">How I work</p>
            <ol className="mt-6 space-y-6">
              {how.map((h, i) => <li key={h.t} className="flex gap-5 border-b border-[var(--line)] pb-6"><span className="font-display text-[15px] text-muted">0{i + 1}</span><span><b className="font-display text-xl font-semibold">{h.t}</b><span className="mt-1 block text-[15px] text-muted">{h.b}</span></span></li>)}
            </ol>
          </div>
        </div>
      </section>

      {has(atWork) ? <AtWorkBand base={atWork} /> : (
        <section className="relative overflow-hidden">
          <Placeholder seed="at-work" label="At-work photo coming soon" note="me/at-work.jpg · landscape" className="aspect-[16/9] w-full md:aspect-[21/9]" />
          <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-ink to-transparent pb-12 pt-24"><Button href="/contact" magnetic>Book a call</Button></div>
        </section>
      )}
    </>
  );
}
