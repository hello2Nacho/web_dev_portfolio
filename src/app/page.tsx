import Hero from "@/components/home/Hero.tsx";
import Marquee from "@/components/home/Marquee.tsx";
import AboutTeaser from "@/components/home/AboutTeaser.tsx";
import Loom from "@/components/home/Loom.tsx";
import SelectedWork from "@/components/home/SelectedWork.tsx";
import Process from "@/components/home/Process.tsx";
import Proof from "@/components/home/Proof.tsx";
import GlobeCTA from "@/components/home/GlobeCTA.tsx";
import StatementMark from "@/components/sections/StatementMark.tsx";
import Divider from "@/components/cloth/Divider.tsx";
import TrustedBy from "@/components/home/TrustedBy.tsx";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <AboutTeaser />
      <Divider />
      <Loom />
      <SelectedWork />
      <Divider src="/patterns/halcyon-band.webp" />
      <Process />
      <TrustedBy />
      <Proof />
      <StatementMark />
      <GlobeCTA />
    </>
  );
}
