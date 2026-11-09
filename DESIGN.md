# HiNacho — ADIRE · Design document

## 0. Creative direction
- **Concept line:** The site is a living piece of Yoruba indigo resist-dyed cloth. Like starch under dye, the work is *revealed*.
- **Hero object:** my work, the seven project videos, revealed through indigo cloth. The HN wooden monogram is the one 3D statement.
- **Mood words:** calm · crafted · alive
- **Tagline (recommended):** *"Every great site starts as plain cloth."* (hero H1, key word **cloth** gets the hand-drawn underline).
  The alternate *"Premium web experiences, dyed in Lagos."* becomes the meta description / OG line, so both earn a place.
- **Assumptions:** primary conversion = Book a call ([CALENDLY_URL]); secondary = contact form. Owner name "Victor" is placeholder copy. Deploy target Netlify.

## 1. Sitemap
```
/                 Home
/work             All projects (bento ⇄ list view, filters)
/work/[slug]      Case study ×7 (halcyon, noto, helio, atelier-eko, aquaro, aunty-alice, mcroyal)
/about            Story, adire note, stack, how I work
/contact          Form + Book a call
/404              "This page wasn't dyed yet."
Modal: "About the pattern" (footer link, on every page)
Easter egg: press "A" anywhere → full-screen pattern playground (Esc to close)
```

## 2. Colour system
| Token | Hex | Use | Contrast on #0B1938 |
|---|---|---|---|
| `--indigo-black` | #0B1938 | page background | — |
| `--indigo` | #152746 | cards, sections | — |
| `--line` | rgba(234,231,218,.08) | 1px borders | — |
| `--cotton` | #EAE7DA | text | 14.6:1 ✅ |
| `--muted` | #8A97AE | secondary text | 6.0:1 ✅ (5.2:1 on #152746 ✅) |
| `--faded` | #435368 | pattern lines only, never text | 2.2:1 (decorative) |
| `--terracotta` | #D2643C | CTAs, highlights, active states only | button text: #0B1938 on terracotta = 4.6:1 ✅ (cotton on terracotta ≈ 3.4:1 ✗ → use indigo-black text, or cotton only at ≥ 24px bold) |
| `--danfo` | #F7C21B | **exactly 2 uses:** the "Available" dot, and the hover state of the footer "Made in Lagos" | — |
| texture cream | ~#C5B18D | inside adire photos only (intended) | — |

Cloth grain: inline SVG `feTurbulence` noise (≈1KB) at 6% over surfaces; `tile-1` blended at 4% on the hero and footer only.

## 3. Type
Display options (all free; pick one):
1. **Bricolage Grotesque** (Google Fonts): chunky, slightly irregular ink-trap feel; strongest "hand-made" read. *(Recommended)*
2. **Clash Display** (Fontshare, Indian Type Foundry): tighter and more fashion-led.
3. **An African-designed face:** I'll shortlist free display faces by African type designers (with verified designer credits) and add the best fit here. I won't name or credit one until I've verified the designer.

Body: **Inter** (400/500). Labels: Inter 500, 12px, uppercase, +0.16em tracking.
Scale: hero `clamp(3rem, 7.5vw, 8rem)` / h2 `clamp(2.25rem, 4.5vw, 4.75rem)` / h3 `clamp(1.4rem, 2vw, 1.9rem)` / body 16–17px / small 14px. Display at 600, leading 0.95–1.02, tracking −0.03em, line breaks set by hand.
Yoruba diacritics (Ẹ káàbọ̀, Ẹ ṣé) must render correctly: subset includes Latin Extended Additional; check glyph coverage when the font is chosen.

