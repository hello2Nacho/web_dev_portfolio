// ─────────────────────────────────────────────────────────────
//  SITE_CONFIG: the one file to fill in.
//  Leave a value as "" (empty) to keep its placeholder visible.
//  Fill it and the real content replaces the placeholder automatically.
// ─────────────────────────────────────────────────────────────
export const SITE_CONFIG = {
  email: "hellotodickson@gmail.com",
  whatsapp: "2348138316164", // international format, no "+" or leading 0 (08138316164)
  whatsappMessage: "Hi Victor, I found you on HiNacho and I'd like to talk about a project.",
  calendly: "",              // e.g. "https://calendly.com/hinacho/30min"
  // Nav availability (next to the dot, also in the mobile menu)
  availability: {
    mode: "auto" as "auto" | "custom" | "booked", // auto = "Booking projects for {current month + leadMonths}"
    customText: "",          // shown exactly when mode is "custom"
    leadMonths: 1,           // how many months ahead "auto" books
  },
  // Full profile URLs. Empty = icon shows dimmed with a "Coming soon" tooltip and doesn't link.
  socials: {
    instagram: "",
    tiktok: "",
  },
  // Paths without extension; run `node scripts/media.mjs` after adding files to assets/me/
  portraits: {
    hero: "/media/me/portrait-hero",  // home About band, landscape
    portrait: "/media/me/portrait",  // About page, 4:5
    atWork: "/media/me/at-work",     // About page, landscape
  },
};

export const has = (v?: string) => typeof v === "string" && v.trim().length > 0;

/** wa.me link with the prefilled greeting. */
export const whatsappLink = () =>
  `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage).replace(/'/g, "%27")}`;
