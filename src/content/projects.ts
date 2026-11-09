// All project content. Case-study copy is DRAFT, written from the one-line
// briefs only; edit freely. Never add results/numbers that didn't happen.
import manifest from "./media-manifest.json";
// Anything in [SQUARE BRACKETS] is a placeholder and is hidden on the site until filled.

export type ProjectType = "Web" | "Web & Motion" | "Web & E-commerce" | "E-commerce" | "Web App";
export type Status = "Concept" | "Client";

/** A case-study feature. `image` overrides the default still/poster for that feature. */
export type Feature = { title: string; body: string; image?: { webp: string; jpg: string; width: number; height: number; alt: string } };

export type Project = {
  slug: string;
  name: string;
  type: ProjectType;
  oneLiner: string;
  /** DRAFT hover line for Selected work: what the site does (no invented results). Edit freely. */
  hoverLine: string;
  stack: string[];          // DRAFT, inferred from the brief; confirm
  year: string;             // "[YEAR]" = hidden
  liveUrl: string;          // "#" = hidden
  status: Status | "[CLIENT or CONCEPT]";
  seed: string;             // adire pattern seed
  category?: string;        // shown in the case-study overview, e.g. "EdTech SaaS"
  client?: string;          // shown in the case-study overview
  market?: string;
  /** visible placeholder card on the case study until a real testimonial is added */
  testimonialPlaceholder?: string;
  /** Newly launched projects: replaces "Results & learnings" with "Launch & what's next". */
  launch?: { headline: string; body: string; learning: string };
  role: string;
  media: { video: string; webm?: string; poster: string; stills: string[] };
  draft: { challenge: string; approach: string; features: Feature[]; learnings: string };
};

const media = (slug: string, stills = 1) => ({
  video: `/media/projects/${slug}/showcase.mp4`,
  webm: (manifest.webm as string[]).includes(slug) ? `/media/projects/${slug}/showcase.webm` : undefined,
  poster: `/media/projects/${slug}/poster`,
  stills: Array.from({ length: stills }, (_, i) => `/media/projects/${slug}/still-${i + 1}`),
});

