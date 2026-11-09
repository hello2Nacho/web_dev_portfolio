"use client";
// Availability line for the nav and mobile menu. Server + first client render show a neutral
// placeholder; the real text is computed from the visitor's local date after hydration.
import { useEffect, useState } from "react";
import { SITE_CONFIG } from "@/content/site.config.ts";
import { availabilityFor, AVAILABILITY_PLACEHOLDER, type Availability as A } from "@/lib/availability.ts";
import TransitionLink from "@/components/ui/TransitionLink.tsx";

export default function Availability({ className = "", onNavigate }: { className?: string; onNavigate?: () => void }) {
  const [a, setA] = useState<A>(AVAILABILITY_PLACEHOLDER);
  useEffect(() => {
    setA(availabilityFor(SITE_CONFIG.availability, new Date()));
  }, []);

  const dot = a.booked
    ? <span className="relative inline-flex h-2 w-2 rounded-full bg-muted" aria-hidden />
    : <span className="relative inline-flex h-2 w-2" aria-hidden><span className="absolute inset-0 animate-ping rounded-full bg-danfo opacity-60" /><span className="relative h-2 w-2 rounded-full bg-danfo" /></span>;
  const body = <>{dot}<span>{a.text}</span></>;
  // display (hidden / inline-flex / flex) comes from the caller so it can be responsive
  const cls = `items-center gap-2 ${className}`;

  return a.href
    ? <TransitionLink href={a.href} onClick={onNavigate} className={`${cls} link-underline min-h-11`}>{body}</TransitionLink>
    : <span className={cls} aria-live="polite">{body}</span>;
}
