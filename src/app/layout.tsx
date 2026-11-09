import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site.ts";
import MotionProvider from "@/components/motion/MotionProvider.tsx";
import Nav from "@/components/chrome/Nav.tsx";
import Footer from "@/components/chrome/Footer.tsx";
import Loader from "@/components/chrome/Loader.tsx";
import Extras from "@/components/chrome/Extras.tsx";

const display = Bricolage_Grotesque({ subsets: ["latin", "latin-ext", "vietnamese"], weight: ["600", "800"], variable: "--font-bricolage", display: "swap" });
const body = Inter({ subsets: ["latin", "latin-ext", "vietnamese"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "HiNacho · Every great site starts as plain cloth.", template: "%s · HiNacho" },
  description: `${site.metaLine} Web design, development and motion by Victor, a designer-developer in Lagos.`,
  openGraph: { type: "website", siteName: "HiNacho", locale: "en_NG" },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#0B1938", colorScheme: "dark", viewportFit: "cover" };

const personLd = {
  "@context": "https://schema.org", "@type": "Person", name: site.owner, url: site.url, jobTitle: "Web designer and developer",
  address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" }, brand: { "@type": "Brand", name: "HiNacho" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-navstyle="bar" className={`${display.variable} ${body.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-terracotta focus:px-4 focus:py-2 focus:text-ink">Skip to content</a>
        <MotionProvider>
          <Loader />
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <Extras />
        </MotionProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </body>
    </html>
  );
}
