// Labelled placeholder for missing media: an indigo panel with a generated pattern.
export default function Placeholder({ seed, label, note, className = "", align = "center" }: { seed: string; label: string; note?: string; className?: string; align?: "center" | "right" }) {
  return (
    <div className={`relative overflow-hidden bg-indigo ${className}`} role="img" aria-label={label}>
      <div className="absolute inset-0 bg-[url(/patterns/cloth-wide.webp)] bg-cover bg-center opacity-30" />
      <div className={`absolute inset-0 flex flex-col justify-center gap-2 p-8 ${align === "right" ? "items-end text-right md:pr-[8%]" : "items-center text-center"}`}>
        <span className="rounded-full bg-ink/85 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.16em] backdrop-blur">{label}</span>
        {note && <span className="rounded-full bg-ink/70 px-3 py-1 text-[11px] text-muted">{note}</span>}
      </div>
    </div>
  );
}
