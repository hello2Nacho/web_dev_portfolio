"use client";
// About page closing band: a full-width cinematic "at work" photo, graded toward the site's indigo,
// melting into the background at top and bottom. Desktop: "Book a call" sits over the dark middle.
// Mobile: cropped around the person, button below. Face framing + masks live in globals.css (.atwork-*).
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion.ts";
import { prefersReducedMotion } from "@/lib/perf.ts";
import Picture from "@/components/ui/Picture.tsx";
import Button from "@/components/ui/Button.tsx";

export default function AtWorkBand({ base }: { base: string }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    // slow parallax + zoom, anchored near the face so it never drifts out of frame
    gsap.fromTo("[data-atwork-zoom]", { scale: 1.08, yPercent: -3, transformOrigin: "78% 32%" }, {
      scale: 1, yPercent: 3, ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
    });
  }, { scope: ref });

  return (
    <>
    {/* background runs #152746 → #0B1938 → #152746 so the photo's fades meet the sections above and below (both #152746) with no seam */}
    <section ref={ref} aria-label="Work with me" className="relative isolate overflow-hidden bg-[linear-gradient(to_bottom,#152746_0%,#0B1938_22%,#0B1938_78%,#152746_100%)] pb-16 md:pb-0">
      <div className="atwork-frame atwork-mask relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/10] md:aspect-[2/1] lg:aspect-[21/9]">
        <div data-atwork-zoom className="absolute inset-0 will-change-transform">
          <Picture base={base} widths={[800, 1600]} alt="Victor working on a laptop at a wooden desk, lamp-lit, with indigo cloth beside him"
            sizes="100vw" width={1672} height={941} className="h-full w-full object-cover" />
          {/* indigo grade: cools and darkens everything except the face */}
          <span className="atwork-grade pointer-events-none absolute inset-0 bg-[#152746] mix-blend-multiply opacity-40" aria-hidden />
          <span className="atwork-grade pointer-events-none absolute inset-0 bg-[#152746] mix-blend-color opacity-20" aria-hidden />
        </div>
        {/* subtle dark pool behind the button (desktop) */}
        <span className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_26%_34%_at_38%_52%,rgba(11,25,56,0.75),transparent_75%)] md:block" aria-hidden />
        <div className="absolute left-[38%] top-[52%] hidden -translate-x-1/2 -translate-y-1/2 md:block">
          <Button href="/contact" magnetic>Book a call</Button>
        </div>
      </div>
      <div className="-mt-6 flex justify-center px-4 md:hidden">
        <Button href="/contact">Book a call</Button>
      </div>
    </section>
    </>
  );
}
