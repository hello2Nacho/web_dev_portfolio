// Nav availability text. Pure + date-injectable so it can be tested; the UI calls it in the browser
// with the visitor's local date after hydration.
import { SITE_CONFIG } from "@/content/site.config.ts";

export type Availability = { text: string; booked: boolean; href?: string };
type Cfg = typeof SITE_CONFIG.availability;

/** Neutral text rendered on the server and before hydration (no date involved). */
export const AVAILABILITY_PLACEHOLDER: Availability = { text: "Booking projects", booked: false };

export function availabilityFor(cfg: Cfg, now: Date, locale = "en-GB"): Availability {
  if (cfg.mode === "booked") return { text: "Fully booked: join the waitlist", booked: true, href: "/contact" };
  if (cfg.mode === "custom") return { text: cfg.customText, booked: false };
  // auto: current month + leadMonths (Date handles the year rollover, e.g. Dec + 1 → Jan)
  const target = new Date(now.getFullYear(), now.getMonth() + Math.max(0, cfg.leadMonths), 1);
  return { text: `Booking projects for ${target.toLocaleString(locale, { month: "long" })}`, booked: false };
}
