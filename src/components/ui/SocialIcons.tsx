// Brand icons (simple-icons), monochrome cotton → terracotta on hover.
// Empty URL in SITE_CONFIG: icon stays visible but dimmed, with a "Coming soon" tooltip, and doesn't link.
import { siInstagram, siTiktok, siWhatsapp } from "simple-icons";
import { SITE_CONFIG, has, whatsappLink } from "@/content/site.config.ts";

type Icon = { title: string; path: string };
const Svg = ({ icon, className = "h-5 w-5" }: { icon: Icon; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d={icon.path} /></svg>
);

export const WhatsAppIcon = ({ className }: { className?: string }) => <Svg icon={siWhatsapp} className={className} />;

function Item({ icon, label, href, size }: { icon: Icon; label: string; href: string; size: string }) {
  const base = `grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] transition-colors duration-300`;
  if (!has(href))
    return (
      <span role="img" aria-label={`${label} (coming soon)`} title="Coming soon" className={`group relative ${base} cursor-default text-cotton/40`}>
        <Svg icon={icon} className={size} />
        <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-indigo px-2.5 py-1 text-[11px] text-cotton/80 opacity-0 transition-opacity duration-200 group-hover:opacity-100">Coming soon</span>
      </span>
    );
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={`${base} text-cotton hover:border-terracotta/50 hover:text-terracotta`}>
      <Svg icon={icon} className={size} />
    </a>
  );
}

export default function SocialIcons({ whatsapp = false, size = "h-5 w-5", className = "" }: { whatsapp?: boolean; size?: string; className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      <li><Item icon={siInstagram} label="Instagram" href={SITE_CONFIG.socials.instagram} size={size} /></li>
      <li><Item icon={siTiktok} label="TikTok" href={SITE_CONFIG.socials.tiktok} size={size} /></li>
      {whatsapp && has(SITE_CONFIG.whatsapp) && <li><Item icon={siWhatsapp} label="WhatsApp" href={whatsappLink()} size={size} /></li>}
    </ul>
  );
}
