import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProject, nextProject, isFilled } from "@/content/projects.ts";
import { RevealLines, Reveal } from "@/components/motion/Reveal.tsx";
import CaseHero from "@/components/work/CaseHero.tsx";
import Picture from "@/components/ui/Picture.tsx";
import Divider from "@/components/cloth/Divider.tsx";
import TransitionLink from "@/components/ui/TransitionLink.tsx";
import Button from "@/components/ui/Button.tsx";

export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return { title: `${p.name} · ${p.type}`, description: `${p.oneLiner} A ${p.status === "Client" ? "client project" : "concept"} by HiNacho, Lagos.` };
}

// Testimonial placeholders stay out of the live page until a real quote exists.
const SHOW_TESTIMONIAL = false;

const Draft = () => <span className="ml-3 inline-block rounded-full border border-terracotta/50 px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-[0.14em] text-terracotta">Draft copy</span>;

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const next = nextProject(p.slug);
  const stack = p.stack.filter((s) => isFilled(s));
  const rail = [
    { k: "Client", v: p.client ?? "" },
    { k: "Category", v: p.category ?? "" },
    { k: "Role", v: p.role },
    { k: "Stack", v: stack.join(", ") },
    { k: "Year", v: isFilled(p.year) ? p.year : "" },
    { k: "Status", v: isFilled(p.status) ? p.status : "" },
  ].filter((r) => r.v);
  const stills = p.media.stills;
  // Long feature lists: the first features pair with the stills, the rest sit in a compact grid.
  const feats = p.draft.features;
  const imaged = feats.length > 4 ? feats.slice(0, Math.max(1, stills.length)) : feats;
  const gridded = feats.length > 4 ? feats.slice(imaged.length) : [];
  const liveLabel = isFilled(p.liveUrl) ? `Visit ${new URL(p.liveUrl).hostname.replace(/^www\./, "")}` : "";

  return (
    <article>
      {/* hero column: same width as the device frame; top padding = nav height + breathing room */}
      <header className="case-col scroll-mt-[var(--nav-h)] pb-8 pt-[calc(var(--nav-h)+28px)] md:pb-10 md:pt-[calc(var(--nav-h)+40px)]">
        <TransitionLink href="/work" className="label link-underline">← All work</TransitionLink>
        <RevealLines as="h1" immediate className="mt-5 font-display text-[clamp(44px,6vw,92px)] font-semibold leading-[1] tracking-[-0.045em] [overflow-wrap:anywhere]" lines={[p.name]} />
        <p className="mt-4 max-w-[55ch] text-[clamp(18px,1.6vw,24px)] leading-snug text-cotton/85">{p.oneLiner}</p>
      </header>
      <div className="case-col"><CaseHero p={p} /></div>

      <section className="mx-auto grid max-w-[1320px] gap-10 px-[clamp(16px,4vw,48px)] py-20 md:grid-cols-[1fr_2fr] md:py-28">
        <dl className="grid h-max grid-cols-2 gap-x-6 gap-y-5 rounded-[24px] border border-[var(--line)] bg-indigo p-7 md:grid-cols-1">
          {rail.map((r) => <div key={r.k}><dt className="label">{r.k}</dt><dd className="mt-1 text-[15px]">{r.v}</dd></div>)}
          {isFilled(p.liveUrl) && <div className="col-span-2 md:col-span-1"><Button href={p.liveUrl} external>{liveLabel}</Button></div>}
        </dl>
        <div className="space-y-14">
          <Reveal><p className="label">The challenge<Draft /></p><p className="mt-4 font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.02em]">{p.draft.challenge}</p></Reveal>
          <Reveal><p className="label">The approach</p><p className="mt-4 text-[clamp(1.05rem,1.3vw,1.25rem)] leading-relaxed text-cotton/85">{p.draft.approach}</p></Reveal>
        </div>
      </section>

      <Divider src={`/patterns/${p.slug}-band.webp`} />

      <section className="mx-auto max-w-[1320px] space-y-20 px-[clamp(16px,4vw,48px)] py-24 md:space-y-28 md:py-32">
        <h2 className="label">Key features</h2>
        {imaged.map((f, i) => (
          <div key={f.title} className="grid items-center gap-6 lg:grid-cols-12 lg:gap-8">
            {/* below lg: text first, then image; lg+: alternating sides */}
            <Reveal className={`overflow-hidden rounded-[24px] bg-indigo lg:col-span-8 ${i % 2 ? "lg:order-2" : ""}`} {...(f.image ? { y: 24, duration: 0.6, ease: "power2.out", reducedMotion: "none" as const } : {})}>
              {f.image ? (
                <picture>
                  <source type="image/webp" srcSet={f.image.webp} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.image.jpg} alt={f.image.alt} width={f.image.width} height={f.image.height} loading="lazy" decoding="async"
                    className="aspect-[16/9] h-full w-full object-cover object-center" />
                </picture>
              ) : stills[i] ? <Picture base={stills[i]} alt={`${p.name}: ${f.title}`} sizes="(min-width: 768px) 66vw, 100vw" className="h-full w-full object-cover" />
                : <Picture base={p.media.poster} widths={[800, 1280]} alt={`${p.name}: ${f.title}`} sizes="(min-width: 768px) 66vw, 100vw" className="h-full w-full object-cover" />}
            </Reveal>
            <Reveal className="order-first lg:order-none lg:col-span-4"><h3 className="font-display text-[clamp(1.6rem,2.4vw,2.2rem)] font-semibold leading-none tracking-[-0.02em]">{f.title}</h3><p className="mt-4 text-[16px] leading-relaxed text-muted">{f.body}</p></Reveal>
          </div>
        ))}
        {gridded.length > 0 && (
          <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gridded.map((f) => (
              <div key={f.title} className="rounded-[24px] border border-[var(--line)] bg-indigo p-7">
                <h3 className="font-display text-[clamp(1.3rem,1.8vw,1.6rem)] font-semibold leading-tight tracking-[-0.02em]">{f.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{f.body}</p>
              </div>
            ))}
          </Reveal>
        )}
      </section>

      {p.launch && (
        <section className="mx-auto max-w-[1320px] px-[clamp(16px,4vw,48px)] pb-24" aria-labelledby="launch-title">
          <Reveal className="rounded-[28px] border border-[var(--line)] bg-indigo p-8 md:p-14">
            <p className="label">Launch &amp; what&apos;s next</p>
            <h2 id="launch-title" className="mt-5 max-w-[24ch] font-display text-[clamp(26px,3vw,42px)] font-semibold leading-[1.1] tracking-[-0.02em]">{p.launch.headline}</h2>
            <p className="mt-6 max-w-[60ch] text-[clamp(22px,2.4vw,34px)] leading-[1.3] text-cotton/85">{p.launch.body}</p>
            <p className="mt-6 max-w-[60ch] border-l-2 border-terracotta pl-5 text-[clamp(17px,1.4vw,20px)] leading-relaxed text-muted">{p.launch.learning}</p>
            {/* TODO: add results when available (real numbers only), e.g. a row of stat cards here */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <span className="inline-flex items-center gap-2.5 text-[15px] font-medium">
                <span className="relative inline-flex h-2.5 w-2.5" aria-hidden><span className="absolute inset-0 animate-ping rounded-full bg-danfo opacity-60" /><span className="relative h-2.5 w-2.5 rounded-full bg-danfo" /></span>
                Live
              </span>
              {isFilled(p.liveUrl) && <Button href={p.liveUrl} external>{liveLabel}</Button>}
            </div>
          </Reveal>
        </section>
      )}

      {!p.launch && isFilled(p.draft.learnings) && (
        <section className="mx-auto max-w-[1320px] px-[clamp(16px,4vw,48px)] pb-24">
          <Reveal className="rounded-[28px] border border-[var(--line)] bg-indigo p-8 md:p-14">
            <p className="label">Results &amp; learnings<Draft /></p>
            <p className="mt-5 max-w-[46ch] font-display text-[clamp(1.5rem,2.4vw,2.2rem)] font-semibold leading-[1.15] tracking-[-0.02em]">{p.draft.learnings}</p>
          </Reveal>
        </section>
      )}

      {SHOW_TESTIMONIAL && p.testimonialPlaceholder && (
        <section className="mx-auto max-w-[1320px] px-[clamp(16px,4vw,48px)] pb-24" aria-label="Testimonial">
          <div className="rounded-[28px] border border-dashed border-cotton/25 p-8 text-center md:p-12">
            <p className="label">Testimonial</p>
            <p className="mt-4 text-[17px] text-muted">{p.testimonialPlaceholder}</p>
          </div>
        </section>
      )}

      <TransitionLink href={`/work/${next.slug}`} data-cursor="view" className="group relative block overflow-hidden border-t border-[var(--line)] bg-indigo">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 transition-opacity duration-700 group-hover:opacity-40" style={{ backgroundImage: `url(/patterns/${next.slug}.webp)` }} aria-hidden />
        <div className="relative mx-auto max-w-[1320px] px-[clamp(16px,4vw,48px)] py-24 md:py-32">
          <p className="label">Next project</p>
          <p className="mt-4 font-display text-[clamp(2.8rem,8vw,8rem)] font-semibold leading-[0.92] tracking-[-0.04em] transition-transform duration-700 ease-dye group-hover:translate-x-3">{next.name} <span aria-hidden className="text-terracotta">→</span></p>
        </div>
      </TransitionLink>
    </article>
  );
}
