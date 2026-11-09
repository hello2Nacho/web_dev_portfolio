// k) 3D statement moment: the carved HN mark with the statement revealed line by line.
import HNMark from "@/components/three/HNMark.tsx";
import { RevealLines, Reveal } from "@/components/motion/Reveal.tsx";

export default function StatementMark({ capture = false }: { capture?: boolean }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink px-6 py-28 md:py-40">
      <div className="pointer-events-none absolute left-1/2 top-[42%] -z-10 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[90px]" style={{ background: "radial-gradient(circle, #D2643C 0%, transparent 70%)" }} />
      <div className="relative mx-auto max-w-[1440px]">
        <HNMark capture={capture} className="mx-auto aspect-[16/10] w-full max-w-[1280px] md:aspect-[16/8]" />
        <Reveal className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 justify-between px-[clamp(16px,3vw,40px)] md:flex" start="top 70%">
          <p className="text-[15px] font-medium uppercase tracking-[0.24em] text-cotton/75">Carved, not templated</p>
          <p className="text-[15px] font-medium uppercase tracking-[0.24em] text-cotton/75">By hand · Lagos</p>
        </Reveal>
      </div>
      <RevealLines as="h2" className="mx-auto -mt-4 max-w-[14ch] md:-mt-10 text-center font-display text-[clamp(2.5rem,6vw,6rem)] font-semibold leading-[0.98] tracking-[-0.03em]" lines={["Built to be", "remembered."]} />
    </section>
  );
}
