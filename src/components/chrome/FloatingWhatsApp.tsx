"use client";
// Mobile-only floating WhatsApp button: bottom-right, clear of the iPhone home indicator,
// hidden while the contact form or footer is on screen (so it never covers them).
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SITE_CONFIG, has, whatsappLink } from "@/content/site.config.ts";
import { WhatsAppIcon } from "@/components/ui/SocialIcons.tsx";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [hide, setHide] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // appear after a short scroll so it doesn't crowd the first screen
    const on = () => setShown(scrollY > 240);
    on(); addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    setHide(false);
    let io: IntersectionObserver | null = null;
    // hide while the contact form or the footer (which has its own WhatsApp link) is on screen
    const t = setTimeout(() => {
      const targets = [document.getElementById("contact-form"), document.querySelector("footer")].filter(Boolean) as Element[];
      const seen = new Set<Element>();
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
        setHide(seen.size > 0);
      }, { threshold: 0.05 });
      targets.forEach((el) => io!.observe(el));
    }, 200);
    return () => { clearTimeout(t); io?.disconnect(); };
  }, [pathname]);

  if (!has(SITE_CONFIG.whatsapp)) return null;
  const visible = shown && !hide;
  return (
    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
      tabIndex={visible ? 0 : -1} aria-hidden={!visible}
      className={`fixed right-4 z-[75] grid h-14 w-14 place-items-center rounded-full border border-cotton/15 bg-ink/90 text-[#25D366] shadow-[0_12px_30px_-8px_rgba(4,10,26,0.9)] backdrop-blur transition-[opacity,transform] duration-500 ease-dye md:hidden ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      style={{ bottom: "max(16px, calc(env(safe-area-inset-bottom) + 12px))", right: "max(16px, calc(env(safe-area-inset-right) + 12px))" }}>
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