export const projects: Project[] = [
  {
    slug: "halcyon", name: "Halcyon Residences", type: "Web & Motion", status: "Concept", year: "[YEAR]", liveUrl: "#", seed: "halcyon",
    oneLiner: "A scroll-scrubbed 3D flythrough for a luxury residential tower.",
    hoverLine: "Scroll becomes the lift: buyers explore the tower floor by floor.", // DRAFT
    stack: ["Next.js", "Three.js", "GSAP ScrollTrigger"], role: "Design, 3D direction, development",
    media: media("halcyon", 2),
    draft: {
      challenge: "Luxury towers are sold before they exist. Renders on a static page feel flat, and buyers can't sense height, light or arrival.",
      approach: "Let the scroll be the lift. Each section of the page is a floor of the journey, scrubbed frame-by-frame, so the visitor controls the pace of the flythrough.",
      features: [
        { title: "Scroll-scrubbed flythrough", body: "The camera path is tied to scroll position, so the tower is explored, not watched." },
        { title: "Calm, editorial layout", body: "Copy stays short and sits in the negative space of each frame." },
      ],
      learnings: "Scrubbed video and 3D need careful loading: posters first, frames streamed in, and a lighter path on mobile.",
    },
  },
  {
    slug: "noto", name: "Noto Nature Park", type: "Web & Motion", status: "Concept", year: "[YEAR]", liveUrl: "#", seed: "noto",
    oneLiner: "An illustrated night-to-dawn parallax journey with lantern-lit scenes.",
    hoverLine: "One night in the park, told from dusk to first light.", // DRAFT
    stack: ["Next.js", "GSAP", "Lenis"], role: "Design, illustration direction, development",
    media: media("noto"),
    draft: {
      challenge: "A nature park is felt, not read. A list of trails and opening hours doesn't make anyone want to visit.",
      approach: "Tell one night in the park as you scroll: dusk to lanterns to dawn, with layered illustrations moving at different depths.",
      features: [
        { title: "Night-to-dawn timeline", body: "Colour and light shift with scroll progress, from deep night to first light." },
        { title: "Layered parallax scenes", body: "Foreground, midground and sky drift at different speeds for real depth." },
      ],
      learnings: "Parallax works best with few, well-separated layers, and every layer has to earn its weight in kilobytes.",
    },
  },
  {
    slug: "helio", name: "helio", type: "Web & E-commerce", status: "Concept", year: "[YEAR]", liveUrl: "#", seed: "helio",
    oneLiner: "A colour-switching flavour hero for an iced-coffee brand.",
    hoverLine: "Pick a flavour and the whole page changes with it.", // DRAFT
    stack: ["Next.js", "GSAP", "Tailwind CSS"], role: "Design, motion, development",
    media: media("helio"),
    draft: {
      challenge: "Several flavours, one hero. Most shops make visitors scroll a grid to see the range.",
      approach: "Make the hero itself the flavour picker: switching a flavour changes the can, the colour of the whole page and the copy in one smooth move.",
      features: [
        { title: "Flavour-switching hero", body: "Each flavour re-themes the page, so choosing feels like tasting." },
        { title: "Shop-ready structure", body: "Product details and add-to-cart sit right under the hero." },
      ],
      learnings: "Theme switches feel premium when colour, product and type move together on one easing curve.",
    },
  },
  {
    // Client project. All copy below is DRAFT, paraphrased from the brief; edit freely.
    slug: "operon", name: "Operon", type: "Web App", status: "Client", year: "2026", liveUrl: "https://operon.com.ng", seed: "operon",
    category: "EdTech SaaS", client: "Operon", market: "Lagos, Nigeria",
    oneLiner: "An AI-powered school management and financial automation platform. Results, attendance, fees and parent communication in one system.",
    hoverLine: "Results, attendance, fees and messages, all in one place for every school.", // DRAFT
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Netlify", "[Backend / database: confirm]", "[PDF generation: confirm]", "[AI layer: confirm]"],
    role: "[Role, e.g. Design & development: confirm]",
    testimonialPlaceholder: "[Testimonial from Operon, add when received]",
    media: media("operon", 2),
    draft: {
      challenge: "Many schools run results, attendance, fees and parent updates across separate spreadsheets, paper records and chat groups. Term-end reporting is slow, and parents see little of their child's progress until report day.",
      approach: "One platform for the whole school. Results, attendance, fees and messaging share the same student records, so information entered once flows into report cards, invoices and the parent portal. It was built multi-school from the start: every school's data stays separate, and grading rules can be set per school.",
      features: [
        { title: "Result Compiler", body: "Collects subject scores, ranks students, works out averages and produces PDF report cards." },
        { title: "Parent Portal", body: "Parents follow attendance, results and progress, and download reports once they're released." },
        { title: "Attendance Tracking", body: "Daily registers with live statistics and reports." },
        { title: "Fees Management", body: "Fee structures, invoices, payment tracking, outstanding balances and receipts." },
        { title: "Student & Teacher Management", body: "Profiles, classes, promotions and academic history for students; subjects and workload for teachers." },
        { title: "Messaging", body: "In-app messages and announcements between the school, parents, teachers and students." },
        { title: "Multi-school Architecture", body: "Each school's data is isolated, with grading systems configurable from primary through secondary." },
        { title: "AI Analytics", body: "Predictive insights that flag learning bottlenecks early, plus generated progress reports." },
      ],
      learnings: "", // no results yet: see `launch` below
    },
    launch: {
      headline: "Live since 2026, and now meeting its first schools.",
      body: "Operon has just launched in Lagos. The focus now is onboarding the first schools and learning how they grade, report and collect fees, so the system keeps adapting to real classrooms rather than a fixed template.",
      learning: "One thing the build made clear: school software only sticks if it fits how each school already grades and reports, which is why grading rules are configurable per school.",
    },
  },
  {
    slug: "atelier-eko", name: "Atelier Eko", type: "E-commerce", status: "Concept", year: "[YEAR]", liveUrl: "#", seed: "atelier-eko",
    oneLiner: "A \"Try the Look\" shop-by-outfit fashion experience.",
    hoverLine: "Shop the outfit, not the item: every look is its own page.", // DRAFT
    stack: ["Next.js", "Tailwind CSS", "GSAP"], role: "Design, UX, development",
    media: media("atelier-eko"),
    draft: {
      challenge: "Fashion shoppers buy outfits, but most shops sell single items in endless grids.",
      approach: "Shop by look: every outfit is a page, and each piece in it can be explored and added without leaving the look.",
      features: [
        { title: "Try the Look", body: "Tap any piece in an outfit to see it, size it and add it." },
        { title: "Editorial product pages", body: "Lookbook-style layouts that still behave like a shop." },
      ],
      learnings: "Shop-by-outfit needs very clear add-to-cart feedback, because the page is busy with product by nature.",
    },
  },
  {
    slug: "aquaro", name: "Aquaro", type: "Web & Motion", status: "Concept", year: "[YEAR]", liveUrl: "#", seed: "aquaro",
    oneLiner: "A premium scroll-driven product launch.",
    hoverLine: "One product, explained chapter by chapter as you scroll.", // DRAFT
    stack: ["Next.js", "GSAP ScrollTrigger", "Lenis"], role: "Design, motion, development",
    media: media("aquaro"),
    draft: {
      challenge: "A new product with no awareness yet needs to explain itself and feel premium in one visit.",
      approach: "One object, one story: the product stays centre-stage while scroll reveals how it works, what it's made of and why it matters.",
      features: [
        { title: "Scroll-driven product story", body: "Pinned sections assemble and explain the product step by step." },
        { title: "Launch-ready CTA flow", body: "Every chapter ends close to the action." },
      ],
      learnings: "Pinning is powerful in small doses; two or three pinned moments carry the whole page.",
    },
  },
  {
    slug: "aunty-alice", name: "Aunty Alice College", type: "Web", status: "Client", year: "[YEAR]", liveUrl: "#", seed: "aunty-alice",
    oneLiner: "A clear, welcoming website for a college.", // DRAFT one-liner
    hoverLine: "Admissions, fees and contact, one tap from the home page.", // DRAFT
    stack: ["[CONFIRM STACK]"], role: "Design, development",
    media: media("aunty-alice"),
    draft: {
      challenge: "Parents and students need answers fast: admissions, fees, contact, what the school is like.",
      approach: "A calm, well-organised site with the key journeys one tap away, built to be easy for the school to keep up to date.",
      features: [
        { title: "Admissions-first navigation", body: "The questions parents ask most are answered from the home page." },
        { title: "Mobile-first", body: "Designed for the phones most parents will use.",
          image: { webp: "/media/projects/aunty-alice/mobile-trio.webp", jpg: "/media/projects/aunty-alice/mobile-trio.jpg", width: 1600, height: 1000,
            alt: "Three phone screens of the Aunty Alice College website: philosophy, home and admissions." } },
      ],
      learnings: "[DRAFT: add what you learned working with the school]",
    },
  },
  {
    slug: "mcroyal", name: "McRoyal Schools", type: "Web", status: "[CLIENT or CONCEPT]", year: "[YEAR]", liveUrl: "#", seed: "mcroyal",
    oneLiner: "One website for a nursery, primary and college.", // DRAFT one-liner
    hoverLine: "Three schools, one site: every parent lands in the right place.", // DRAFT
    stack: ["[CONFIRM STACK]"], role: "Design, development",
    media: media("mcroyal"),
    draft: {
      challenge: "Three schools under one name, each with different parents and different questions.",
      approach: "A shared home with a clear path into each school, so every parent lands in the right place in one click.",
      features: [
        { title: "Three schools, one site", body: "Nursery, primary and college each get their own section and voice." },
        { title: "Simple to update", body: "Structured so news and admissions info stay current." },
      ],
      learnings: "[DRAFT: add what you learned]",
    },
  },
];

export const isFilled = (v?: string) => !!v && v !== "#" && !v.startsWith("[");
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const nextProject = (slug: string) => projects[(projects.findIndex((p) => p.slug === slug) + 1) % projects.length];
