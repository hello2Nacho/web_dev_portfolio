import { SITE_CONFIG as C } from "./site.config.ts";

// Site-wide copy and placeholders. Anything in [SQUARE BRACKETS] is hidden until filled.

export const site = {
  name: "HiNacho",
  url: "https://hinacho.com", // [SITE_URL] confirm domain
  owner: "Victor", // placeholder copy, edit
  tagline: { before: "Every great site", line2: "starts as plain", key: "cloth", after: "." },
  metaLine: "Premium web experiences, dyed in Lagos.",
  // Contact + socials come from site.config.ts (empty = placeholder stays visible)
  calendly: C.calendly,
  email: C.email,
  whatsapp: C.whatsapp,
  socials: [
    { label: "Instagram", href: C.socials.instagram },
    { label: "TikTok", href: C.socials.tiktok },
  ],
  nav: [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/#services" },
  ],
  aboutTeaser:
    "I'm Victor, the creative mind and developer behind HiNacho, based in Lagos. I turn ideas into thoughtful digital experiences, blending design, code, and a little bit of obsession over the details.",
  services: [
    { key: "Design", line: "Identity-led layouts, type and art direction.", color: "#EAE7DA" },
    { key: "Build", line: "Fast Next.js sites, accessible by default.", color: "#8A97AE" },
    { key: "Motion", line: "Scroll stories, 3D and shaders with restraint.", color: "#C5B18D" },
    { key: "Launch", line: "SEO, performance, hosting and handover.", color: "#D2643C" },
  ],
  process: [
    { step: "Discover", line: "We talk goals, audience and what success looks like." },
    { step: "Design", line: "Direction, then pages, then motion, shared as we go." },
    { step: "Build", line: "Production code, tested on real phones every week." },
    { step: "Launch", line: "Go live, measure, refine. You own everything." },
  ],
  // Hidden until filled. First slots reserved for the school owners.
  testimonials: [
    { name: "[TESTIMONIAL NAME]", role: "[ROLE], Aunty Alice College", quote: "[TESTIMONIAL QUOTE]" },
    { name: "[TESTIMONIAL NAME]", role: "[ROLE], McRoyal Schools", quote: "[TESTIMONIAL QUOTE]" },
  ],
  stats: [
    { value: "[STAT NUMBER]", suffix: "", label: "[STAT LABEL]" },
    { value: "[STAT NUMBER]", suffix: "", label: "[STAT LABEL]" },
    { value: "[STAT NUMBER]", suffix: "", label: "[STAT LABEL]" },
  ],
  // Globe: placeholder cities, edit freely. [lat, lon]
  globe: {
    home: { name: "Lagos", loc: [6.5244, 3.3792] as [number, number] },
    cities: [
      { name: "[CITY] London", loc: [51.5072, -0.1276] as [number, number] },
      { name: "[CITY] New York", loc: [40.7128, -74.006] as [number, number] },
      { name: "[CITY] Toronto", loc: [43.6532, -79.3832] as [number, number] },
      { name: "[CITY] Dubai", loc: [25.2048, 55.2708] as [number, number] },
      { name: "[CITY] Nairobi", loc: [-1.2921, 36.8219] as [number, number] },
    ],
  },
  audio: { available: false }, // set true once assets/audio/* are added
  artisanCredit: "[ARTISAN CREDIT]",
};

export const filled = (v?: string) => !!v && v !== "#" && !v.startsWith("[");
/** Strip a "[CITY] " style marker for display while keeping the name visible. */
export const cityLabel = (s: string) => s.replace(/^\[[^\]]+\]\s*/, "");
