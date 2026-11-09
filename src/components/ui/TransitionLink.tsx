"use client";
// Link that plays the indigo dye wipe before navigating.
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { forwardRef } from "react";
import { prefersReducedMotion } from "@/lib/perf.ts";

type Props = React.ComponentProps<typeof Link> & { href: string };

const TransitionLink = forwardRef<HTMLAnchorElement, Props>(function TL({ href, onClick, ...rest }, ref) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Link ref={ref} href={href} {...rest} onClick={(e) => {
      onClick?.(e);
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || href.includes("#") || href === pathname || prefersReducedMotion()) return;
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("dye:out", { detail: () => router.push(href) }));
    }} />
  );
});
export default TransitionLink;