## 4. Layout & components
- Container 1320px, gutter `clamp(16px, 4vw, 48px)`, section padding `clamp(96px, 13vw, 192px)`.
- Cards: radius 24px (media 20px, pills 999px), `--indigo` fill, 1px `--line`. Hover: an irregular dashed SVG "stitch" border draws around the card (path with jittered dash array, from the engine's `line()`).
- Buttons: terracotta pill, indigo-black text, 15px/500, 14×26 padding; arrow nudges 4px. Secondary: cotton outline pill.
- Pattern frame: every project tile has its own `generatePattern({ seed: slug })` as a 10px-wide border/mask ring.
- Pattern band (divider): `generateBand(seed)` at 40–56px tall.

## 5. Home: section by section
| # | Section | Layout | Background | Content |
|---|---|---|---|---|
| a | Loader | centred cotton square 220px | indigo-black | cotton-palette pattern draws on, then "Dyeing your experience…" |
| b | Nav | floating glass pill, top 16px | blur(14px) over rgba(11,25,56,.6) | HN · Work/About/Services · sound toggle (hidden until audio exists) · terracotta "Book a call" + danfo dot |
| c | Hero "unresist" | eyebrow + 2-line H1 + CTA top-left; 7-tile bento below (12-col: Halcyon 6×2, Noto 3×2, helio 3×1, Atelier 3×1, Aquaro 4×1, Aunty Alice 4×1, McRoyal 4×1) | starts cotton → dye floods to indigo | "Ẹ káàbọ̀" · *Every great site / starts as plain **cloth**.* · Book a call |
| e | Marquee | full-bleed 1 line, display 64px | indigo with band top/bottom | DESIGN · BUILD · MOTION · LAUNCH · MADE IN LAGOS · motif separators |
| f | About teaser | full-bleed cinematic 21:9 band, text left on the image's open space | portrait-hero / placeholder | "I'm Victor, a web designer and developer in Lagos…" [BIO DRAFT] · More about me → |
| g | Services loom | sticky left title; 4 threads weaving → "Your Brand" strip; cards beside each thread | indigo | Design · Build · Motion · Launch (1 line each) |
| h | Selected work | editorial bento with stills: Halcyon hero 8×2, others mixed | indigo-black | name, type, year; click → case study |
| i | Process | 4 horizontal panels (vertical on mobile) | drape-1 at 12% | Discover → Design → Build → Launch; each panel dyes cotton → indigo |
| j | Proof | carousel + 3 stat cards | indigo | **hidden entirely until placeholders are filled** (no empty section shows) |
| k | 3D statement | mark centred; text lines around it | indigo-black + terracotta glow | "Built to be remembered." (alts: "Made by hand. Built to last." / "Cloth fades. Good work doesn't.") |
| l | Globe CTA | globe right 55%, copy left | indigo-black | *Stitched in Lagos. / Worn worldwide.* · Let's do something proper. · Book a call |
| m | Footer | 4 columns + loom band + legal line | indigo | email, WhatsApp, socials, nav, About the pattern, © 2026 HiNacho. Made in Lagos. |

Rhythm check: cotton→indigo hero · band · photo · sticky diagram · gallery · photo-texture strip · cards · 3D · globe · footer. No two neighbours alike.

## 6. Other pages
- **/work:** filter pills (All, Web, Web & Motion, E-commerce, Client, Concept) with a terracotta active pill; tiles reflow using FLIP (GSAP Flip). Toggle Grid ⇄ List. In list view: big display names, and on hover a 320×200 video preview follows the cursor (lerp 0.12).
- **/work/[slug]:** hero video full-bleed (clip-path reveal) → overview rail (Role, Stack, Year, Status, Live ↗) → Challenge → Approach → Key features (stills, alternating) → Results/learnings (no invented numbers) → Next project (pattern band + big name). Accent band = project's seed pattern. Copy marked `[DRAFT]`.
- **/about:** portrait 4:5 + story; "Why adire" with panels/stack/detail images, each captioned *"Digital texture, inspired by adire"*; stack logos (Next.js, React, TypeScript, Tailwind, GSAP, Three.js, Figma, Webflow? to confirm); how I work (4 points).
- **/contact:** name, email, budget (select), project type (select), message; inline validation; Netlify Forms (`data-netlify`, honeypot) with a mailto fallback; success state "Ẹ ṣé! I'll reply within 24 hours."
- **404:** full-screen pattern that regenerates every 4s (crossfade) + "This page wasn't dyed yet." + Back home.

## 7. MOTION MAP
Eases: `dye` = cubic-bezier(.22,1,.36,1) (expo-out-ish) for entrances · `cloth` = cubic-bezier(.65,0,.35,1) for wipes · `none` for scrubs. Global: Lenis lerp 0.09.

| Moment | Trigger | Duration | Easing | Notes |
|---|---|---|---|---|
| Loader pattern draw-on | first visit (sessionStorage flag) | 1.0s, strokes staggered 0.012s | dye | then text fade 0.25s, then square scales into hero 0.35s; total ≤ 1.5s |
| Hero dye flood (shader) | after loader / on load | 1.6s | cloth | noise-driven edge-in flood; uniform `uProgress` 0→1; starch pattern stays lighter, then becomes tiles |
| Hero H1 lines | flood 40% | 0.9s, stagger 0.08 | dye | yPercent 110→0 + blur 8px→0 + indigo text-shadow fade ("dye bleed") |
| Underline on "cloth" | H1 done | 0.7s | dye | SVG stroke-dashoffset, hand-drawn path |
| Bento tiles enter | flood 60% | 0.8s, stagger 0.06 | dye | opacity + y 30→0 + scale .96→1 |
| Tile parallax | scroll + mouse | continuous | lerp .08 | depth data-speed −0.1..0.15; mouse ±8px |
| Tile hover | pointerenter | 0.45s | dye | inner video scale 1.03, overlay darkens 0→.25 ("fresh dip"), pattern border draws in 0.6s |
| Tile video play | IntersectionObserver ≥ 35% | — | — | pause when out |
| Cursor dye trail | pointermove (desktop) | fade 1.2s | — | WebGL ping-pong fluid at ¼ res |
| Custom cursor → cowrie "View" | over tiles | 0.3s | dye | scale 0.3→1 |
| Idle cowrie | 6s no input on hero | 9s traverse | sine | once per visit |
| Nav | scroll > 40px | 0.4s | dye | background opacity .3→.7; hides on fast down scroll, returns on up |
| Magnetic CTA | pointer within 80px | follow | lerp .15 | max 10px |
| Marquee | always | 40s loop | linear | speed × (1 + clamp(velocity/1500, 0, 1.5)) |
| Divider ripple | scroll velocity | settle 0.6s | dye | skewY ±3°, SVG displacement scale 0→8 |
| Living cloth (bands/borders) | always, in view | 8s cycle | sine | feTurbulence baseFrequency drift (very small) |
| Section pattern draw-on | section top at 75% | 1.1s, stagger 0.02 | dye | pathLength=1 dashoffset 1→0 |
| Headline reveals (all h2) | top 75% | 0.9s, stagger 0.08 | dye | same as hero, smaller blur |
| About band | scroll through | scrub | none | image scale 1.15→1, y −8% |
| Loom threads | pinned 150% | scrub 0.8 | none | 4 paths draw, then cross over/under into strip; "Your Brand" label fades at 90% |
| Selected work tiles | top 80% | 0.8s, stagger 0.07 | dye | clip-path inset 12%→0 + image 1.15→1 |
| Process dye | each panel crosses centre | scrub | none | panel bg cotton→indigo via clip-path from bottom, text colour swaps at 50% |
| Stat roll | top 80% | 1.6s | power2.out | only once filled |
| 3D mark | section in view | 20s/turn | linear | + tilt to cursor (damped .08, max 15°), scroll adds ±0.4 rad, bob 0.04 @ 0.4Hz |
| Statement lines | top 70% | 0.9s, stagger 0.15 | dye | |
| Globe | in view | auto-rotate 0.003 rad/frame | — | arcs draw 1.2s staggered 0.2; tags fade in |
| Footer loom band | always | 60s loop | linear | translateX loop |
| Route transition | link click | out 0.5s / in 0.6s | cloth | indigo dye wipe with noisy edge (SVG mask), pattern visible in the wipe |
| Filter reflow (/work) | filter click | 0.6s | dye | GSAP Flip |
| List-view preview | hover name | in 0.35s | dye | follows cursor lerp .12; clip-path reveal |

**Reduced motion / low power:** no Lenis, no shaders, no cursor trail, no pins, no parallax; all reveals become 0.4s opacity fades; hero shows the final indigo bento; 3D and globe become static images. Low power = `deviceMemory ≤ 4` or `hardwareConcurrency ≤ 4` or measured FPS < 45 for 1s.
**Mobile (< 768):** line reveals, pattern draw-on, marquee, footer loom, process dye (vertical) kept; hero flood uses a CSS mask animation instead of WebGL; no cursor effects; parallax off.

## 8. Shader plan
1. **Dye flood (hero):** a fullscreen quad with fragment shader in a single canvas over the bento. Inputs: `uProgress`, `uTime`, `uStarch` (pattern texture from `patternToCanvas`, cotton palette), simplex fbm. `mask = smoothstep(p-0.08, p, fbm(uv*3)+edgeDist*1.2)`. Colour = mix(cotton, indigo, mask) with darker fringe at the front (dye pooling) and the starch lines resisting (stay cotton longer). Canvas removed after it finishes (no ongoing cost). Mobile fallback: CSS `mask-image` with an animated SVG turbulence mask.
2. **Cursor dye:** minimal stable-fluid (advect + splat + dissipate), 4 passes at ¼ resolution, colour #1E3A8A→#152746, alpha 0.35, `mix-blend-mode: multiply` over light/soft-light over dark. Paused when hidden or idle 2s.
3. **Living cloth:** no WebGL; SVG `feDisplacementMap` with animated `baseFrequency` on bands (cheap, filter-only).
Libraries: `ogl` (≈ 25KB) for shaders 1–2 instead of three.js, so three is only loaded for the 3D mark.

## 9. 3D mark plan
- react-three-fiber + drei, dynamically imported when section is within 1 viewport.
- `<Text3D>` "HN": typeface JSON converted from the chosen display font (Bold), bundled in `/public/fonts/`. size 1.2, height 0.35, bevel 0.03×6, curveSegments 12, `<Center>`; optional RoundedBox plinth (3.2×0.25×1.2, radius 0.08).
- Wood: MeshPhysicalMaterial #2A1A12, roughness 0.6, clearcoat 0.15, clearcoatRoughness 0.4; procedural grain canvas (stretched fbm bands, 1024²) → map + roughnessMap.
- Engraving: `generatePattern({ seed: "HN", motifs: ["spirals","dots","leaves"], palette: {ground:"#000",ink:"#fff"} })` → canvas → bumpMap (scale 0.02) + multiplied 15% dark into map; projected planar on front faces via a custom UV group (front material slot).
- Lights: directional white key top-left 1.2; spot #D2643C behind-right intensity 30, angle 0.5; ambient 0.15; `<Environment preset="city" environmentIntensity={0.25}>`.
- Perf: dpr [1, 1.5], `frameloop="demand"` + invalidate while visible, paused off-screen, fallback `/public/3d/monogram-fallback.png` (rendered from the scene via `gl.domElement.toDataURL`).

## 10. Tech architecture
Next.js 15 App Router + TS + Tailwind v4 + GSAP (ScrollTrigger, Flip, @gsap/react) + Lenis + ogl + r3f/drei (lazy) + cobe (globe, ~5KB).
```
src/app/(site)/page.tsx, work/, work/[slug]/, about/, contact/, not-found.tsx, opengraph-image.tsx
src/components/{ui,sections,motion,three,cloth}/
src/content/projects.ts, site.ts (all copy & placeholders)
src/lib/adire/ (engine), lib/motion.ts, lib/perf.ts (low-power detection)
public/media/projects/<slug>/ (mp4, webm, avif/webp stills)
```
Media pipeline: script with ffmpeg → WebM (VP9, CRF 36, no audio); sharp → AVIF/WebP at 640/1024/1600; adire textures at quality 45.

## 11. Cultural notes
- Yoruba/Lagos references only: adire eleko (starch-painted), aso-oke weaving (the loom section and stitch borders), Yoruba woodcarving (the wooden HN mark), Lagos street energy (danfo yellow wink, marquee, ambient audio).
- No kente, no generic "tribal" patterns, no sacred symbols (e.g. no Ifá divination imagery, no òrìṣà iconography).
- All patterns are generated in code, inspired by eleko's visual language; the reference photo is never displayed, traced or sampled for shapes.
- AI-generated textures are always captioned as digital. Real handmade adire only appears with an artisan credit: [ARTISAN CREDIT].
- **About the pattern modal:** "The patterns and textures on this site are digital, inspired by adire, the indigo resist-dyed cloth of the Yoruba. In adire eleko, artisans paint designs onto cotton with a cassava-starch paste; the cloth is dipped in indigo, and when the starch is washed away, the pattern appears in the lighter, undyed areas. Abeokuta and Ibadan are long-standing centres of the craft."
- Yoruba copy (Ẹ káàbọ̀, Ẹ ṣé) to be checked by a native speaker before launch [YORUBA REVIEW].

## 12. Placeholders (hidden until filled)
[TESTIMONIAL ×n: name, role, quote] (first: Aunty Alice College, McRoyal Schools owners) · [STAT ×3: number + label] · liveUrl ×7 · McRoyal [CLIENT or CONCEPT] · [CALENDLY_URL] · email · WhatsApp · GitHub/LinkedIn/Instagram/X · [BIO DRAFT] · me/ portraits ×3 · globe cities · [ARTISAN CREDIT] · audio files · [YORUBA REVIEW] · display font choice.
