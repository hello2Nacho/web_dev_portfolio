import type { Metadata } from "next";
import WorkIndex from "@/components/work/WorkIndex.tsx";
import { RevealLines } from "@/components/motion/Reveal.tsx";

export const metadata: Metadata = { title: "Work", description: "Selected websites, e-commerce and motion work by HiNacho, a web designer-developer in Lagos." };

export default function Work() {
  return (
    <section className="mx-auto min-h-screen max-w-[1320px] px-[clamp(16px,4vw,48px)] pb-32 pt-36 md:pt-44">
      <p className="label">Work</p>
      <RevealLines as="h1" immediate className="mt-4 font-display text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.95] tracking-[-0.035em]" lines={["The whole cloth."]} />
      <WorkIndex />
    </section>
  );
}
