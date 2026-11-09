import type { Metadata } from "next";
import { site, filled } from "@/content/site.ts";
import { RevealLines } from "@/components/motion/Reveal.tsx";
import ContactForm from "@/components/contact/ContactForm.tsx";
import Button from "@/components/ui/Button.tsx";
import SocialIcons, { WhatsAppIcon } from "@/components/ui/SocialIcons.tsx";
import { whatsappLink } from "@/content/site.config.ts";

export const metadata: Metadata = { title: "Contact", description: "Start a project with HiNacho. Book a call or send a message; replies within 24 hours." };

export default function Contact() {
  return (
    <section className="mx-auto grid min-h-screen max-w-[1320px] gap-12 px-[clamp(16px,4vw,48px)] pb-32 pt-36 md:grid-cols-[0.8fr_1.2fr] md:pt-44">
      <div>
        <p className="label">Contact</p>
        <RevealLines as="h1" immediate className="mt-4 font-display text-[clamp(3rem,6.5vw,6rem)] font-semibold leading-[0.95] tracking-[-0.035em]" lines={["Let's do", "something", "proper."]} />
        <p className="mt-6 max-w-[34ch] text-[17px] text-cotton/85">Tell me about your project, or book a 30-minute call. I reply within 24 hours.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {filled(site.calendly) ? <Button href={site.calendly} external magnetic>Book a call</Button> : <span className="rounded-full border border-dashed border-cotton/30 px-5 py-3 text-[13px] text-muted">Calendly link coming soon</span>}
          {filled(site.whatsapp) && (
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
              className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-cotton/30 px-6 text-[15px] font-medium text-cotton transition-colors duration-300 hover:border-terracotta/60 hover:text-terracotta">
              <WhatsAppIcon className="h-[18px] w-[18px]" />Chat on WhatsApp
            </a>
          )}
        </div>
        <div className="mt-10">
          <p className="label">Follow</p>
          <SocialIcons className="mt-4" whatsapp />
        </div>
      </div>
      <ContactForm />
    </section>
  );
}
