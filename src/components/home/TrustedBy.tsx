// j) Slim "Trusted by" line under Process: client projects as text links to their case studies.
import { projects } from "@/content/projects.ts";
import TransitionLink from "@/components/ui/TransitionLink.tsx";

const CLIENTS = ["operon"]; // add "aunty-alice", "mcroyal" back when ready

export default function TrustedBy() {
  const items = CLIENTS.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);
  return (
    <section aria-label="Trusted by" className="border-y border-[var(--line)] bg-ink">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-8 gap-y-3 px-[clamp(16px,4vw,48px)] py-7">
        <span className="label">Trusted by</span>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {items.map((p, i) => (
            <li key={p.slug} className="flex items-center gap-6">
              {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-cotton/30" />}
              <TransitionLink href={`/work/${p.slug}`} className="link-underline inline-flex min-h-11 items-center font-display text-[clamp(1.1rem,1.6vw,1.4rem)] font-semibold tracking-[-0.01em]">{p.name}</TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
