"use client";
// Non-critical, desktop-delight chrome: loaded after hydration in separate chunks.
import dynamic from "next/dynamic";
const DyeWipe = dynamic(() => import("./DyeWipe.tsx"), { ssr: false });
const Cursor = dynamic(() => import("./Cursor.tsx"), { ssr: false });
const CursorDye = dynamic(() => import("./CursorDye.tsx"), { ssr: false });
const Playground = dynamic(() => import("./Playground.tsx"), { ssr: false });
const AboutPattern = dynamic(() => import("./AboutPattern.tsx"), { ssr: false });
const FloatingWhatsApp = dynamic(() => import("./FloatingWhatsApp.tsx"), { ssr: false });
export default function Extras() {
  return (<><DyeWipe /><Cursor /><CursorDye /><Playground /><AboutPattern /><FloatingWhatsApp /></>);
}
