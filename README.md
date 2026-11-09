# HiNacho portfolio

Next.js (App Router) + TypeScript + Tailwind v4 + GSAP/Lenis. All editable contact details live in
`src/content/site.config.ts`; project copy lives in `src/content/projects.ts`.

```bash
npm run dev            # local dev server (http://localhost:3000)
npm run build          # production build
node scripts/media.mjs # after adding images/videos to assets/
```

## Contact form email notifications (Netlify)

The contact form is a Netlify Form named **`contact`**. Netlify detects it at build time from
`public/__forms.html` (keep that file). Submissions only work on the deployed Netlify site; on
localhost the form opens a prefilled email to hellotodickson@gmail.com instead.

**One-time setup after the first deploy:**

1. In the Netlify dashboard, open the site and go to the **Forms** tab. If you see
   **Enable form detection**, click it, then redeploy (**Deploys → Trigger deploy → Deploy site**)
   so Netlify picks up the `contact` form. It should then appear in the Forms list.
2. Go to **Site configuration → Notifications → Emails and webhooks** (newer accounts label it
   **Project configuration** instead of Site configuration).
3. Under **Form submission notifications**, click **Add notification → Email notification**.
4. Set **Email to notify** to `hellotodickson@gmail.com`, choose the **`contact`** form, and **Save**.

New submissions then arrive by email and are also listed under the site's **Forms** tab. Spam is
filtered by the honeypot field (`bot-field`) plus Netlify's own spam filter; check **Forms → Spam
submissions** occasionally in case a real message gets flagged.
