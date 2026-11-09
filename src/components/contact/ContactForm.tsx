"use client";
// Contact form → Netlify Forms (form "contact", detected at build time via public/__forms.html).
// Submits with fetch (urlencoded) so the custom success state shows.
// On localhost (no Netlify Forms) it opens a prefilled email instead.
import { useState } from "react";
import { SITE_CONFIG } from "@/content/site.config.ts";

const budgets = ["Under ₦1m", "₦1m – ₦3m", "₦3m – ₦7m", "₦7m+", "Not sure yet"];
const types = ["Website", "Web & Motion", "E-commerce", "Landing page", "Something else"];
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL = SITE_CONFIG.email;
const isLocal = () => typeof window !== "undefined" && /^(localhost|127\.0\.0\.1|\[::1\]|.*\.local)$/.test(location.hostname);

function mailtoFrom(fd: FormData) {
  const subject = `Project enquiry from ${fd.get("name")} (${fd.get("type")})`;
  const body = [
    `Name: ${fd.get("name")}`,
    `Email: ${fd.get("email")}`,
    `Budget: ${fd.get("budget")}`,
    `Project type: ${fd.get("type")}`,
    "",
    String(fd.get("message")),
  ].join("\n");
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function EmailDirect() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked: the link still works */ }
  };
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px]">
      <span className="text-muted">Or email me directly:</span>
      <a href={`mailto:${EMAIL}`} className="link-underline inline-flex min-h-11 items-center break-all text-cotton">{EMAIL}</a>
      <button type="button" onClick={copy} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] px-4 text-[13px] text-cotton/80 transition-colors hover:border-cotton/40 hover:text-cotton"
        aria-label={copied ? "Email address copied" : "Copy email address"}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          {copied ? <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" /> : <><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M5 15V6.5A1.5 1.5 0 0 1 6.5 5H15" strokeLinecap="round" /></>}
        </svg>
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const err: Errors = {};
    if (!String(fd.get("name")).trim()) err.name = "Please add your name.";
    if (!/^\S+@\S+\.\S+$/.test(String(fd.get("email")))) err.email = "That email doesn't look right.";
    if (String(fd.get("message")).trim().length < 10) err.message = "A sentence or two about the project, please.";
    setErrors(err);
    if (Object.keys(err).length) return;

    // Local development: Netlify Forms isn't available, so hand off to the mail app.
    if (isLocal()) { location.href = mailtoFrom(fd); return; }

    setState("sending");
    try {
      const r = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(fd as unknown as Record<string, string>).toString(),
      });
      if (!r.ok) throw new Error(String(r.status));
      setState("done");
    } catch {
      setState("error");
    }
  };

  if (state === "done") return (
    <div id="contact-form" className="rounded-[28px] border border-[var(--line)] bg-indigo p-10 text-center" role="status">
      <p className="font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold tracking-[-0.03em]" lang="yo">Ẹ ṣé!</p>
      <p className="mt-3 text-[17px] text-cotton/85">I&apos;ll reply within 24 hours.</p>
    </div>
  );

  const field = "mt-2 w-full rounded-[14px] border border-[var(--line)] bg-ink px-4 py-3.5 text-[16px] text-cotton placeholder:text-muted/70 focus:border-terracotta focus:outline-none";
  return (
    <div id="contact-form">
      <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit} noValidate
        className="grid gap-5 rounded-[28px] border border-[var(--line)] bg-indigo p-6 md:grid-cols-2 md:p-10">
        <input type="hidden" name="form-name" value="contact" />
        <p className="hidden"><label>Don&apos;t fill this in: <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
        <label className="text-[14px]">Name<input name="name" autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby="e-name" /><span id="e-name" className="mt-1 block text-[13px] text-terracotta">{errors.name}</span></label>
        <label className="text-[14px]">Email<input name="email" type="email" autoComplete="email" className={field} aria-invalid={!!errors.email} aria-describedby="e-email" /><span id="e-email" className="mt-1 block text-[13px] text-terracotta">{errors.email}</span></label>
        <label className="text-[14px]">Budget<select name="budget" className={field} defaultValue={budgets[4]}>{budgets.map((b) => <option key={b}>{b}</option>)}</select></label>
        <label className="text-[14px]">Project type<select name="type" className={field} defaultValue={types[0]}>{types.map((t) => <option key={t}>{t}</option>)}</select></label>
        <label className="text-[14px] md:col-span-2">Message<textarea name="message" rows={5} className={field} placeholder="What are you making, and when do you need it?" aria-invalid={!!errors.message} aria-describedby="e-msg" /><span id="e-msg" className="mt-1 block text-[13px] text-terracotta">{errors.message}</span></label>
        <div className="flex flex-wrap items-center gap-4 md:col-span-2">
          <button type="submit" disabled={state === "sending"} className="min-h-12 rounded-full bg-terracotta px-7 text-[15px] font-medium text-ink transition-colors hover:bg-[#dd7550] disabled:opacity-60">{state === "sending" ? "Sending…" : "Send message →"}</button>
          {state === "error" && (
            <p className="text-[14px] text-cotton/85" role="alert">
              Hmm, that didn&apos;t go through. Please try again, or <a className="text-terracotta underline underline-offset-4" href={`mailto:${EMAIL}`}>email me at {EMAIL}</a>.
            </p>
          )}
        </div>
      </form>
      <EmailDirect />
    </div>
  );
}
